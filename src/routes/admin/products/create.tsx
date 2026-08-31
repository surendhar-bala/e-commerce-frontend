import { createFileRoute } from '@tanstack/react-router'
import { AdminProductCreatePage } from '@/features/admin/admin-product-create-page'

export const Route = createFileRoute('/admin/products/create')({
  component: AdminProductCreatePage,
})
