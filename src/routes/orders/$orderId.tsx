import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '@/lib/guards'
import { OrderDetailPage } from '@/features/orders/order-detail-page'
import { useAuthStore } from '@/store/auth-store'

export const Route = createFileRoute('/orders/$orderId')({
  beforeLoad: () => {
    requireAuth(useAuthStore.getState())
  },
  component: OrderDetailRoute,
})

function OrderDetailRoute() {
  const { orderId } = Route.useParams()
  return <OrderDetailPage orderId={orderId} />
}
