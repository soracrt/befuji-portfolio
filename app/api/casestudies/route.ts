import { NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { readFileSync } from 'fs'
import { join } from 'path'

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
  },
})

const BUCKET = process.env.R2_BUCKET_NAME ?? ''

const TTL = 30_000
let cache: { data: unknown; ts: number } | null = null

async function getCaseStudies(): Promise<unknown[]> {
  if (cache && Date.now() - cache.ts < TTL) return cache.data as unknown[]

  try {
    const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: '_casestudies.json' }))
    const text = await res.Body?.transformToString()
    const data = text ? JSON.parse(text) : []
    cache = { data, ts: Date.now() }
    return data as unknown[]
  } catch {
    try {
      const raw = readFileSync(join(process.cwd(), 'data', 'casestudies.json'), 'utf-8')
      return JSON.parse(raw)
    } catch {
      return []
    }
  }
}

export const dynamic = 'force-dynamic'

export async function GET() {
  const studies = await getCaseStudies()
  return NextResponse.json(studies)
}
