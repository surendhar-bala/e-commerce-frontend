import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ErrorState } from '@/components/common/error-state'
import { PriceDisplay } from '@/components/common/price-display'
import { QuantityStepper } from '@/components/common/quantity-stepper'
import { StarRating } from '@/components/common/star-rating'
import { ProductGallery } from '@/components/product/product-gallery'
import { ProductGrid } from '@/components/product/product-grid'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { productService } from '@/services'
import { useCartStore } from '@/store/cart-store'
import type { Product, ProductCategory } from '@/types/product'
import { toast } from 'sonner'

type ProductDetailPageProps = {
  productId: string
}

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const navigate = useNavigate()
  const addItem = useCartStore((state) => state.addItem)
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
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
    Promise.all([
      productService.getById(productId),
      productService.getRelated(productId),
      productService.listCategories(),
    ])
      .then(([nextProduct, nextRelated, nextCategories]) => {
        if (!active) return
        if (!nextProduct) {
          setMissingId(productId)
          setProduct(null)
          return
        }
        setProduct(nextProduct)
        setRelated(nextRelated)
        setCategories(nextCategories)
        setQuantity(1)
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

  const category = categories.find((item) => item.id === product?.categoryId)

  if (status === 'loading') {
    return (
      <div className="container-page grid gap-10 py-10 md:grid-cols-2">
        <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 w-full" />
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
        description="This piece is no longer in the collection."
      />
    )
  }

  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/products">Products</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <ProductGallery media={product.media} name={product.name} />
        <div>
          {category ? <p className="text-caption">{category.name}</p> : null}
          <h1 className="text-page mt-2">{product.name}</h1>
          <StarRating className="mt-3" rating={product.rating} count={product.reviewCount} />
          <PriceDisplay
            className="mt-5"
            size="lg"
            price={product.price}
            compareAtPrice={product.compareAtPrice}
          />
          <p className="mt-5 max-w-xl text-body text-muted-foreground">{product.description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <QuantityStepper value={quantity} max={product.stock} onChange={setQuantity} />
            <Button
              size="lg"
              onClick={() => {
                addItem(product, quantity)
                toast.success(`${product.name} added to cart`)
              }}
            >
              Add to cart
            </Button>
            <Button
              size="lg"
              variant="subtle"
              onClick={() => {
                addItem(product, quantity)
                void navigate({ to: '/checkout' })
              }}
            >
              Buy now
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            {product.stock > 8 ? 'In stock · ships in 2–4 days' : `${product.stock} remaining`}
          </p>
        </div>
      </div>

      <Tabs defaultValue="details" className="mt-16">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <p className="max-w-3xl text-body text-muted-foreground">{product.description}</p>
        </TabsContent>
        <TabsContent value="specs">
          <dl className="grid max-w-xl gap-3">
            {product.specifications.map((spec) => (
              <div key={spec.label} className="grid grid-cols-2 border-b py-2 text-sm">
                <dt className="text-muted-foreground">{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        </TabsContent>
        <TabsContent value="reviews">
          <p className="text-small">
            Reviews will appear here once the catalog API is connected. Current rating placeholder:{' '}
            {product.rating.toFixed(1)} from {product.reviewCount} customers.
          </p>
        </TabsContent>
      </Tabs>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="text-section mb-8">You may also like</h2>
          <ProductGrid products={related} categories={categories} />
        </section>
      ) : null}
    </div>
  )
}
