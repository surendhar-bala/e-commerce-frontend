import { createFileRoute } from '@tanstack/react-router'
import { SellerHomePage } from '@/features/seller/seller-home-page'

export const Route = createFileRoute('/seller/')({
  component: SellerHomePage,
})
