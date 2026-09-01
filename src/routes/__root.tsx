import { Outlet, ScrollRestoration, createRootRoute, useRouterState } from '@tanstack/react-router'
import { NotFoundState } from '@/components/common/not-found-state'
import { ErrorState } from '@/components/common/error-state'
import { AdminLayout } from '@/components/layout/admin-layout'
import { AuthLayout } from '@/components/layout/auth-layout'
import { CheckoutLayout } from '@/components/layout/checkout-layout'
import { StorefrontLayout } from '@/components/layout/storefront-layout'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { Toaster } from '@/components/ui/sonner'

const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/reset-password']

function RootComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isAdmin = pathname.startsWith('/admin')
  const isAuth = AUTH_PATHS.includes(pathname)
  const isCheckout = pathname === '/checkout'

  let content = (
    <StorefrontLayout>
      <Outlet />
    </StorefrontLayout>
  )

  if (isAdmin) {
    content = (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    )
  } else if (isAuth) {
    content = (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    )
  } else if (isCheckout) {
    content = (
      <CheckoutLayout>
        <Outlet />
      </CheckoutLayout>
    )
  }

  return (
    <ThemeProvider>
      {content}
      <Toaster />
      <ScrollRestoration />
    </ThemeProvider>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundState,
  errorComponent: ({ reset }) => <ErrorState onRetry={reset} />,
})
