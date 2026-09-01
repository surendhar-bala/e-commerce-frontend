import { useNavigate } from '@tanstack/react-router'
import { ProductForm } from '@/features/admin/product-form'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { productService } from '@/services'
import { useAuthStore } from '@/store/auth-store'
import { toast } from 'sonner'

export function SellerProductCreatePage() {
  useDocumentTitle('Add product')
  const navigate = useNavigate()
  const sellerId = useAuthStore((state) => state.user?.id)

  return (
    <div className="max-w-3xl">
      <p className="text-caption">New listing</p>
      <h1 className="text-page mt-1">Add a product</h1>
      <p className="mt-2 text-small">List paints, toys, or daily essentials — photos, price in ₹, category, and stock.</p>
      <ProductForm
        submittingLabel="Post product"
        onSubmit={async (values) => {
          const created = await productService.create({ ...values, sellerId })
          toast.success('Your product is listed.')
          void navigate({ to: '/seller/products/$productId/edit', params: { productId: created.id } })
        }}
      />
    </div>
  )
}
