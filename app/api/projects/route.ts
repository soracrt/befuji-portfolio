import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'data', 'projects.json')
    const raw = readFileSync(filePath, 'utf-8')
    const projects = JSON.parse(raw)
    return NextResponse.json(projects)
  } catch (err) {
    console.error('[api/projects] Failed to read projects.json:', err)
    return NextResponse.json([], { status: 500 })
  }
}
