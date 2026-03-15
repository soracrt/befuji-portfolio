import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const QUOTES_FILE = join(process.cwd(), 'data', 'quotes.json')

function saveQuote(entry: object) {
  try {
    const existing = JSON.parse(readFileSync(QUOTES_FILE, 'utf-8'))
    existing.unshift(entry)
    writeFileSync(QUOTES_FILE, JSON.stringify(existing, null, 2))
  } catch {
    writeFileSync(QUOTES_FILE, JSON.stringify([entry], null, 2))
  }
}

const resend = new Resend(process.env.RESEND_API_KEY)

function row(label: string, value: string | undefined) {
  if (!value) return ''
  return `
    <tr>
      <td style="padding:7px 0;color:#888;width:44%;vertical-align:top;font-size:13px">${label}</td>
      <td style="padding:7px 0;font-weight:500;font-size:13px;color:#111">${value}</td>
    </tr>`
}

function section(title: string, content: string) {
  return `
    <tr>
      <td colspan="2" style="padding:20px 0 6px;border-top:1px solid #eee;font-size:10px;color:#bbb;letter-spacing:0.12em;text-transform:uppercase;font-weight:600">
        ${title}
      </td>
    </tr>
    ${content}`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      service, motionWho,
      videoFor, trackLength, styleRef, existingAssets,
      adFor, saasVideoFor, platforms, scriptReady, brandKit,
      pages, contentReady, features, webTimeline,
      name, email, description, timezone, contact,
    } = body

    let trackRows = ''
    if (service === 'Motion Graphics') {
      trackRows += row('Who', motionWho)
      if (motionWho === 'Artist') {
        trackRows += row('Video for',       videoFor)
        trackRows += row('Track length',    trackLength)
        trackRows += row('Style reference', styleRef)
        trackRows += row('Existing assets', existingAssets)
      } else if (motionWho === 'Brand') {
        trackRows += row('Ad for',       adFor)
        trackRows += row('Platforms',    platforms)
        trackRows += row('Script ready', scriptReady)
        trackRows += row('Brand kit',    brandKit)
      } else if (motionWho === 'SaaS') {
        trackRows += row('Video for',    saasVideoFor)
        trackRows += row('Platforms',    platforms)
        trackRows += row('Script ready', scriptReady)
        trackRows += row('Brand kit',    brandKit)
      }
    } else if (service === 'Web Design') {
      trackRows += row('Pages needed',  pages)
      trackRows += row('Content ready', contentReady)
      trackRows += row('Brand kit',     brandKit)
      trackRows += row('Features',      features)
      trackRows += row('Timeline',      webTimeline)
    }

    const descSection = description
      ? section('Project description', `
          <tr>
            <td colspan="2" style="padding:8px 0 4px;font-size:13px;color:#333;line-height:1.7">
              ${String(description).replace(/\n/g, '<br/>')}
            </td>
          </tr>`)
      : ''

    saveQuote({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      status: 'new',
      name, email, contact, timezone, service, description,
      motionWho, videoFor, trackLength, styleRef, existingAssets,
      adFor, saasVideoFor, platforms, scriptReady, brandKit,
      pages, contentReady, features, webTimeline,
    })

    // Email notification is best-effort — a failure here does not fail the submission
    try {
      await resend.emails.send({
        from:    'kulaire <onboarding@resend.dev>',
        to:      process.env.NOTIFY_EMAIL ?? '',
        subject: `New quote — ${service} · ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;color:#111;font-size:14px;line-height:1.5">
            <div style="margin-bottom:28px">
              <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:#111">New quote request</p>
              <p style="margin:0;color:#CF5C36;font-size:13px;font-weight:500">${service}</p>
            </div>
            <table style="width:100%;border-collapse:collapse">
              ${section('Contact', row('Name', name) + row('Email', email) + row('Timezone', timezone) + row('Phone / Discord', contact))}
              ${trackRows ? section(service, trackRows) : ''}
              ${descSection}
            </table>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('[api/quote] email notification failed (submission still saved):', emailErr)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/quote]', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
