import { Link, useNavigate } from '@tanstack/react-router'
import { LayoutDashboard, LogOut, Package, ShoppingBag } from 'lucide-react'
import type { ReactNode } from 'react'
import { Logo } from '@/components/common/logo'
import { ThemeToggle } from '@/components/common/theme-toggle'
import { Button } from '@/components/ui/button'
import { env } from '@/lib/env'
import { logout } from '@/lib/logout'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const links = [
  { to: '/seller', label: 'Overview', icon: LayoutDashboard },
  { to: '/seller/products', label: 'My products', icon: Package },
  { to: '/seller/orders', label: 'Orders', icon: ShoppingBag },
] as const

export function SellerLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  function handleSignOut() {
    logout()
    toast.success('Signed out.')
    void navigate({ to: '/login' })
  }

  return (
    <div className="flex min-h-svh flex-col bg-secondary/20 lg:flex-row">
      <aside className="border-b border-border/60 bg-card lg:w-64 lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between px-5 py-4">
          <Logo to="/seller" />
          <ThemeToggle />
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible" aria-label="Seller">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-secondary"
              activeProps={{ className: 'bg-primary/10 text-primary font-medium' }}
              activeOptions={{ exact: link.to === '/seller' }}
            >
              <link.icon className="size-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden px-3 pb-6 lg:block">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </aside>
      <div className="flex-1">
        {!env.enforceRouteGuards ? (
          <p className={cn('border-b border-border/60 bg-accent/30 px-5 py-2 text-xs text-accent-foreground')}>
            Seller hub — manage your products and orders here.
          </p>
        ) : null}
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-3 lg:hidden">
          <ThemeToggle />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
        <div className="p-5 sm:p-8">{children}</div>
      </div>
    </div>
  )
}
