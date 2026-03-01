import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextResponse } from 'next/server'

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
  },
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const filename = searchParams.get('filename')
  if (!filename) return NextResponse.json({ error: 'Missing filename' }, { status: 400 })

  const ext = filename.split('.').pop()?.toLowerCase()
  if (!ext || !['mp4', 'mov'].includes(ext)) {
    return NextResponse.json({ error: 'Only mp4/mov allowed' }, { status: 400 })
  }

  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  const contentType = ext === 'mov' ? 'video/quicktime' : 'video/mp4'

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME ?? '',
    Key: safeName,
    ContentType: contentType,
  })

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
  const publicUrl = `/api/videos/${safeName}`

  return NextResponse.json({ url, key: safeName, publicUrl, contentType })
}
