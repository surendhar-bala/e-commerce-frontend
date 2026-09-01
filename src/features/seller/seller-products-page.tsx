import { Link } from '@tanstack/react-router'
import { Package } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { categories } from '@/data/categories'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { formatCurrency } from '@/lib/format'
import { getMediaUrl } from '@/lib/media'
import { productService } from '@/services'
import { useAuthStore } from '@/store/auth-store'
import type { Product } from '@/types/product'
import { toast } from 'sonner'

export function SellerProductsPage() {
  useDocumentTitle('My products')
  const user = useAuthStore((state) => state.user)
  const [items, setItems] = useState<Product[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  const load = useCallback(() => {
    setStatus('loading')
    productService
      .list({
        pageSize: 50,
        sort: 'newest',
        includeInactive: true,
        sellerId: user?.id,
        sellerOnly: !user?.id,
      })
      .then((result) => {
        setItems(result.items)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [user?.id])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-caption">Catalog</p>
          <h1 className="text-page mt-1">My products</h1>
        </div>
        <Button asChild>
          <Link to="/seller/products/create">Add product</Link>
        </Button>
      </div>
      {status === 'loading' ? <Skeleton className="mt-8 h-64 w-full" /> : null}
      {status === 'error' ? <ErrorState onRetry={load} /> : null}
      {status === 'ready' && items.length === 0 ? (
        <EmptyState
          className="mt-10 rounded-2xl bg-card shadow-soft"
          icon={<Package className="size-8" />}
          title="No listings yet"
          description="Add your first product with photos, price, and category. It will show in the shop as soon as it is live."
          action={
            <Button asChild>
              <Link to="/seller/products/create">Post a product</Link>
            </Button>
          }
        />
      ) : null}
      {status === 'ready' && items.length > 0 ? (
        <div className="mt-8 overflow-x-auto rounded-2xl bg-card p-2 shadow-soft">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((product) => {
                const image = product.media[0]
                const category = categories.find((item) => item.id === product.categoryId)
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {image ? (
                          <img
                            src={getMediaUrl(image, 80)}
                            alt=""
                            className="size-12 rounded-md object-cover"
                          />
                        ) : null}
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{category?.name ?? '—'}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Link
                          to="/seller/products/$productId/edit"
                          params={{ productId: product.id }}
                          className="text-sm hover:text-primary"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="text-sm text-muted-foreground hover:text-destructive"
                          onClick={async () => {
                            await productService.remove(product.id)
                            toast.success('Product removed.')
                            load()
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  )
}
