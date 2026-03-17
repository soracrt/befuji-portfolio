import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const rateMap = new Map<string, { count: number; resetAt: number }>()
function checkRate(ip: string) {
  const now = Date.now(), entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) { rateMap.set(ip, { count: 1, resetAt: now + 3_600_000 }); return true }
  if (entry.count >= 5) return false
  entry.count++; return true
}
function esc(s: unknown) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!checkRate(ip)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  try {
    const { name, email, purpose, description } = await req.json()
    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    const to     = process.env.NOTIFY_EMAIL

    if (apiKey && to) {
      const resend = new Resend(apiKey)
      await resend.emails.send({
        from:    'kulaire <hello@kulaire.com>',
        to,
        subject: `New contact from ${name}`,
        html: `
          <p><strong>${esc(name)}</strong> · <a href="mailto:${esc(email)}">${esc(email)}</a></p>
          <p style="color:#666;margin:4px 0">${esc(purpose) || '—'}</p>
          <blockquote style="border-left:3px solid #CF5C36;margin:12px 0;padding:0 12px;color:#333">
            ${esc(description) || '—'}
          </blockquote>
        `,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/contact POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
