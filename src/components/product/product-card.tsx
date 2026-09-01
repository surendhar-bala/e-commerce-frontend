import { Link } from '@tanstack/react-router'
import { Heart, ShoppingBag } from 'lucide-react'
import { PriceDisplay } from '@/components/common/price-display'
import { StarRating } from '@/components/common/star-rating'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDiscount } from '@/lib/format'
import { getMediaUrl } from '@/lib/media'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import type { Product, ProductCategory } from '@/types/product'
import { toast } from 'sonner'

type ProductCardProps = {
  product: Product
  category?: ProductCategory
}

export function ProductCard({ product, category }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const image = product.media[0]
  const discount = product.compareAtPrice ? formatDiscount(product.price, product.compareAtPrice) : 0

  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-xl bg-secondary">
        <Link to="/products/$productId" params={{ productId: product.id }} className="block">
          {image ? (
            <img
              src={getMediaUrl(image, 720)}
              alt={image.alt}
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="aspect-square bg-muted" />
          )}
        </Link>
        {discount > 0 ? (
          <Badge className="absolute top-3 left-3">{discount}% off</Badge>
        ) : null}
        <div
          className={cn(
            'absolute inset-x-3 bottom-3 flex gap-2 transition-all duration-200',
            'opacity-100 translate-y-0 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0',
          )}
        >
          <Button
            type="button"
            size="sm"
            className="flex-1 shadow-soft"
            onClick={() => {
              addItem(product)
              toast.success(`${product.name} added to cart`)
            }}
          >
            <ShoppingBag />
            Add
          </Button>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            aria-label="Save to wishlist"
            onClick={() => toast('Wishlist will be available with accounts.')}
          >
            <Heart />
          </Button>
        </div>
      </div>
      <div className="pt-3">
        {category ? <p className="text-caption">{category.name}</p> : null}
        <h3 className="text-product-title mt-1">
          <Link to="/products/$productId" params={{ productId: product.id }} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <PriceDisplay className="mt-1.5" price={product.price} compareAtPrice={product.compareAtPrice} />
        <StarRating className="mt-2" rating={product.rating} count={product.reviewCount} />
      </div>
    </article>
  )
}
