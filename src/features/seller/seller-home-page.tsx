import { Link } from '@tanstack/react-router'
import { PackagePlus, Palette, Truck, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'
import { OrderStatusBadge } from '@/components/common/order-status-badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatDate } from '@/lib/format'
import { isPendingDelivery } from '@/lib/order-status'
import { orderService, productService } from '@/services'
import { useAuthStore } from '@/store/auth-store'
import { useDocumentTitle } from '@/hooks/use-document-title'
import type { Order } from '@/types/order'
import type { Product } from '@/types/product'

export function SellerHomePage() {
  useDocumentTitle('Seller hub')
  const user = useAuthStore((state) => state.user)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sellerId = user?.id
    setLoading(true)
    Promise.all([
      productService.list({
        pageSize: 100,
        includeInactive: true,
        sellerId,
        sellerOnly: !sellerId,
        sort: 'newest',
      }),
      orderService.list(),
    ])
      .then(([productResult, orderResult]) => {
        setProducts(productResult.items)
        setOrders(orderResult)
      })
      .finally(() => setLoading(false))
  }, [user?.id])

  const liveCount = products.filter((product) => product.status === 'active').length
  const inventoryValue = products.reduce((sum, product) => sum + product.price * product.stock, 0)
  const pendingDelivery = orders.filter((order) => isPendingDelivery(order.status))

  return (
    <div>
      <p className="text-caption">Seller hub</p>
      <h1 className="text-page mt-2">Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
      <p className="mt-3 max-w-xl text-small">
        List paints, toys, or daily essentials — photos, price, category, and stock in one listing.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="surface-card p-6">
          <Palette className="size-5 text-primary" />
          <p className="mt-4 text-caption">Live listings</p>
          <p className="mt-2 font-display text-4xl">{loading ? '—' : liveCount}</p>
        </div>
        <div className="surface-card p-6">
          <PackagePlus className="size-5 text-primary" />
          <p className="mt-4 text-caption">All products</p>
          <p className="mt-2 font-display text-4xl">{loading ? '—' : products.length}</p>
        </div>
        <div className="surface-card p-6">
          <Truck className="size-5 text-primary" />
          <p className="mt-4 text-caption">Pending delivery</p>
          <p className="mt-2 font-display text-4xl">{loading ? '—' : pendingDelivery.length}</p>
        </div>
        <div className="surface-card p-6">
          <Wallet className="size-5 text-primary" />
          <p className="mt-4 text-caption">Inventory value</p>
          <p className="mt-2 font-display text-3xl">{loading ? '—' : formatCurrency(inventoryValue)}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link to="/seller/products/create">Add a product</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/seller/products">Manage catalog</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/seller/orders">View orders</Link>
        </Button>
      </div>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-caption">Fulfillment</p>
            <h2 className="text-section mt-1">Orders pending delivery</h2>
            <p className="mt-2 text-small">Orders that still need confirmation, packing, or shipping.</p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/seller/orders">View all</Link>
          </Button>
        </div>

        {loading ? (
          <div className="mt-6 space-y-3">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        ) : pendingDelivery.length === 0 ? (
          <div className="surface-card mt-6 p-8 text-center">
            <Truck className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-4 font-medium">No orders awaiting delivery</p>
            <p className="mt-1 text-sm text-muted-foreground">
              New buyer orders will appear here until they are delivered.
            </p>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {pendingDelivery.slice(0, 5).map((order) => (
              <li key={order.id} className="surface-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.shippingAddress.fullName} · {formatDate(order.placedAt)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  <span className="text-price">{formatCurrency(order.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
