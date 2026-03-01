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
const DATA_KEY = '_projects.json'

// In-memory cache — avoids a redundant R2 read before every write.
// Valid for the lifetime of this serverless instance (typically minutes).
let cache: unknown[] | null = null

async function readProjects(): Promise<unknown[]> {
  if (cache !== null) return cache

  // Try R2 first
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

  // Fall back to the committed local file (first deploy seed)
  try {
    const localFile = path.join(process.cwd(), 'data', 'projects.json')
    const text = await fs.readFile(localFile, 'utf-8')
    cache = JSON.parse(text)
    return cache!
  } catch {
    cache = []
    return []
  }
}

async function writeProjects(projects: unknown[]) {
  cache = projects // update cache synchronously so next read is instant
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: DATA_KEY,
    Body: JSON.stringify(projects, null, 2),
    ContentType: 'application/json',
  }))
}

export async function GET() {
  try {
    const projects = await readProjects()
    return NextResponse.json(projects, {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
    })
  } catch (err) {
    console.error('[api/admin/projects GET]', err)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const project = await req.json()
    const projects = await readProjects()
    const next = [...projects, project]
    await writeProjects(next)
    return NextResponse.json(project)
  } catch (err) {
    console.error('[api/admin/projects POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()

    if (Array.isArray(body.order)) {
      const projects = await readProjects()
      const ordered = (body.order as string[])
        .map((id: string) => (projects as { id: string }[]).find((p) => p.id === id))
        .filter(Boolean)
      await writeProjects(ordered)
      return NextResponse.json(ordered)
    }

    const { id, ...updates } = body
    const projects = await readProjects() as { id: string }[]
    const idx = projects.findIndex((p) => p.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const next = [...projects]
    next[idx] = { ...next[idx], ...updates }
    await writeProjects(next)
    return NextResponse.json(next[idx])
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[api/admin/projects PUT]', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    const projects = await readProjects() as { id: string }[]
    const next = projects.filter((p) => p.id !== id)
    await writeProjects(next)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/admin/projects DELETE]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
