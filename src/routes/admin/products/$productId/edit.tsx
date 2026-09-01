import { createFileRoute } from '@tanstack/react-router'
import { AdminProductEditPage } from '@/features/admin/admin-product-edit-page'

export const Route = createFileRoute('/admin/products/$productId/edit')({
  component: AdminProductEditRoute,
})

function AdminProductEditRoute() {
  const { productId } = Route.useParams()
  return <AdminProductEditPage productId={productId} />
}
