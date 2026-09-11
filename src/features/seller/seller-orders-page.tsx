import { useNavigate, useSearch } from '@tanstack/react-router'
import { Eye, FileDown, ShoppingBag } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { Pagination } from '@/components/common/pagination'
import { SellerOrderDetailDialog } from '@/features/seller/seller-order-detail-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { PAGE_SIZE } from '@/lib/constants'
import { formatCurrency, formatDate } from '@/lib/format'
import { downloadOrderInvoicePdf, getSellerOrderTotal } from '@/lib/order-invoice'
import { orderService } from '@/services'
import type { Order } from '@/types/order'

export function SellerOrdersPage() {
  useDocumentTitle('Seller orders')
  const navigate = useNavigate({ from: '/seller/orders/' })
  const search = useSearch({ from: '/seller/orders/' })
  const [orders, setOrders] = useState<Order[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const currentPage = search.page ?? 1

  useEffect(() => {
    let active = true
    orderService
      .list()
      .then((result) => {
        if (!active) return
        setOrders(result)
        setStatus('ready')
      })
      .catch(() => {
        if (active) setStatus('error')
      })
    return () => {
      active = false
    }
  }, [])

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return orders.slice(start, start + PAGE_SIZE)
  }, [currentPage, orders])

  function goToPage(page: number) {
    void navigate({ search: { ...search, page } })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openDetails(order: Order) {
    setSelectedOrder(order)
    setDetailOpen(true)
  }

  return (
    <div>
      <div>
        <p className="text-caption">Fulfillment</p>
        <h1 className="text-page mt-1">Buyer orders</h1>
        <p className="mt-2 text-small">Orders that include your products appear here.</p>
      </div>

      {status === 'loading' ? <Skeleton className="mt-8 h-64 w-full" /> : null}
      {status === 'error' ? (
        <div className="mt-8">
          <ErrorState />
        </div>
      ) : null}
      {status === 'ready' && orders.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={<ShoppingBag className="size-10" />}
          title="No orders yet"
          description="When a buyer purchases your products, the order will show up here."
        />
      ) : null}

      {status === 'ready' && orders.length > 0 ? (
        <>
          <p className="mt-6 text-sm text-muted-foreground">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {(currentPage - 1) * PAGE_SIZE + paginatedOrders.length} of {orders.length}{' '}
            {orders.length === 1 ? 'order' : 'orders'}
          </p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border/60 bg-card p-2 shadow-soft">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => {
                  const sellerTotal = getSellerOrderTotal(order)
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id.slice(0, 8).toUpperCase()}</TableCell>
                      <TableCell>{formatDate(order.placedAt)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{order.shippingAddress.fullName}</p>
                          {order.customerPhone ? (
                            <p className="text-muted-foreground">{order.customerPhone}</p>
                          ) : null}
                          <p className="text-muted-foreground">
                            {order.shippingAddress.city}, {order.shippingAddress.state}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ul className="text-sm">
                          {order.items.map((item) => (
                            <li key={`${order.id}-${item.productId}`}>
                              {item.name} × {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{order.status}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(sellerTotal)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`View order ${order.id.slice(0, 8)}`}
                            onClick={() => openDetails(order)}
                          >
                            <Eye className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Download PDF for order ${order.id.slice(0, 8)}`}
                            onClick={async () => {
                              try {
                                await downloadOrderInvoicePdf(order)
                                toast.success('Order PDF downloaded.')
                              } catch {
                                toast.error('Could not download PDF.')
                              }
                            }}
                          >
                            <FileDown className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          {orders.length > PAGE_SIZE ? (
            <Pagination
              className="mt-8"
              page={currentPage}
              pageSize={PAGE_SIZE}
              total={orders.length}
              onPageChange={goToPage}
            />
          ) : null}
        </>
      ) : null}

      <SellerOrderDetailDialog order={selectedOrder} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  )
}
