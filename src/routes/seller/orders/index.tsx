import { createFileRoute } from '@tanstack/react-router'
import { SellerOrdersPage } from '@/features/seller/seller-orders-page'

export const Route = createFileRoute('/seller/orders/')({
  component: SellerOrdersPage,
})
