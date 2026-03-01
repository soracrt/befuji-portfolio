import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

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
  try {
    const projects = await readProjects()
    return NextResponse.json(projects)
  } catch (err) {
    console.error('[api/admin/projects GET]', err)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const project = await req.json()
    const projects = await readProjects()
    projects.push(project)
    await writeProjects(projects)
    return NextResponse.json(project)
  } catch (err) {
    console.error('[api/admin/projects POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
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
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[api/admin/projects PUT]', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    const projects = await readProjects()
    const filtered = projects.filter((p: { id: string }) => p.id !== id)
    await writeProjects(filtered)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/admin/projects DELETE]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
