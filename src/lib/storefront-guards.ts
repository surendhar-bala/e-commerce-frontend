import { redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/auth-store'

export function redirectSellerFromStorefront() {
  const { role, isAuthenticated } = useAuthStore.getState()
  if (isAuthenticated && role === 'seller') {
    throw redirect({ to: '/seller' })
  }
}

export function redirectByRole() {
  const { role, isAuthenticated } = useAuthStore.getState()
  if (!isAuthenticated) {
    throw redirect({ to: '/products' })
  }
  if (role === 'seller') {
    throw redirect({ to: '/seller' })
  }
  if (role === 'admin') {
    throw redirect({ to: '/admin' })
  }
  throw redirect({ to: '/products' })
}
