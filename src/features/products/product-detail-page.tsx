import { useNavigate } from '@tanstack/react-router'
import { ShoppingBag, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BackLink } from '@/components/common/back-link'
import { ErrorState } from '@/components/common/error-state'
import { PriceDisplay } from '@/components/common/price-display'
import { QuantityStepper } from '@/components/common/quantity-stepper'
import { ProductGallery } from '@/components/product/product-gallery'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getCategoryName } from '@/data/categories'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { productService } from '@/services'
import { useCartStore } from '@/store/cart-store'
import type { Product } from '@/types/product'
import { toast } from 'sonner'

type ProductDetailPageProps = {
  productId: string
}

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const navigate = useNavigate()
  const addItem = useCartStore((state) => state.addItem)
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loadedId, setLoadedId] = useState<string | null>(null)
  const [failedId, setFailedId] = useState<string | null>(null)
  const [missingId, setMissingId] = useState<string | null>(null)
  const status =
    failedId === productId
      ? 'error'
      : missingId === productId
        ? 'empty'
        : loadedId === productId && product
          ? 'ready'
          : 'loading'

  useDocumentTitle(product?.name)

  useEffect(() => {
    let active = true
    productService
      .getById(productId)
      .then((nextProduct) => {
        if (!active) return
        if (!nextProduct) {
          setMissingId(productId)
          setProduct(null)
          return
        }
        setProduct(nextProduct)
        const stock = Math.max(0, Number(nextProduct.stock) || 0)
        setQuantity(stock > 0 ? 1 : 0)
        setLoadedId(productId)
        setFailedId(null)
        setMissingId(null)
      })
      .catch(() => {
        if (active) setFailedId(productId)
      })
    return () => {
      active = false
    }
  }, [productId])

  if (status === 'loading') {
    return (
      <div className="container-page py-8 md:py-12">
        <Skeleton className="h-5 w-28" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
          <div className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="flex gap-2">
              <Skeleton className="size-20 rounded-xl" />
              <Skeleton className="size-20 rounded-xl" />
              <Skeleton className="size-20 rounded-xl" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return <ErrorState onRetry={() => void navigate({ to: '/products/$productId', params: { productId } })} />
  }

  if (status === 'empty' || !product) {
    return (
      <ErrorState
        title="Product unavailable"
        description="This product is no longer available."
      />
    )
  }

  const stock = Math.max(0, Number(product.stock) || 0)
  const inStock = stock > 0

  function handleAddToCart(current: Product) {
    if (!inStock) {
      toast.error('This product is out of stock.')
      return
    }
    const added = addItem(current, quantity)
    if (added) {
      toast.success(`${current.name} added to cart`)
    } else {
      toast.error('Could not add this product to the cart.')
    }
  }

  return (
    <div className="container-page py-8 md:py-12">
      <BackLink to="/products" label="Back to shop" />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-14">
        <div className="lg:sticky lg:top-24">
          <ProductGallery media={product.media} name={product.name} />
        </div>

        <div className="flex flex-col">
          <p className="text-caption">{getCategoryName(product.categoryId)}</p>
          <h1 className="text-page mt-2">{product.name}</h1>

          <PriceDisplay
            className="mt-5"
            size="lg"
            price={product.price}
            compareAtPrice={product.compareAtPrice}
          />

          <div className="surface-card mt-8 p-6">
            <h2 className="text-sm font-medium text-muted-foreground">About this product</h2>
            <p className="mt-3 text-body leading-relaxed">{product.description}</p>
          </div>

          <div className="surface-card mt-6 p-6">
            {inStock ? (
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium">Quantity</span>
                <QuantityStepper
                  value={quantity}
                  min={1}
                  max={stock}
                  onChange={setQuantity}
                />
              </div>
            ) : (
              <p className="text-sm font-medium text-destructive">Out of stock</p>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button
                size="lg"
                className="h-12 w-full whitespace-nowrap px-3 sm:px-7"
                disabled={!inStock}
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingBag className="size-4 shrink-0" />
                Add to cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full whitespace-nowrap px-3 sm:px-7"
                disabled={!inStock}
                onClick={() => {
                  if (!inStock) {
                    toast.error('This product is out of stock.')
                    return
                  }
                  const added = addItem(product, quantity)
                  if (added) {
                    void navigate({ to: '/checkout' })
                  } else {
                    toast.error('Could not add this product to the cart.')
                  }
                }}
              >
                <Zap className="size-4 shrink-0" />
                Buy now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

