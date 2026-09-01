import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ErrorState } from '@/components/common/error-state'
import { Badge } from '@/components/ui/badge'
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
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-6 h-40 w-full" />
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
      <Link to="/orders" className="text-sm hover:text-primary">
        ← All orders
      </Link>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <h1 className="text-page">{order.id.toUpperCase()}</h1>
        <Badge variant="secondary">{order.status}</Badge>
      </div>
      <p className="mt-2 text-small">Placed {formatDate(order.placedAt)}</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-card p-6 shadow-soft lg:col-span-2">
          <h2 className="font-display text-xl">Items</h2>
          <ul className="mt-4 space-y-4">
            {order.items.map((item) => (
              <li key={item.productId} className="flex gap-4">
                <img
                  src={`${item.imageUrl}?auto=format&fit=crop&w=160&q=80`}
                  alt=""
                  className="size-16 rounded-md object-cover"
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
          <div className="rounded-2xl bg-card p-6 shadow-soft">
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
          <div className="rounded-2xl bg-card p-6 shadow-soft">
            <h2 className="font-display text-xl">Total</h2>
            <p className="mt-3 text-price text-2xl">{formatCurrency(order.total)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
