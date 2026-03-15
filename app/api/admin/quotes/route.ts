import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const DATA_FILE = join(process.cwd(), 'data', 'quotes.json')

export type QuoteEntry = {
  id: string
  timestamp: string
  status: 'new' | 'seen' | 'archived'
  name: string
  email: string
  contact: string
  timezone: string
  service: string
  description: string
  motionWho?: string
  videoFor?: string
  trackLength?: string
  styleRef?: string
  existingAssets?: string
  adFor?: string
  saasVideoFor?: string
  platforms?: string
  scriptReady?: string
  brandKit?: string
  pages?: string
  contentReady?: string
  features?: string
  webTimeline?: string
}

function readQuotes(): QuoteEntry[] {
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function writeQuotes(quotes: QuoteEntry[]) {
  writeFileSync(DATA_FILE, JSON.stringify(quotes, null, 2))
}

export async function GET() {
  return NextResponse.json(readQuotes())
}

export async function PATCH(req: Request) {
  const { id, status } = await req.json()
  const quotes = readQuotes()
  const idx = quotes.findIndex(q => q.id === id)
  if (idx !== -1) {
    quotes[idx].status = status
    writeQuotes(quotes)
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  const quotes = readQuotes().filter(q => q.id !== id)
  writeQuotes(quotes)
  return NextResponse.json({ ok: true })
}
