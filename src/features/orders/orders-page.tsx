import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { MapPin, Package } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { BackLink } from '@/components/common/back-link'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { OrderStatusBadge } from '@/components/common/order-status-badge'
import { Pagination } from '@/components/common/pagination'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { PAGE_SIZE } from '@/lib/constants'
import { formatCurrency, formatDate } from '@/lib/format'
import { orderService } from '@/services'
import { env } from '@/lib/env'
import { useAuthStore } from '@/store/auth-store'
import type { Order } from '@/types/order'

export function OrdersPage() {
  useDocumentTitle('Orders')
  const navigate = useNavigate({ from: '/orders/' })
  const search = useSearch({ from: '/orders/' })
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [orders, setOrders] = useState<Order[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const currentPage = search.page ?? 1

  useEffect(() => {
    if (!isAuthenticated) {
      setOrders([])
      setStatus('ready')
      return
    }

    let active = true
    setStatus('loading')
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
  }, [isAuthenticated])

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return orders.slice(start, start + PAGE_SIZE)
  }, [currentPage, orders])

  function goToPage(page: number) {
    void navigate({ search: { ...search, page } })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isAuthenticated && env.enforceRouteGuards) {
    return (
      <div className="container-page py-10">
        <EmptyState
          icon={<Package className="size-10" />}
          title="Sign in to view orders"
          description="Your order history will appear here after you sign in."
          action={
            <Button asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="container-page py-8 md:py-12">
      <BackLink to="/products" label="Back to shop" />

      {status === 'loading' ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      ) : null}
      {status === 'error' ? (
        <div className="mt-8">
          <ErrorState />
        </div>
      ) : null}
      {status === 'ready' && orders.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={<Package className="size-10" />}
          title="No orders yet"
          description="When you place an order, it will appear here with live status updates."
          action={
            <Button asChild>
              <Link to="/products">Start shopping</Link>
            </Button>
          }
        />
      ) : null}
      {status === 'ready' && orders.length > 0 ? (
        <>
          <p className="mt-6 text-sm text-muted-foreground">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {(currentPage - 1) * PAGE_SIZE + paginatedOrders.length} of {orders.length}{' '}
            {orders.length === 1 ? 'order' : 'orders'}
          </p>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedOrders.map((order) => (
              <li key={order.id}>
                <article className="surface-card flex h-full flex-col gap-4 p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="mt-1 text-sm text-muted-foreground">Placed {formatDate(order.placedAt)}</p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="space-y-3 rounded-xl border-2 border-primary/20 bg-primary/5 p-3 dark:border-primary/30 dark:bg-primary/10">
                    {order.items.map((item) => (
                      <div
                        key={`${order.id}-${item.productId}`}
                        className="flex items-center gap-3 rounded-lg bg-background/80 p-2 dark:bg-background/40"
                      >
                        <img
                          src={`${item.imageUrl}?auto=format&fit=crop&w=160&q=80`}
                          alt={item.name}
                          className="size-16 shrink-0 rounded-xl border-2 border-primary/20 object-cover ring-2 ring-primary/10"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium leading-snug text-foreground">{item.name}</p>
                          <p className="mt-1 text-sm text-muted-foreground">Qty {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-primary/25 bg-primary/10 px-3 py-2.5 dark:border-primary/35 dark:bg-primary/15">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                      <div className="min-w-0 text-sm">
                        <p className="font-medium text-foreground">Ship to</p>
                        <p className="mt-0.5 font-medium text-foreground/90">{order.shippingAddress.fullName}</p>
                        <p className="text-foreground/80">
                          {order.shippingAddress.line1}, {order.shippingAddress.city},{' '}
                          {order.shippingAddress.state} {order.shippingAddress.postalCode}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-4 border-t border-border/60 pt-4">
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </p>
                    <span className="text-price text-lg">{formatCurrency(order.total)}</span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
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
    </div>
  )
}
