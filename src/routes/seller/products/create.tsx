import { createFileRoute } from '@tanstack/react-router'
import { SellerProductCreatePage } from '@/features/seller/seller-product-create-page'

export const Route = createFileRoute('/seller/products/create')({
  component: SellerProductCreatePage,
})
