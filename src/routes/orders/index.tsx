import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '@/lib/guards'
import { OrdersPage } from '@/features/orders/orders-page'
import { ordersSearchSchema } from '@/features/orders/search-schema'
import { useAuthStore } from '@/store/auth-store'

export const Route = createFileRoute('/orders/')({
  validateSearch: ordersSearchSchema,
  beforeLoad: () => {
    requireAuth(useAuthStore.getState())
  },
  component: OrdersPage,
})
