import { Link } from '@tanstack/react-router'
import { LayoutDashboard, Package } from 'lucide-react'
import type { ReactNode } from 'react'
import { Logo } from '@/components/common/logo'
import { ThemeToggle } from '@/components/common/theme-toggle'
import { env } from '@/lib/env'
import { cn } from '@/lib/utils'

const links = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
] as const

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-secondary/30 lg:flex-row">
      <aside className="border-b bg-card lg:w-64 lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between px-5 py-4">
          <Logo />
          <ThemeToggle />
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible" aria-label="Admin">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-secondary"
              activeProps={{ className: 'bg-secondary text-foreground' }}
            >
              <link.icon className="size-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden px-5 pb-6 text-xs text-muted-foreground lg:block">
          <Link to="/" className="hover:text-foreground">
            ← Return to store
          </Link>
        </div>
      </aside>
      <div className="flex-1">
        {!env.enforceRouteGuards ? (
          <p className={cn('border-b bg-accent/20 px-5 py-2 text-xs text-accent-foreground')}>
            Admin preview — backend authorization will enforce access when the API is connected.
          </p>
        ) : null}
        <div className="p-5 sm:p-8">{children}</div>
      </div>
    </div>
  )
}
