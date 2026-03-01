import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'projects.json')

async function readProjects() {
  try {
    const text = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(text)
  } catch {
    return []
  }
}

async function writeProjects(projects: unknown[]) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2))
}

export async function GET() {
  const projects = await readProjects()
  return NextResponse.json(projects)
}

export async function POST(req: Request) {
  const project = await req.json()
  const projects = await readProjects()
  projects.push(project)
  await writeProjects(projects)
  return NextResponse.json(project)
}

export async function PUT(req: Request) {
  const body = await req.json()

  // Reorder: { order: string[] }
  if (Array.isArray(body.order)) {
    const projects = await readProjects()
    const ordered = (body.order as string[])
      .map((id: string) => projects.find((p: { id: string }) => p.id === id))
      .filter(Boolean)
    await writeProjects(ordered)
    return NextResponse.json(ordered)
  }

  // Field update: { id, ...fields }
  const { id, ...updates } = body
  const projects = await readProjects()
  const idx = projects.findIndex((p: { id: string }) => p.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  projects[idx] = { ...projects[idx], ...updates }
  await writeProjects(projects)
  return NextResponse.json(projects[idx])
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  const projects = await readProjects()
  const filtered = projects.filter((p: { id: string }) => p.id !== id)
  await writeProjects(filtered)
  return NextResponse.json({ ok: true })
}
