import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'

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

export async function GET() {
  try {
    const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: '_links.json' }))
    const text = await res.Body?.transformToString()
    const links = text ? JSON.parse(text) : {}
    return NextResponse.json(links, {
      headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' },
    })
  } catch {
    return NextResponse.json({})
  }
}
