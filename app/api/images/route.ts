import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const imagesDir = path.join(process.cwd(), 'public/images')
  const uploadsDir = path.join(process.cwd(), 'public/uploads')

  const collectImages = (dir: string, prefix: string) => {
    if (!fs.existsSync(dir)) return []
    return fs.readdirSync(dir)
      .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
      .filter(f => prefix === '/uploads/' ? f.includes('-medium.') : true)
      .sort()
      .map(f => `${prefix}${f}`)
  }

  const images = [
    ...collectImages(imagesDir, '/images/'),
    ...collectImages(uploadsDir, '/uploads/'),
  ]

  return NextResponse.json(images, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    },
  })
}
