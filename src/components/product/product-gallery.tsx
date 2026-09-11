import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  PRODUCT_MEDIA_CAROUSEL_INTERVAL_MS,
  ProductMediaCarousel,
} from '@/components/product/product-media-carousel'
import { getMediaUrl } from '@/lib/media'
import { getProductMediaSlides, isProductVideo } from '@/lib/product-media'
import { cn } from '@/lib/utils'
import type { ProductMedia } from '@/types/product'

type ProductGalleryProps = {
  media: ProductMedia[]
  name: string
}

export function ProductGallery({ media, name }: ProductGalleryProps) {
  const slides = useMemo(() => getProductMediaSlides(media), [media])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex(0)
  }, [media])

  useEffect(() => {
    if (slides.length <= 1) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, PRODUCT_MEDIA_CAROUSEL_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [slides.length])

  const goTo = useCallback(
    (index: number) => {
      if (slides.length === 0) return
      const next = (index + slides.length) % slides.length
      setActiveIndex(next)
    },
    [slides.length],
  )

  const activeSlide = slides[activeIndex]
  const imageCount = slides.filter((slide) => !isProductVideo(slide)).length
  const hasVideo = slides.some((slide) => isProductVideo(slide))
  const coverImage = slides.find((slide) => !isProductVideo(slide))

  if (slides.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-border/60 bg-secondary/40">
        <p className="text-sm text-muted-foreground">No media available</p>
      </div>
    )
  }

  const activeImageIndex =
    activeSlide && !isProductVideo(activeSlide)
      ? slides.slice(0, activeIndex + 1).filter((slide) => !isProductVideo(slide)).length
      : null

  return (
    <div className="space-y-3">
      <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-secondary/30">
        <ProductMediaCarousel
          media={slides}
          alt={name}
          imageWidth={1200}
          aspectClassName="aspect-square"
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
          autoPlay={false}
        />

        {activeSlide && !isProductVideo(activeSlide) && imageCount > 1 ? (
          <span className="absolute top-3 right-3 z-20 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium tabular-nums shadow-soft backdrop-blur-sm">
            {activeImageIndex} / {imageCount}
          </span>
        ) : null}

        {activeSlide && isProductVideo(activeSlide) ? (
          <span className="absolute top-3 right-3 z-20 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium shadow-soft backdrop-blur-sm">
            Video
          </span>
        ) : null}

        {slides.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              className="absolute top-1/2 left-3 z-20 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-soft transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              aria-label="Previous media"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              className="absolute top-1/2 right-3 z-20 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-soft transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              aria-label="Next media"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        ) : null}
      </div>

      {slides.length > 1 ? (
        <div
          className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label={`${name} media`}
        >
          {slides.map((slide, index) => {
            const selected = index === activeIndex
            const isVideo = isProductVideo(slide)

            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={
                  isVideo ? 'View product video' : `View image ${index + 1} of ${imageCount}`
                }
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'relative size-[4.5rem] shrink-0 snap-start overflow-hidden rounded-xl border-2 transition-all sm:size-20',
                  selected
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-transparent opacity-75 hover:opacity-100',
                )}
              >
                {!isVideo ? (
                  <img
                    src={getMediaUrl(slide, 160)}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <>
                    {coverImage ? (
                      <img
                        src={getMediaUrl(coverImage, 160)}
                        alt=""
                        className="size-full object-cover brightness-75"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center bg-muted" />
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/35">
                      <span className="flex size-8 items-center justify-center rounded-full bg-background/95 text-foreground shadow-soft">
                        <Play className="ml-0.5 size-4 fill-current" />
                      </span>
                    </span>
                  </>
                )}
              </button>
            )
          })}
        </div>
      ) : null}

      {hasVideo && imageCount > 0 ? (
        <p className="text-xs text-muted-foreground">
          {imageCount} {imageCount === 1 ? 'photo' : 'photos'}
          {hasVideo ? ' · 1 video' : ''}
        </p>
      ) : null}
    </div>
  )
}
