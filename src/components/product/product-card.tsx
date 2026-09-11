import { Link } from '@tanstack/react-router'
import { ShoppingBag } from 'lucide-react'
import { PriceDisplay } from '@/components/common/price-display'
import { Button } from '@/components/ui/button'
import { getMediaUrl } from '@/lib/media'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import type { Product } from '@/types/product'
import { toast } from 'sonner'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const image = product.media.find((item) => item.type !== 'video') ?? product.media[0]
  const inStock = Math.max(0, Number(product.stock) || 0) > 0

  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden rounded-2xl border bg-secondary/50">
        <Link to="/products/$productId" params={{ productId: product.id }} className="block">
          {image ? (
            <img
              src={getMediaUrl(image, 720)}
              alt={image.alt}
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="aspect-square bg-muted" />
          )}
        </Link>
        <div
          className={cn(
            'absolute inset-x-3 bottom-3 transition-all duration-200',
            'opacity-100 translate-y-0 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0',
          )}
        >
          <Button
            type="button"
            size="sm"
            className="w-full shadow-soft"
            disabled={!inStock}
            onClick={() => {
              const added = addItem(product)
              if (added) {
                toast.success(`${product.name} added to cart`)
              } else {
                toast.error('This product is out of stock.')
              }
            }}
          >
            <ShoppingBag className="size-4" />
            {inStock ? 'Add to cart' : 'Out of stock'}
          </Button>
        </div>
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <h3 className="text-base font-medium leading-snug">
          <Link
            to="/products/$productId"
            params={{ productId: product.id }}
            className="hover:text-primary transition-colors"
          >
            {product.name}
          </Link>
        </h3>
        <PriceDisplay className="mt-2" price={product.price} compareAtPrice={product.compareAtPrice} />
      </div>
    </article>
  )
}
