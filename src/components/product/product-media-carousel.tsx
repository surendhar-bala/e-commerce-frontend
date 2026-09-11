import { useEffect, useMemo, useState } from 'react'
import { getMediaUrl } from '@/lib/media'
import { getProductMediaSlides, isProductVideo } from '@/lib/product-media'
import { cn } from '@/lib/utils'
import type { ProductMedia } from '@/types/product'

export const PRODUCT_MEDIA_CAROUSEL_INTERVAL_MS = 5000

type ProductMediaCarouselProps = {
  media: ProductMedia[]
  alt: string
  imageWidth?: number
  className?: string
  aspectClassName?: string
  activeIndex?: number
  onActiveIndexChange?: (index: number) => void
  autoPlay?: boolean
}

export function ProductMediaCarousel({
  media,
  alt,
  imageWidth = 720,
  className,
  aspectClassName = 'aspect-square',
  activeIndex: controlledIndex,
  onActiveIndexChange: _onActiveIndexChange,
  autoPlay = true,
}: ProductMediaCarouselProps) {
  const slides = useMemo(() => getProductMediaSlides(media), [media])
  const [internalIndex, setInternalIndex] = useState(0)
  const activeIndex = controlledIndex ?? internalIndex
  const hasMultipleSlides = slides.length > 1

  useEffect(() => {
    setInternalIndex(0)
  }, [slides])

  useEffect(() => {
    if (!autoPlay || !hasMultipleSlides || controlledIndex !== undefined) return

    const timer = window.setInterval(() => {
      setInternalIndex((current) => (current + 1) % slides.length)
    }, PRODUCT_MEDIA_CAROUSEL_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [autoPlay, controlledIndex, hasMultipleSlides, slides.length])

  if (slides.length === 0) {
    return <div className={cn('bg-muted', aspectClassName, className)} />
  }

  if (!hasMultipleSlides) {
    const slide = slides[0]
    if (!slide) {
      return <div className={cn('bg-muted', aspectClassName, className)} />
    }

    return (
      <div className={cn('relative overflow-hidden', aspectClassName, className)}>
        {isProductVideo(slide) ? (
          <video
            src={slide.url}
            className="size-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={getMediaUrl(slide, imageWidth)}
            alt={slide.alt || alt}
            className="size-full object-cover"
          />
        )}
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden', aspectClassName, className)}>
      {slides.map((item, index) => {
        const isActive = index === activeIndex

        return (
          <div
            key={item.id}
            aria-hidden={!isActive}
            className={cn(
              'absolute inset-0 transition-[opacity,transform] duration-700 ease-in-out',
              isActive
                ? 'z-10 scale-100 opacity-100'
                : 'pointer-events-none z-0 scale-[1.02] opacity-0',
            )}
          >
            {isProductVideo(item) ? (
              <video
                src={item.url}
                className="size-full object-cover"
                muted
                playsInline
                autoPlay={isActive}
                preload="metadata"
              />
            ) : (
              <img
                src={getMediaUrl(item, imageWidth)}
                alt={item.alt || alt}
                className="size-full object-cover"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
