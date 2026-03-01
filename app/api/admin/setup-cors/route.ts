import { S3Client, PutBucketCorsCommand } from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
  },
})

export async function POST() {
  const command = new PutBucketCorsCommand({
    Bucket: process.env.R2_BUCKET_NAME ?? '',
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedOrigins: ['https://befuji.com', 'http://localhost:3000'],
          AllowedMethods: ['GET', 'PUT', 'HEAD'],
          AllowedHeaders: ['Content-Type', 'Content-Length', '*'],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  })

  try {
    await s3.send(command)
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
