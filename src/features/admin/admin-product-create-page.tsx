import { useNavigate } from '@tanstack/react-router'
import { ProductForm } from '@/features/admin/product-form'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { productService } from '@/services'
import { toast } from 'sonner'

export function AdminProductCreatePage() {
  useDocumentTitle('Create product')
  const navigate = useNavigate()

  return (
    <div>
      <p className="text-caption">Catalog</p>
      <h1 className="text-page mt-1">Create product</h1>
      <ProductForm
        submittingLabel="Create product"
        onSubmit={async (values) => {
          const created = await productService.create(values)
          toast.success('Product created in the mock catalog.')
          void navigate({ to: '/admin/products/$productId/edit', params: { productId: created.id } })
        }}
      />
    </div>
  )
}
