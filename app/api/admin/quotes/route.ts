import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
  },
})

const BUCKET   = process.env.R2_BUCKET_NAME ?? ''
const DATA_KEY = '_quotes.json'

export type QuoteEntry = {
  id: string
  timestamp: string
  status: 'new' | 'seen' | 'archived'
  name: string
  email: string
  contact: string
  timezone: string
  service: string
  description: string
  motionWho?: string
  videoFor?: string
  trackLength?: string
  styleRef?: string
  existingAssets?: string
  adFor?: string
  saasVideoFor?: string
  platforms?: string
  scriptReady?: string
  brandKit?: string
  pages?: string
  contentReady?: string
  features?: string
  webTimeline?: string
}

let cache: { data: QuoteEntry[]; ts: number } | null = null
const CACHE_TTL = 30_000

async function readQuotes(): Promise<QuoteEntry[]> {
  if (cache !== null && Date.now() - cache.ts < CACHE_TTL) return cache.data

  try {
    const res  = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: DATA_KEY }))
    const text = await res.Body?.transformToString()
    if (text) {
      const data = JSON.parse(text) as QuoteEntry[]
      cache = { data, ts: Date.now() }
      return data
    }
  } catch {}

  try {
    const text = await fs.readFile(path.join(process.cwd(), 'data', 'quotes.json'), 'utf-8')
    const data = JSON.parse(text) as QuoteEntry[]
    cache = { data, ts: Date.now() }
    return data
  } catch {}

  cache = { data: [], ts: Date.now() }
  return []
}

async function writeQuotes(quotes: QuoteEntry[]) {
  cache = { data: quotes, ts: Date.now() }
  await s3.send(new PutObjectCommand({
    Bucket:      BUCKET,
    Key:         DATA_KEY,
    Body:        JSON.stringify(quotes, null, 2),
    ContentType: 'application/json',
  }))
}

export async function GET() {
  try {
    return NextResponse.json(await readQuotes(), {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
    })
  } catch (err) {
    console.error('[api/admin/quotes GET]', err)
    return NextResponse.json([], { status: 200 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json()
    const quotes = await readQuotes()
    const idx = quotes.findIndex(q => q.id === id)
    if (idx !== -1) {
      quotes[idx].status = status
      await writeQuotes(quotes)
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/admin/quotes PATCH]', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    const quotes = (await readQuotes()).filter(q => q.id !== id)
    await writeQuotes(quotes)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/admin/quotes DELETE]', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
