import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/product/product-card'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/product'

const CAROUSEL_THRESHOLD = 4
const AUTO_INTERVAL_MS = 5000

function useVisibleCount() {
  const [count, setCount] = useState(4)

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setCount(1)
      else if (window.innerWidth < 768) setCount(2)
      else if (window.innerWidth < 1280) setCount(3)
      else setCount(4)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return count
}

type ProductCarouselProps = {
  products: Product[]
}

function ProductCarousel({ products }: ProductCarouselProps) {
  const visibleCount = useVisibleCount()
  const maxIndex = Math.max(0, products.length - visibleCount)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [products.length, visibleCount])

  useEffect(() => {
    if (maxIndex === 0) return
    const timer = setInterval(() => {
      setIndex((current) => (current >= maxIndex ? 0 : current + 1))
    }, AUTO_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [maxIndex])

  const slideCount = maxIndex + 1

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${index * (100 / visibleCount)}%)`,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="shrink-0 px-2"
              style={{ width: `${100 / visibleCount}%` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      {slideCount > 1 ? (
        <div className="flex justify-center gap-2">
          {Array.from({ length: slideCount }, (_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              aria-label={`Go to slide ${dotIndex + 1}`}
              className={cn(
                'size-2 rounded-full transition-colors',
                dotIndex === index ? 'bg-primary' : 'bg-border',
              )}
              onClick={() => setIndex(dotIndex)}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

type ProductGridProps = {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length >= CAROUSEL_THRESHOLD) {
    return <ProductCarousel products={products} />
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
