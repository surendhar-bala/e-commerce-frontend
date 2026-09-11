import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getMediaUrl } from '@/lib/media'
import { cn } from '@/lib/utils'
import type { ProductMedia } from '@/types/product'

const MAX_IMAGES = 5

type ProductGalleryProps = {
  media: ProductMedia[]
  name: string
}

type GalleryImage = {
  kind: 'image'
  item: ProductMedia
}

type GalleryVideo = {
  kind: 'video'
  item: ProductMedia
}

type GallerySlide = GalleryImage | GalleryVideo

function isVideo(item: ProductMedia) {
  return item.type === 'video' || /\.(mp4|webm|ogg|mov)(\?|$)/i.test(item.url)
}

function buildSlides(media: ProductMedia[]): GallerySlide[] {
  const images = media.filter((item) => !isVideo(item)).slice(0, MAX_IMAGES)
  const video = media.find((item) => isVideo(item))

  const slides: GallerySlide[] = images.map((item) => ({ kind: 'image', item }))
  if (video) {
    slides.push({ kind: 'video', item: video })
  }
  return slides
}

export function ProductGallery({ media, name }: ProductGalleryProps) {
  const slides = useMemo(() => buildSlides(media), [media])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex(0)
  }, [media])

  const activeSlide = slides[activeIndex]
  const imageCount = slides.filter((slide) => slide.kind === 'image').length
  const hasVideo = slides.some((slide) => slide.kind === 'video')
  const coverImage = slides.find((slide): slide is GalleryImage => slide.kind === 'image')?.item

  const goTo = useCallback(
    (index: number) => {
      if (slides.length === 0) return
      const next = (index + slides.length) % slides.length
      setActiveIndex(next)
    },
    [slides.length],
  )

  if (slides.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-border/60 bg-secondary/40">
        <p className="text-sm text-muted-foreground">No media available</p>
      </div>
    )
  }

  const activeImageIndex =
    activeSlide?.kind === 'image'
      ? slides.slice(0, activeIndex + 1).filter((slide) => slide.kind === 'image').length
      : null

  return (
    <div className="space-y-3">
      <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-secondary/30">
        <div
          className={cn(
            'relative w-full',
            activeSlide?.kind === 'video' ? 'aspect-video bg-black' : 'aspect-square',
          )}
        >
          {activeSlide?.kind === 'image' ? (
            <img
              key={activeSlide.item.id}
              src={getMediaUrl(activeSlide.item, 1200)}
              alt={activeSlide.item.alt || name}
              className="size-full object-cover transition-opacity duration-300"
            />
          ) : activeSlide?.kind === 'video' ? (
            <video
              key={activeSlide.item.id}
              src={activeSlide.item.url}
              controls
              playsInline
              className="size-full object-contain"
              preload="metadata"
            >
              Your browser does not support video playback.
            </video>
          ) : null}

          {activeSlide?.kind === 'image' && imageCount > 1 ? (
            <span className="absolute top-3 right-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium tabular-nums shadow-soft backdrop-blur-sm">
              {activeImageIndex} / {imageCount}
            </span>
          ) : null}

          {activeSlide?.kind === 'video' ? (
            <span className="absolute top-3 right-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium shadow-soft backdrop-blur-sm">
              Video
            </span>
          ) : null}

          {slides.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                className="absolute top-1/2 left-3 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-soft transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                aria-label="Previous media"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                className="absolute top-1/2 right-3 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-soft transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                aria-label="Next media"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          ) : null}
        </div>
      </div>

      {slides.length > 1 ? (
        <div
          className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label={`${name} media`}
        >
          {slides.map((slide, index) => {
            const selected = index === activeIndex
            return (
              <button
                key={slide.item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={
                  slide.kind === 'video'
                    ? `View product video`
                    : `View image ${index + 1} of ${imageCount}`
                }
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'relative size-[4.5rem] shrink-0 snap-start overflow-hidden rounded-xl border-2 transition-all sm:size-20',
                  selected
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-transparent opacity-75 hover:opacity-100',
                )}
              >
                {slide.kind === 'image' ? (
                  <img
                    src={getMediaUrl(slide.item, 160)}
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
