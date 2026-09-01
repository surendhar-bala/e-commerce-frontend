import { createFileRoute } from '@tanstack/react-router'
import { SellerProductEditPage } from '@/features/seller/seller-product-edit-page'

export const Route = createFileRoute('/seller/products/$productId/edit')({
  component: SellerProductEditRoute,
})

function SellerProductEditRoute() {
  const { productId } = Route.useParams()
  return <SellerProductEditPage productId={productId} />
}
