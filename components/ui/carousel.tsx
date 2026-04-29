'use client'

import * as React from 'react'
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type CarouselApi = UseEmblaCarouselType[1]

type CarouselProps = {
  images: string[]
  onSelect: (index: number) => void
  className?: string
}

export const Carousel = React.forwardRef<
  HTMLDivElement,
  CarouselProps
>(({ images, onSelect, className }, ref) => {

  const [carouselRef, api] = useEmblaCarousel({ loop: true })

  const [canPrev, setCanPrev] = React.useState(false)
  const [canNext, setCanNext] = React.useState(false)

  // 👉 update nút prev/next
  const updateState = React.useCallback((api: CarouselApi) => {
    if (!api) return
    setCanPrev(api.canScrollPrev())
    setCanNext(api.canScrollNext())
  }, [])

  React.useEffect(() => {
    if (!api) return

    updateState(api)
    api.on('select', updateState)
    api.on('reInit', updateState)

    return () => {
      api.off('select', updateState)
    }
  }, [api, updateState])

  const scrollPrev = () => api?.scrollPrev()
  const scrollNext = () => api?.scrollNext()

  return (
    <div ref={ref} className={cn('relative', className)}>

      {/* VIEWPORT */}
      <div ref={carouselRef} className="overflow-hidden">
        <div className="flex">

          {images.map((src, index) => (
            <div
              key={index}
              className="min-w-full px-2"
            >
              <img
                src={src}
                onClick={() => onSelect(index)}
                className="w-full h-[300px] object-cover rounded-xl cursor-pointer"
              />
            </div>
          ))}

        </div>
      </div>

      {/* PREV */}
      <Button
        onClick={scrollPrev}
        disabled={!canPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2"
        size="icon"
        variant="outline"
      >
        <ArrowLeft />
      </Button>

      {/* NEXT */}
      <Button
        onClick={scrollNext}
        disabled={!canNext}
        className="absolute right-2 top-1/2 -translate-y-1/2"
        size="icon"
        variant="outline"
      >
        <ArrowRight />
      </Button>
    </div>
  )
})

Carousel.displayName = 'Carousel'