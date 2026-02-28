import { NextResponse } from 'next/server'

const LOCAL_VIDEO_URL = 'https://befuji.ngrok.app/NSX.mp4'

export async function GET() {
  try {
    console.log('[video proxy] fetching:', LOCAL_VIDEO_URL)

    const res = await fetch(LOCAL_VIDEO_URL, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) {
      console.log('[video proxy] upstream non-ok response:', res.status, res.statusText)
      return new NextResponse('Video unavailable', { status: 502 })
    }

    const headers = new Headers()
    headers.set('Content-Type', res.headers.get('Content-Type') ?? 'video/mp4')
    const contentLength = res.headers.get('Content-Length')
    if (contentLength) headers.set('Content-Length', contentLength)
    headers.set('Cache-Control', 'no-store')

    return new NextResponse(res.body, { status: 200, headers })
  } catch (err) {
    console.log('[video proxy] fetch error:', err instanceof Error ? err.message : err)
    return new NextResponse('Video unavailable', { status: 502 })
  }
}
