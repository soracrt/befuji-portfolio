import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs/promises'
import path from 'path'
import ReviewsClient from './ReviewsClient'

type Review = {
  id: string
  name: string
  service: string
  company?: string
  text: string
  featured: boolean
  createdAt: string
}

async function getReviews(): Promise<Review[]> {
  try {
    const s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
      },
    })
    const res = await s3.send(new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME ?? '',
      Key: '_reviews.json',
    }))
    const text = await res.Body?.transformToString()
    if (text) return JSON.parse(text)
  } catch {}

  try {
    const localFile = path.join(process.cwd(), 'data', 'reviews.json')
    const text = await fs.readFile(localFile, 'utf-8')
    return JSON.parse(text)
  } catch {
    return []
  }
}

export default async function ReviewsPage() {
  const reviews = await getReviews()
  return <ReviewsClient initialReviews={reviews} />
}
