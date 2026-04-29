'use client'

import { useEffect, useState } from 'react'

type Props = {
  images: string[]
  index: number | null
  onClose: () => void
}

export default function AdvancedLightbox({ images, index, onClose }: Props) {
  const [current, setCurrent] = useState(index ?? 0)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (index !== null) setCurrent(index)
  }, [index])

  // ESC để đóng
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  const next = () => {
    setCurrent((prev) => (prev + 1) % images.length)
    setScale(1)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length)
    setScale(1)
  }

  // Zoom scroll
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setScale((s) => Math.min(Math.max(1, s + e.deltaY * -0.001), 3))
  }

  if (index === null) return null

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl"
      >
        ✕
      </button>

      {/* Prev */}
      <button
        onClick={prev}
        className="absolute left-4 text-white text-4xl"
      >
        ‹
      </button>

      {/* Next */}
      <button
        onClick={next}
        className="absolute right-4 text-white text-4xl"
      >
        ›
      </button>

      {/* Image */}
      <img
        src={images[current]}
        onWheel={handleWheel}
        className="max-w-[90%] max-h-[90%] transition-transform duration-200"
        style={{
          transform: `scale(${scale})`
        }}
      />
    </div>
  )
}