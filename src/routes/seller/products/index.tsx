import { createFileRoute } from '@tanstack/react-router'
import { SellerProductsPage } from '@/features/seller/seller-products-page'
import { sellerListSearchSchema } from '@/features/seller/search-schema'

export const Route = createFileRoute('/seller/products/')({
  validateSearch: sellerListSearchSchema,
  component: SellerProductsPage,
})
