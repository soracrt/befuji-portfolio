import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
  },
})

export async function GET(
  req: NextRequest,
  { params }: { params: { key: string } }
) {
  const key = params.key
  const range = req.headers.get('range') ?? undefined

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME ?? '',
      Key: key,
      ...(range ? { Range: range } : {}),
    })
    const r2 = await s3.send(command)
    if (!r2.Body) return new Response(null, { status: 404 })

    const headers: Record<string, string> = {
      'Content-Type': r2.ContentType ?? 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=86400',
    }
    if (r2.ContentLength != null) headers['Content-Length'] = String(r2.ContentLength)
    if (r2.ContentRange) headers['Content-Range'] = r2.ContentRange

    const body = r2.Body as AsyncIterable<Uint8Array>
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of body) controller.enqueue(chunk)
          controller.close()
        } catch (e) {
          controller.error(e)
        }
      },
    })

    return new Response(stream, { status: range ? 206 : 200, headers })
  } catch (err) {
    console.error('[api/videos]', key, err)
    return new Response('Not found', { status: 404 })
  }
}
