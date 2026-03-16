import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const SYSTEM = `You are a helpful assistant for Kulaire, a premium motion graphics and web development studio. Answer questions about Kulaire's services concisely and honestly using the information below. If asked something outside this scope, politely redirect to contacting the team.

GENERAL:
- Turnaround: usually 1–5 days. Simpler edits are faster. Coming prepared with a script helps.
- To get started: share your vision, mission, target audience, creative direction, reference videos, brand assets.
- Revisions: 2 rounds included, $15 per additional round.
- Retainers: $250–$500/month depending on output needed.
- Deposit: 50% upfront before work begins. Full payment also accepted.

MOTION GRAPHICS:
- Software: After Effects (motion graphics), Premiere Pro (editing/sound), Figma (storyboarding).
- Scripts: Better to come prepared, but help is available if needed.
- Voiceovers: not provided — client must source their own.
- Brand guidelines: yes, send them over and we'll build around them.
- Video length: no hard limit, 1–2 minutes is the sweet spot.

WEBSITES:
- Types built: portfolios, service sites, marketing pages, SaaS.
- Hosting: Vercel. Serverless free tier has a 2-user limit; beyond that has an extra fee.
- Timeline: 1–2 days if demand is low, up to a week during busy periods.
- Maintenance: $30/month — covers updates, fixes, uptime. Separate from hosting.
- E-commerce: not currently offered, coming soon.

Keep responses short, direct, and on-brand — no fluff. Never invent prices or timelines not listed above.`

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 503 })
  }

  try {
    const { messages } = await req.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    // Initialize client per-request so it always picks up the current env var
    const client = new Anthropic({ apiKey })

    const stream = await client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM,
      messages,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[faq-chat] error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
