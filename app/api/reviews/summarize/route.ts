import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { text } = await req.json()
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI not configured' }, { status: 503 })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: `Condense the following client review to 120 characters or fewer. Keep the core meaning and tone. Output only the condensed review text, nothing else:\n\n${text}`,
          },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('[api/reviews/summarize]', err)
      return NextResponse.json({ error: 'AI request failed' }, { status: 502 })
    }

    const data = await response.json()
    const result: string = data.content?.[0]?.text ?? ''
    return NextResponse.json({ text: result.slice(0, 120) })
  } catch (err) {
    console.error('[api/reviews/summarize]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
