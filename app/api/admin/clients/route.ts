import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const DATA_FILE = join(process.cwd(), 'data', 'clients.json')

function readClients(): ClientLog[] {
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function writeClients(clients: ClientLog[]) {
  writeFileSync(DATA_FILE, JSON.stringify(clients, null, 2))
}

type ClientLog = {
  id: string
  clientName: string
  service: string
  projectName: string
  amount: number
  currency: 'USD' | 'IDR'
  status: 'Paid' | 'Pending' | 'Unpaid'
  date: string
  notes: string
}

export async function GET() {
  return NextResponse.json(readClients())
}

export async function POST(req: Request) {
  const body = await req.json()
  const clients = readClients()
  const client: ClientLog = {
    id: crypto.randomUUID(),
    clientName: body.clientName ?? '',
    service: body.service ?? '',
    projectName: body.projectName ?? '',
    amount: body.amount ?? 0,
    currency: body.currency ?? 'USD',
    status: body.status ?? 'Paid',
    date: body.date ?? new Date().toISOString().split('T')[0],
    notes: body.notes ?? '',
  }
  clients.unshift(client)
  writeClients(clients)
  return NextResponse.json(client)
}

export async function PUT(req: Request) {
  const body = await req.json()
  const clients = readClients()
  const idx = clients.findIndex(c => c.id === body.id)
  if (idx !== -1) {
    clients[idx] = { ...clients[idx], ...body }
    writeClients(clients)
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  const clients = readClients().filter(c => c.id !== id)
  writeClients(clients)
  return NextResponse.json({ ok: true })
}
