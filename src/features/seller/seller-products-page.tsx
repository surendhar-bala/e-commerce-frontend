import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { Package, Pencil, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { Pagination } from '@/components/common/pagination'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { PAGE_SIZE } from '@/lib/constants'
import { formatCurrency } from '@/lib/format'
import { getMediaUrl } from '@/lib/media'
import { productService } from '@/services'
import { useAuthStore } from '@/store/auth-store'
import type { Product } from '@/types/product'
import { toast } from 'sonner'

export function SellerProductsPage() {
  useDocumentTitle('My products')
  const navigate = useNavigate({ from: '/seller/products/' })
  const search = useSearch({ from: '/seller/products/' })
  const user = useAuthStore((state) => state.user)
  const [items, setItems] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const currentPage = search.page ?? 1

  const load = useCallback(() => {
    setStatus('loading')
    productService
      .list({
        page: currentPage,
        pageSize: PAGE_SIZE,
        sort: 'newest',
        includeInactive: true,
        sellerId: user?.id,
        sellerOnly: !user?.id,
      })
      .then((result) => {
        setItems(result.items)
        setTotal(result.total)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [currentPage, user?.id])

  useEffect(() => {
    load()
  }, [load])

  function goToPage(page: number) {
    void navigate({ search: { ...search, page } })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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

      {status === 'ready' && total === 0 ? (
        <EmptyState
          className="mt-10 rounded-2xl bg-card shadow-soft"
          icon={<Package className="size-8" />}
          title="No listings yet"
          description="Add your first product with photos, price, and stock. It will show in the shop as soon as it is live."
          action={
            <Button asChild>
              <Link to="/seller/products/create">Post a product</Link>
            </Button>
          }
        />
      ) : null}

      {status === 'ready' && total > 0 ? (
        <>
          <p className="mt-6 text-sm text-muted-foreground">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {(currentPage - 1) * PAGE_SIZE + items.length} of {total}{' '}
            {total === 1 ? 'product' : 'products'}
          </p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border/60 bg-card p-2 shadow-soft">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((product) => {
                  const image = product.media.find((item) => item.type !== 'video') ?? product.media[0]

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {image ? (
                            <img
                              src={getMediaUrl(image, 80)}
                              alt=""
                              className="size-12 rounded-lg object-cover"
                            />
                          ) : null}
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(product.price)}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{product.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${product.name}`}
                            asChild
                          >
                            <Link
                              to="/seller/products/$productId/edit"
                              params={{ productId: product.id }}
                            >
                              <Pencil className="size-4" />
                            </Link>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete ${product.name}`}
                            className="text-muted-foreground hover:text-destructive"
                            onClick={async () => {
                              try {
                                await productService.remove(product.id)
                                toast.success('Product removed.')
                                if (items.length === 1 && currentPage > 1) {
                                  goToPage(currentPage - 1)
                                  return
                                }
                                load()
                              } catch {
                                toast.error('Could not remove product.')
                              }
                            }}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          {total > PAGE_SIZE ? (
            <Pagination
              className="mt-8"
              page={currentPage}
              pageSize={PAGE_SIZE}
              total={total}
              onPageChange={goToPage}
            />
          ) : null}
        </>
      ) : null}
    </div>
  )
}
