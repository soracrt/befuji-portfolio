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
const DATA_KEY = '_stats.json'

type StatsData = { projects: number; members: number; brands: number }

const defaults: StatsData = { projects: 25, members: 2600, brands: 4 }

async function readStats(): Promise<StatsData> {
  try {
    const res  = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: DATA_KEY }))
    const text = await res.Body?.transformToString()
    if (text) return { ...defaults, ...JSON.parse(text) }
  } catch {}

  try {
    const localFile = path.join(process.cwd(), 'data', 'stats.json')
    const text = await fs.readFile(localFile, 'utf-8')
    return { ...defaults, ...JSON.parse(text) }
  } catch {}

  return defaults
}

async function writeStats(data: StatsData) {
  await s3.send(new PutObjectCommand({
    Bucket:      BUCKET,
    Key:         DATA_KEY,
    Body:        JSON.stringify(data, null, 2),
    ContentType: 'application/json',
  }))
}

export async function GET() {
  try {
    const stats = await readStats()
    return NextResponse.json(stats, {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
    })
  } catch (err) {
    console.error('[api/admin/stats GET]', err)
    return NextResponse.json(defaults)
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const current = await readStats()
    const updated: StatsData = {
      projects: typeof body.projects === 'number' ? body.projects : current.projects,
      members:  typeof body.members  === 'number' ? body.members  : current.members,
      brands:   typeof body.brands   === 'number' ? body.brands   : current.brands,
    }
    await writeStats(updated)
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[api/admin/stats PUT]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
