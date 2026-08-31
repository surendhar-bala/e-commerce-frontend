import { Link } from '@tanstack/react-router'
import { Lock } from 'lucide-react'
import type { ReactNode } from 'react'
import { Logo } from '@/components/common/logo'
import { ThemeToggle } from '@/components/common/theme-toggle'

export function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-secondary/40">
      <header className="border-b bg-background">
        <div className="container-page flex h-16 items-center justify-between">
          <Logo />
          <p className="hidden items-center gap-2 text-xs tracking-[0.14em] uppercase text-muted-foreground sm:flex">
            <Lock className="size-3.5" />
            Secure checkout
          </p>
          <div className="flex items-center gap-2">
            <Link to="/cart" className="text-sm hover:text-primary">
              Back to cart
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
