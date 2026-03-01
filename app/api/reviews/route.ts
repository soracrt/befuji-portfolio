import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
  },
})

const BUCKET = process.env.R2_BUCKET_NAME ?? ''
const DATA_KEY = '_reviews.json'

let cache: unknown[] | null = null

async function readReviews(): Promise<unknown[]> {
  if (cache !== null) return cache

  try {
    const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: DATA_KEY }))
    const text = await res.Body?.transformToString()
    if (text) {
      cache = JSON.parse(text)
      return cache!
    }
  } catch {
    // Key doesn't exist yet — fall through to local seed
  }

  try {
    const localFile = path.join(process.cwd(), 'data', 'reviews.json')
    const text = await fs.readFile(localFile, 'utf-8')
    cache = JSON.parse(text)
    return cache!
  } catch {
    cache = []
    return []
  }
}

async function writeReviews(reviews: unknown[]) {
  cache = reviews
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: DATA_KEY,
    Body: JSON.stringify(reviews, null, 2),
    ContentType: 'application/json',
  }))
}

export async function GET() {
  try {
    const reviews = await readReviews()
    return NextResponse.json(reviews, {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
    })
  } catch (err) {
    console.error('[api/reviews GET]', err)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, service, company, text } = body
    if (!name || !service || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const review = {
      id: `r${Date.now()}`,
      name: String(name).slice(0, 80),
      service: String(service),
      company: company ? String(company).slice(0, 80) : '',
      text: String(text).slice(0, 120),
      featured: false,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    const reviews = await readReviews()
    const next = [...reviews, review]
    await writeReviews(next)
    return NextResponse.json(review)
  } catch (err) {
    console.error('[api/reviews POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...updates } = await req.json()
    const reviews = await readReviews() as { id: string }[]
    const idx = reviews.findIndex(r => r.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const next = [...reviews]
    next[idx] = { ...next[idx], ...updates }
    await writeReviews(next)
    return NextResponse.json(next[idx])
  } catch (err) {
    console.error('[api/reviews PUT]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    const reviews = await readReviews() as { id: string }[]
    const next = reviews.filter(r => r.id !== id)
    await writeReviews(next)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/reviews DELETE]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { order } = await req.json()
    if (!Array.isArray(order)) return NextResponse.json({ error: 'Invalid order' }, { status: 400 })
    const reviews = await readReviews() as { id: string }[]
    const map = new Map(reviews.map(r => [r.id, r]))
    const next = (order as string[]).map(id => map.get(id)).filter(Boolean) as { id: string }[]
    reviews.forEach(r => { if (!(order as string[]).includes(r.id)) next.push(r) })
    await writeReviews(next)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/reviews PATCH]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
