import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '@/lib/guards'
import { OrdersPage } from '@/features/orders/orders-page'
import { useAuthStore } from '@/store/auth-store'

export const Route = createFileRoute('/orders/')({
  beforeLoad: () => {
    requireAuth(useAuthStore.getState())
  },
  component: OrdersPage,
})
