'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  images: string[]
  index: number | null
  onClose: () => void
}

export default function AdvancedLightbox({ images, index, onClose }: Props) {
  const [current, setCurrent] = useState(index ?? 0)
  const [scale, setScale] = useState(1)
  const touchStartX = useRef<number | null>(null)
  const touchDeltaX = useRef(0)

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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    touchStartX.current = e.touches[0].clientX
    touchDeltaX.current = 0
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || e.touches.length !== 1) return
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null) return
    const swipeThreshold = 60
    if (touchDeltaX.current <= -swipeThreshold) next()
    if (touchDeltaX.current >= swipeThreshold) prev()
    touchStartX.current = null
    touchDeltaX.current = 0
  }

  if (index === null) return null

  return (
    <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center">

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute z-[120] top-3 left-3 sm:top-4 sm:left-4 text-white text-3xl bg-black/50 border border-white/30 rounded-full w-11 h-11 flex items-center justify-center"
      >
        ✕
      </button>

      {/* Prev */}
      <button
        onClick={prev}
        className="absolute z-[120] left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-4xl bg-black/50 border border-white/30 rounded-full w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center"
        aria-label="Ảnh trước"
      >
        ‹
      </button>

      {/* Next */}
      <button
        onClick={next}
        className="absolute z-[120] right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-4xl bg-black/50 border border-white/30 rounded-full w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center"
        aria-label="Ảnh tiếp theo"
      >
        ›
      </button>

      {/* Image */}
      <img
        src={images[current]}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="max-w-[90%] max-h-[90%] transition-transform duration-200"
        style={{
          transform: `scale(${scale})`,
          touchAction: 'pan-y',
        }}
      />
    </div>
  )
}