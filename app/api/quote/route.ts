import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { service, who, audience, ready, budget, extra, name, email, discord } = body

    await resend.emails.send({
      from:    'kulaire <onboarding@resend.dev>',
      to:      process.env.NOTIFY_EMAIL ?? '',
      subject: `New quote request from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;color:#111">
          <h2 style="margin-bottom:24px">New Quote Request</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#666;width:40%">Name</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0;font-weight:600">${email}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Discord</td><td style="padding:8px 0">${discord || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Service</td><td style="padding:8px 0">${service}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Who they are</td><td style="padding:8px 0">${who}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Building for</td><td style="padding:8px 0">${audience}</td></tr>
            <tr><td style="padding:8px 0;color:#666">What's ready</td><td style="padding:8px 0">${ready}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Budget</td><td style="padding:8px 0">${budget}</td></tr>
            <tr><td style="padding:8px 0;color:#666;vertical-align:top">Extra notes</td><td style="padding:8px 0">${extra || '—'}</td></tr>
          </table>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/quote]', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
