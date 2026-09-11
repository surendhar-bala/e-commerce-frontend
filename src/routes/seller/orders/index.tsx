import { createFileRoute } from '@tanstack/react-router'
import { SellerOrdersPage } from '@/features/seller/seller-orders-page'
import { sellerListSearchSchema } from '@/features/seller/search-schema'

export const Route = createFileRoute('/seller/orders/')({
  validateSearch: sellerListSearchSchema,
  component: SellerOrdersPage,
})
