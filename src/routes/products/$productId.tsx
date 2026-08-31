import { createFileRoute } from '@tanstack/react-router'
import { ProductDetailPage } from '@/features/products/product-detail-page'

export const Route = createFileRoute('/products/$productId')({
  component: ProductDetailRoute,
})

function ProductDetailRoute() {
  const { productId } = Route.useParams()
  return <ProductDetailPage productId={productId} />
}
