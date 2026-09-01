import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ErrorState } from '@/components/common/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductForm } from '@/features/admin/product-form'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { productService } from '@/services'
import type { Product } from '@/types/product'
import { toast } from 'sonner'

type AdminProductEditPageProps = {
  productId: string
}

export function AdminProductEditPage({ productId }: AdminProductEditPageProps) {
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'empty'>('loading')
  useDocumentTitle(product ? `Edit ${product.name}` : 'Edit product')

  useEffect(() => {
    let active = true
    productService.getById(productId).then((result) => {
      if (!active) return
      if (!result) {
        setStatus('empty')
        return
      }
      setProduct(result)
      setStatus('ready')
    })
    return () => {
      active = false
    }
  }, [productId])

  if (status === 'loading') {
    return <Skeleton className="h-96 w-full max-w-2xl" />
  }

  if (status === 'empty' || !product) {
    return <ErrorState title="Product not found" description="This product is not in the catalog." />
  }

  return (
    <div>
      <p className="text-caption">Catalog</p>
      <h1 className="text-page mt-1">Edit product</h1>
      <ProductForm
        key={product.id}
        product={product}
        submittingLabel="Save changes"
        onSubmit={async (values) => {
          await productService.update(product.id, values)
          toast.success('Product updated in the mock catalog.')
          void navigate({ to: '/admin/products' })
        }}
      />
    </div>
  )
}
