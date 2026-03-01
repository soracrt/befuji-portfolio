import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!ext || !['mp4', 'mov'].includes(ext)) {
    return NextResponse.json({ error: 'Only mp4 and mov files are allowed' }, { status: 400 })
  }

  // Sanitize filename
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const buffer = Buffer.from(await file.arrayBuffer())
  const publicDir = path.join(process.cwd(), 'public')
  await fs.writeFile(path.join(publicDir, safeName), buffer)

  const baseName = safeName.replace(/\.[^/.]+$/, '')
  const project = {
    id: baseName,
    title: baseName.replace(/[-_]/g, ' '),
    category: '',
    client: '',
    video: `/${safeName}`,
    isRecent: false,
  }

  return NextResponse.json(project)
}
