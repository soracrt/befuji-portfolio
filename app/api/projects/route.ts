import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'

// Map R2 filenames (without extension) to categories.
// Add entries here as you upload new videos.
const categoryMap: Record<string, string> = {
  'NSX': 'Ads',
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
  },
})

export async function GET() {
  const bucket = process.env.R2_BUCKET_NAME ?? ''
  const publicUrl = process.env.R2_PUBLIC_URL ?? ''

  try {
    const command = new ListObjectsV2Command({ Bucket: bucket })
    const response = await s3.send(command)

    const videos = (response.Contents ?? [])
      .filter((obj) => {
        const key = obj.Key ?? ''
        return /\.(mp4|mov|webm)$/i.test(key)
      })
      .map((obj) => {
        const key = obj.Key ?? ''
        const baseName = key.replace(/\.[^/.]+$/, '')
        const name = baseName.replace(/[-_]/g, ' ')
        return {
          id: key,
          title: name,
          category: categoryMap[baseName] ?? null,
          video: `${publicUrl}/${key}`,
        }
      })

    return NextResponse.json(videos)
  } catch (err) {
    console.error('[api/projects] R2 fetch failed:', err)
    return NextResponse.json({ error: 'Failed to load projects' }, { status: 500 })
  }
}
