import { Outlet, createFileRoute } from '@tanstack/react-router'
import { requireSeller } from '@/lib/guards'
import { useAuthStore } from '@/store/auth-store'

export const Route = createFileRoute('/seller')({
  beforeLoad: () => {
    requireSeller(useAuthStore.getState())
  },
  component: SellerRoute,
})

function SellerRoute() {
  return <Outlet />
}
