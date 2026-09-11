import { createFileRoute } from '@tanstack/react-router'
import { ProductDetailPage } from '@/features/products/product-detail-page'
import { redirectSellerFromStorefront } from '@/lib/storefront-guards'

export const Route = createFileRoute('/products/$productId')({
  beforeLoad: () => {
    redirectSellerFromStorefront()
  },
  component: ProductDetailRoute,
})

function ProductDetailRoute() {
  const { productId } = Route.useParams()
  return <ProductDetailPage productId={productId} />
}
