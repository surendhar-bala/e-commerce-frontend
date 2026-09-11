import { useEffect, useState } from 'react'
import { BackLink } from '@/components/common/back-link'
import { ErrorState } from '@/components/common/error-state'
import { OrderStatusBadge } from '@/components/common/order-status-badge'
import { OrderStatusTracker } from '@/components/common/order-status-tracker'
import { Skeleton } from '@/components/ui/skeleton'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { formatCurrency, formatDate } from '@/lib/format'
import { orderService } from '@/services'
import type { Order } from '@/types/order'

type OrderDetailPageProps = {
  orderId: string
}

export function OrderDetailPage({ orderId }: OrderDetailPageProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'empty'>('loading')
  useDocumentTitle(order ? `Order ${order.id}` : 'Order')

  useEffect(() => {
    let active = true
    orderService
      .getById(orderId)
      .then((result) => {
        if (!active) return
        if (!result) {
          setStatus('empty')
          return
        }
        setOrder(result)
        setStatus('ready')
      })
      .catch(() => {
        if (active) setStatus('error')
      })
    return () => {
      active = false
    }
  }, [orderId])

  if (status === 'loading') {
    return (
      <div className="container-page py-10">
        <BackLink to="/orders" label="Back to orders" />
        <Skeleton className="mt-6 h-10 w-48" />
        <Skeleton className="mt-6 h-24 w-full rounded-2xl" />
        <Skeleton className="mt-6 h-40 w-full rounded-2xl" />
      </div>
    )
  }

  if (status === 'error') {
    return <ErrorState />
  }

  if (status === 'empty' || !order) {
    return <ErrorState title="Order not found" description="We could not find this order." />
  }

  return (
    <div className="container-page py-8 md:py-12">
      <BackLink to="/orders" label="Back to orders" />
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h1 className="text-page">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="mt-2 text-small">Placed {formatDate(order.placedAt)}</p>

      <div className="surface-card mt-8 p-5 sm:p-6">
        <h2 className="font-display text-xl">Delivery status</h2>
        <OrderStatusTracker status={order.status} className="mt-5" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="surface-card p-6 lg:col-span-2">
          <h2 className="font-display text-xl">Items</h2>
          <ul className="mt-4 space-y-4">
            {order.items.map((item) => (
              <li key={item.productId} className="flex gap-4 rounded-xl border border-border/60 p-3">
                <img
                  src={`${item.imageUrl}?auto=format&fit=crop&w=160&q=80`}
                  alt=""
                  className="size-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty {item.quantity}</p>
                </div>
                <p className="text-price">{formatCurrency(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <div className="surface-card p-6">
            <h2 className="font-display text-xl">Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {order.customerEmail ? (
                <>
                  {order.customerEmail}
                  <br />
                </>
              ) : null}
              {order.customerPhone ? order.customerPhone : null}
              {!order.customerEmail && !order.customerPhone ? '—' : null}
            </p>
          </div>
          <div className="surface-card p-6">
            <h2 className="font-display text-xl">Shipping</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.line1}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </p>
          </div>
          <div className="surface-card p-6">
            <h2 className="font-display text-xl">Total</h2>
            <p className="mt-3 text-price text-2xl">{formatCurrency(order.total)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
