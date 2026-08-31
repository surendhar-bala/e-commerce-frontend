import { useState } from 'react'
import { getMediaUrl } from '@/lib/media'
import { cn } from '@/lib/utils'
import type { ProductMedia } from '@/types/product'

type ProductGalleryProps = {
  media: ProductMedia[]
  name: string
}

export function ProductGallery({ media, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = media[activeIndex] ?? media[0]

  if (!active) {
    return <div className="aspect-square rounded-2xl bg-secondary" />
  }

  return (
    <div className="grid gap-3 md:grid-cols-[72px_1fr] md:gap-4">
      <div className="order-2 flex gap-2 overflow-x-auto md:order-1 md:flex-col">
        {media.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              'size-[72px] shrink-0 overflow-hidden rounded-lg border',
              index === activeIndex ? 'border-primary' : 'border-transparent',
            )}
            aria-label={`View image ${index + 1} of ${name}`}
            aria-current={index === activeIndex}
          >
            <img src={getMediaUrl(item, 160)} alt="" className="size-full object-cover" />
          </button>
        ))}
      </div>
      <div className="order-1 overflow-hidden rounded-2xl bg-secondary md:order-2">
        <img
          src={getMediaUrl(active, 1200)}
          alt={active.alt}
          className="aspect-square w-full object-cover md:aspect-[4/5]"
        />
      </div>
    </div>
  )
}
