import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: Request) {
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
          <p><strong>${name}</strong> · <a href="mailto:${email}">${email}</a></p>
          <p style="color:#666;margin:4px 0">${purpose || '—'}</p>
          <blockquote style="border-left:3px solid #CF5C36;margin:12px 0;padding:0 12px;color:#333">
            ${description || '—'}
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
