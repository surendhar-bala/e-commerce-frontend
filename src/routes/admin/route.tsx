import { Outlet, createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '@/lib/guards'
import { useAuthStore } from '@/store/auth-store'

export const Route = createFileRoute('/admin')({
  beforeLoad: () => {
    requireAdmin(useAuthStore.getState())
  },
  component: AdminRoute,
})

function AdminRoute() {
  return <Outlet />
}
