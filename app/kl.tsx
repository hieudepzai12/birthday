'use client'

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import AdvancedLightbox from '@/components/ui/advancedLightbox'
import Link from 'next/link'
import { ArrowLeft, Cake, Gift, PartyPopper, Sparkles, Volume2, VolumeX } from 'lucide-react'

export default function KLPage() {
  const [images, setImages] = useState<string[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [color, setColor] = useState({ r: 0, g: 217, b: 255 })
  const [isZoomed, setIsZoomed] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [viewportWidth, setViewportWidth] = useState(1280)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isHovering = useRef(false)
  const isDragging = useRef(false)
  const startX = useRef<number | null>(null)
  const velocity = useRef(0)
  const lastX = useRef(0)
  const lastTime = useRef(0)

  const [progress, setProgress] = useState(0)
  const birthdayDecor = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: 8 + ((i * 7) % 84),
        size: 16 + ((i * 5) % 16),
        delay: `${(i % 6) * 0.35}s`,
        duration: `${5 + (i % 5)}s`,
        icon: i % 3 === 0 ? '🎈' : i % 3 === 1 ? '🎉' : '✨',
      })),
    []
  )
  const fireworkBursts = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: 6 + ((i * 7) % 88),
        top: 12 + ((i * 11) % 40),
        size: 42 + ((i * 13) % 28),
        delay: `${(i % 7) * 0.45}s`,
        duration: `${2.2 + ((i * 0.2) % 1.1)}s`,
        color: ['#f472b6', '#22d3ee', '#facc15', '#c084fc'][i % 4],
      })),
    []
  )

  const fetchImages = () => {
    fetch('/api/images', { cache: 'no-store' })
      .then((res) => res.json())
      .then((list: string[]) => {
        setImages(list)
        setActiveIndex((prev) => (list.length ? Math.min(prev, list.length - 1) : 0))
      })
  }

  // ================= LOAD =================
  useEffect(() => {
    fetchImages()
  }, [])

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadMessage('')
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error('Upload thất bại')
      }

      await fetchImages()
      setUploadMessage('Upload ảnh thành công!')
    } catch {
      setUploadMessage('Không thể upload ảnh, thử lại nhé.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  useEffect(() => {
    if (!uploadMessage) return
    const timeout = setTimeout(() => {
      setUploadMessage('')
    }, 2500)

    return () => clearTimeout(timeout)
  }, [uploadMessage])

  useEffect(() => {
    const updateViewport = () => {
      setViewportWidth(window.innerWidth)
    }
    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  // ================= AUDIO =================
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5
      audioRef.current.play().catch(() => {
        // Browser may block autoplay, user can click to play
      })
    }
  }, [])

  const toggleAudio = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }

  // ================= AUTOPLAY =================
  useEffect(() => {
    if (!images.length) return

    const interval = setInterval(() => {
      if (!isHovering.current && !isDragging.current) {
        setActiveIndex((p) => (p + 1) % images.length)
      }
    }, 3000)

    const prog = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 2))
    }, 50)

    return () => {
      clearInterval(interval)
      clearInterval(prog)
    }
  }, [images, activeIndex])

  // ================= KEYBOARD =================
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  })

  const next = () =>
    setActiveIndex((p) => (p + 1) % images.length)

  const prev = () =>
    setActiveIndex((p) => (p - 1 + images.length) % images.length)

  // ================= DRAG =================
  const down = (x: number) => {
    isDragging.current = true
    startX.current = x
    lastX.current = x
    lastTime.current = Date.now()
  }

  const move = (x: number) => {
    if (!isDragging.current) return
    const now = Date.now()
    const dx = x - lastX.current
    velocity.current = dx / (now - lastTime.current)
    lastX.current = x
    lastTime.current = now
  }

  const up = (x: number) => {
    if (!isDragging.current || startX.current === null) return
    const diff = x - startX.current

    if (diff > 80 || velocity.current > 0.5) prev()
    else if (diff < -80 || velocity.current < -0.5) next()

    isDragging.current = false
    startX.current = null
  }

  // ================= COLOR EXTRACT =================
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = images[activeIndex]

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = 30
      canvas.height = 30
      ctx?.drawImage(img, 0, 0, 30, 30)

      const data = ctx?.getImageData(0, 0, 30, 30).data
      if (!data) return

      let r = 0, g = 0, b = 0, count = 0

      for (let i = 0; i < data.length; i += 4) {
        r += data[i]
        g += data[i + 1]
        b += data[i + 2]
        count++
      }

      setColor({
        r: Math.round(r / count),
        g: Math.round(g / count),
        b: Math.round(b / count),
      })
    }
  }, [activeIndex, images])

  const glow = `rgba(${color.r},${color.g},${color.b},0.6)`
  const isMobile = viewportWidth < 768
  const isSmallMobile = viewportWidth < 480
  const carouselSize = isSmallMobile ? 300 : isMobile ? 350 : viewportWidth < 1024 ? 440 : 600
  const imageWidth = isSmallMobile ? 112 : isMobile ? 128 : viewportWidth < 1024 ? 150 : 200
  const imageHeight = isSmallMobile ? 148 : isMobile ? 168 : viewportWidth < 1024 ? 195 : 260
  const radius = Math.round(carouselSize * (isMobile ? 0.36 : 0.34))
  const isLightboxOpen = lightboxIndex !== null

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <audio
        ref={audioRef}
        src="/birthday.mp3"
        loop
        onEnded={(e) => {
          e.currentTarget.currentTime = 0
          e.currentTarget.play()
        }}
      />
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes zoom-in {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1.2);
            opacity: 1;
          }
        }
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        .zoom-animation {
          animation: zoom-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes birthday-float {
          0% {
            transform: translate3d(0, 100vh, 0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          100% {
            transform: translate3d(0, -20vh, 0) rotate(16deg);
            opacity: 0;
          }
        }
        .birthday-particle {
          position: absolute;
          bottom: -20px;
          pointer-events: none;
          user-select: none;
          animation-name: birthday-float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.35));
        }
        @keyframes firework-burst {
          0% {
            transform: translate(-50%, -50%) scale(0.2);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.4);
            opacity: 0;
          }
        }
        @keyframes firework-ring {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 0.75;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
        .firework-burst {
          position: absolute;
          pointer-events: none;
          user-select: none;
          border-radius: 9999px;
          animation-name: firework-burst;
          animation-timing-function: ease-out;
          animation-iteration-count: infinite;
          mix-blend-mode: screen;
          box-shadow:
            0 -28px currentColor,
            0 28px currentColor,
            28px 0 currentColor,
            -28px 0 currentColor,
            20px 20px currentColor,
            -20px -20px currentColor,
            20px -20px currentColor,
            -20px 20px currentColor;
        }
        .firework-ring {
          position: absolute;
          pointer-events: none;
          user-select: none;
          border-radius: 9999px;
          border: 2px solid currentColor;
          animation-name: firework-ring;
          animation-timing-function: ease-out;
          animation-iteration-count: infinite;
          mix-blend-mode: screen;
        }
      `}</style>

      {birthdayDecor.map((item) => (
        <span
          key={item.id}
          className="birthday-particle z-0"
          style={{
            left: `${item.left}%`,
            fontSize: `${item.size}px`,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          {item.icon}
        </span>
      ))}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {fireworkBursts.map((burst) => (
          <div key={burst.id}>
            <span
              className="firework-burst"
              style={{
                left: `${burst.left}%`,
                top: `${burst.top}%`,
                width: `${burst.size / 8}px`,
                height: `${burst.size / 8}px`,
                color: burst.color,
                animationDelay: burst.delay,
                animationDuration: burst.duration,
              }}
            />
            <span
              className="firework-ring"
              style={{
                left: `${burst.left}%`,
                top: `${burst.top}%`,
                width: `${burst.size}px`,
                height: `${burst.size}px`,
                color: burst.color,
                animationDelay: burst.delay,
                animationDuration: burst.duration,
              }}
            />
          </div>
        ))}
      </div>
      
      <div
        className={`fixed top-[max(0.75rem,env(safe-area-inset-top))] left-3 sm:top-6 sm:left-6 z-50 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center gap-1.5 sm:gap-2 shadow-lg max-w-[calc(100vw-8rem)] sm:max-w-none transition-opacity duration-200 ${
          isLightboxOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <Cake className="w-4 h-4 text-pink-300" />
        <span className="text-xs sm:text-sm font-semibold tracking-wide text-yellow-200 truncate">Happy Birthday to Khanh Linh</span>
        <span className="text-sm sm:text-base" aria-hidden="true">🎂</span>
      </div>
      
      <div
        className={`fixed top-[max(0.75rem,env(safe-area-inset-top))] right-3 sm:top-6 sm:right-6 z-50 flex flex-col items-end gap-2 transition-opacity duration-200 ${
          isLightboxOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <Link
          href="/"
          className="relative overflow-hidden px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 border border-white/40 shadow-[0_0_18px_rgba(236,72,153,0.5)] hover:scale-105 hover:shadow-[0_0_24px_rgba(168,85,247,0.65)] transition-all duration-300 flex items-center gap-1.5 sm:gap-2"
        >
          <span className="absolute inset-0 bg-white/20 blur-xl animate-pulse" />
          <ArrowLeft className="w-4 h-4" />
          <span className="relative">Trang chính</span>
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="relative overflow-hidden px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold text-xs sm:text-sm text-black bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 border border-white/60 shadow-[0_0_18px_rgba(251,191,36,0.55)] hover:scale-105 hover:shadow-[0_0_24px_rgba(244,114,182,0.65)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isUploading}
              title="Upload ảnh mới"
            >
              <span className="absolute inset-0 bg-white/25 blur-xl animate-pulse" />
              <span className="relative">{isUploading ? 'Đang upload...' : 'Upload ảnh'}</span>
            </button>
            {uploadMessage && (
              <p className="mt-2 text-xs text-center text-white/90 bg-black/30 rounded px-2 py-1">
                {uploadMessage}
              </p>
            )}
          </div>
          <button
            onClick={toggleAudio}
            className="p-2.5 sm:p-3 bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 border border-white/60 rounded-full shadow-[0_0_18px_rgba(34,211,238,0.55)] hover:shadow-[0_0_24px_rgba(129,140,248,0.7)] transition-all duration-300 transform hover:scale-110"
            title={isMuted ? "Unmute music" : "Mute music"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            ) : (
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            )}
          </button>
        </div>
      </div>

      {/* Background */}
      {images[activeIndex] && (
        <div
          className="absolute inset-0 blur-3xl opacity-40 scale-110"
          style={{
            backgroundImage: `url(${images[activeIndex]})`,
            backgroundSize: 'cover',
          }}
        />
      )}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-3 sm:px-4 pt-32 sm:pt-24 pb-8">

        <div className="flex items-center justify-center gap-1.5 md:gap-3 mb-5 md:mb-8 flex-wrap">
          <PartyPopper className="float-animation w-7 md:w-10 h-7 md:h-10 text-yellow-300" />
          <Cake className="float-animation w-8 md:w-12 h-8 md:h-12 text-pink-400" />
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 text-transparent bg-clip-text text-center">
            HAPPY BIRTHDAY
          </h1>
          <Gift className="float-animation w-7 md:w-10 h-7 md:h-10 text-fuchsia-300" style={{ animationDelay: '0.2s' }} />
          <Sparkles className="float-animation w-7 md:w-10 h-7 md:h-10 text-cyan-300" style={{ animationDelay: '0.35s' }} />
          <Cake className="float-animation w-8 md:w-12 h-8 md:h-12 text-cyan-400" style={{ animationDelay: '0.5s' }} />
        </div>

        <div
          className="relative flex items-center justify-center"
          style={{ width: `${carouselSize}px`, height: `${carouselSize}px` }}
          onMouseEnter={() => (isHovering.current = true)}
          onMouseLeave={() => {
            isHovering.current = false
            setIsZoomed(false)
          }}
          onMouseDown={(e) => down(e.clientX)}
          onMouseMove={(e) => move(e.clientX)}
          onMouseUp={(e) => up(e.clientX)}
          onTouchStart={(e) => down(e.touches[0].clientX)}
          onTouchMove={(e) => move(e.touches[0].clientX)}
          onTouchEnd={(e) => up(e.changedTouches[0].clientX)}
        >
          {images.map((src, i) => {
            const totalImages = images.length
            const anglePerImage = 360 / totalImages
            const imageAngle = anglePerImage * i - anglePerImage * activeIndex
            
            // Tính toán vị trí trong vòng tròn
            const angle = (imageAngle * Math.PI) / 180
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            
            // Tính z-index dựa trên vị trí Y (phía dưới ở trên cùng)
            const zIndex = Math.round((y + radius) * 100)
            
            // Scale dựa trên khoảng cách từ tâm
            const distFromCenter = Math.abs(imageAngle)
            const scale = 1 - (Math.min(distFromCenter, 180) / 180) * 0.3
            
            // Opacity dựa trên khoảng cách
            const opacity = 0.6 + (1 - Math.min(distFromCenter, 180) / 180) * 0.4

            const style = {
              transform: `translateX(${x}px) translateY(${y}px) scale(${scale})`,
              opacity,
              zIndex,
              transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }

            return (
              <div key={i} className="absolute">
                <img
                  src={src}
                  alt={`Birthday image ${i + 1}`}
                  onClick={() => {
                    if (i === activeIndex) {
                      setIsZoomed(true)
                      setTimeout(() => setLightboxIndex(i), 300)
                    } else {
                      setActiveIndex(i)
                    }
                  }}
                  className={`object-cover rounded-xl cursor-pointer shadow-lg hover:shadow-2xl transition-all ${
                    i === activeIndex && isZoomed ? 'zoom-animation' : ''
                  }`}
                  style={{
                    ...style,
                    width: `${imageWidth}px`,
                    height: `${imageHeight}px`,
                    boxShadow: i === activeIndex ? `0 0 60px ${glow}` : `0 4px 20px rgba(0,0,0,0.5)`,
                  }}
                />
              </div>
            )
          })}
          
          {/* Center glow point */}
          <div
            className="absolute w-20 h-20 rounded-full blur-2xl pointer-events-none"
            style={{
              background: glow,
              opacity: 0.3,
            }}
          />
        </div>

        {/* Progress */}
        <div className="w-56 sm:w-64 md:w-80 h-1 bg-white/20 mt-5 sm:mt-6">
          <div
            className="h-full transition-all duration-100"
            style={{
              width: `${progress}%`,
              background: glow,
            }}
          />
        </div>

        {/* Dots */}
        <div className="flex gap-2 mt-4 flex-wrap justify-center">
          {images.map((_, i) => (
            <div
              key={i}
              onClick={() => setActiveIndex(i)}
              className="w-2 h-2 md:w-3 md:h-3 rounded-full cursor-pointer transition-all hover:scale-125"
              style={{
                background:
                  i === activeIndex ? glow : '#888',
              }}
            />
          ))}
        </div>

      </div>
      <AdvancedLightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    </div>
  )
}
