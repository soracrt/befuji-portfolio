import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { password } = await req.json()
  console.log('[verify] ADMIN_PASSWORD loaded:', !!process.env.ADMIN_PASSWORD)
  if (password === process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ ok: false }, { status: 401 })
}
