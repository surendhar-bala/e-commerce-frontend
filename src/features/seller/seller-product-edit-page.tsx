import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ErrorState } from '@/components/common/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductForm } from '@/features/admin/product-form'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { productService } from '@/services'
import { useAuthStore } from '@/store/auth-store'
import type { Product } from '@/types/product'
import { toast } from 'sonner'

type SellerProductEditPageProps = {
  productId: string
}

export function SellerProductEditPage({ productId }: SellerProductEditPageProps) {
  const navigate = useNavigate()
  const sellerId = useAuthStore((state) => state.user?.id)
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
    return <Skeleton className="h-96 w-full max-w-3xl" />
  }

  if (status === 'empty' || !product) {
    return <ErrorState title="Product not found" description="This listing is no longer in your catalog." />
  }

  return (
    <div className="max-w-3xl">
      <p className="text-caption">Listing</p>
      <h1 className="text-page mt-1">Edit product</h1>
      <ProductForm
        key={product.id}
        product={product}
        submittingLabel="Save listing"
        onSubmit={async (values) => {
          await productService.update(product.id, { ...values, sellerId: sellerId ?? product.sellerId })
          toast.success('Listing updated.')
          void navigate({ to: '/seller/products' })
        }}
      />
    </div>
  )
}
