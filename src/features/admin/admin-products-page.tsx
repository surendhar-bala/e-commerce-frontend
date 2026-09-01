import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ErrorState } from '@/components/common/error-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { formatCurrency } from '@/lib/format'
import { getMediaUrl } from '@/lib/media'
import { productService } from '@/services'
import { categories } from '@/data/categories'
import type { Product } from '@/types/product'

export function AdminProductsPage() {
  useDocumentTitle('Admin products')
  const [items, setItems] = useState<Product[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let active = true
    productService
      .list({ pageSize: 50, sort: 'newest' })
      .then((result) => {
        if (!active) return
        setItems(result.items)
        setStatus('ready')
      })
      .catch(() => {
        if (active) setStatus('error')
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-caption">Catalog</p>
          <h1 className="text-page mt-1">Products</h1>
        </div>
        <Button asChild>
          <Link to="/admin/products/create">Create product</Link>
        </Button>
      </div>
      {status === 'loading' ? <Skeleton className="mt-8 h-64 w-full" /> : null}
      {status === 'error' ? <ErrorState /> : null}
      {status === 'ready' ? (
        <div className="mt-8 rounded-2xl bg-card p-2 shadow-soft">
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
                      <Link
                        to="/admin/products/$productId/edit"
                        params={{ productId: product.id }}
                        className="text-sm hover:text-primary"
                      >
                        Edit
                      </Link>
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
