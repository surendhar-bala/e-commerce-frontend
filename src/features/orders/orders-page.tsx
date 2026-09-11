import { Link } from '@tanstack/react-router'
import { ChevronRight, Package } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BackLink } from '@/components/common/back-link'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { OrderStatusBadge } from '@/components/common/order-status-badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { formatCurrency, formatDate } from '@/lib/format'
import { orderService } from '@/services'
import { env } from '@/lib/env'
import { useAuthStore } from '@/store/auth-store'
import type { Order } from '@/types/order'

export function OrdersPage() {
  useDocumentTitle('Orders')
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [orders, setOrders] = useState<Order[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

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
      <div className="mt-6 max-w-2xl">
        <p className="text-caption">Your purchases</p>
        <h1 className="text-page mt-2">Order history</h1>
        <p className="mt-2 text-small">Track status, view details, and download invoices for past orders.</p>
      </div>

      {status === 'loading' ? (
        <div className="mt-8 space-y-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
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
        <ul className="mt-8 space-y-4">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                to="/orders/$orderId"
                params={{ orderId: order.id }}
                className="group surface-card flex flex-col gap-4 p-5 transition-shadow hover:shadow-lift sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Placed {formatDate(order.placedAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    <span className="text-price text-lg">{formatCurrency(order.total)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item) => (
                        <img
                          key={item.productId}
                          src={`${item.imageUrl}?auto=format&fit=crop&w=80&q=70`}
                          alt=""
                          className="size-10 rounded-lg border-2 border-card object-cover"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                    View details
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
