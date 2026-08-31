import { Link } from '@tanstack/react-router'
import { Package } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { Badge } from '@/components/ui/badge'
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

  if (!isAuthenticated && env.enforceRouteGuards) {
    return (
      <div className="container-page py-10">
        <EmptyState
          icon={<Package className="size-10" />}
          title="Sign in to view orders"
          description="Order history will appear here once authentication is connected to the backend."
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
      <h1 className="text-page">Orders</h1>
      {status === 'loading' ? (
        <div className="mt-8 space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : null}
      {status === 'error' ? <ErrorState /> : null}
      {status === 'ready' && orders.length === 0 ? (
        <EmptyState title="No orders yet" description="When you place an order, it will live here." />
      ) : null}
      {status === 'ready' && orders.length > 0 ? (
        <ul className="mt-8 space-y-4">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                to="/orders/$orderId"
                params={{ orderId: order.id }}
                className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-soft transition-shadow hover:shadow-lift sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{order.id.toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(order.placedAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{order.status}</Badge>
                  <span className="text-price">{formatCurrency(order.total)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
