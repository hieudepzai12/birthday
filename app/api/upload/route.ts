import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  const data = await req.formData()
  const file = data.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const id = uuidv4()

  const uploadDir = path.join(process.cwd(), 'public/images')
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const filename = `${id}.webp`
  const filepath = path.join(uploadDir, filename)

  await sharp(buffer)
    .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(filepath)

  return NextResponse.json({
    image: `/images/${filename}`,
  })
}