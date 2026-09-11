import { Lock } from 'lucide-react'
import type { ReactNode } from 'react'
import { BackLink } from '@/components/common/back-link'
import { Logo } from '@/components/common/logo'
import { ThemeToggle } from '@/components/common/theme-toggle'

export function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-secondary/30">
      <header className="border-b border-border/60 bg-background/95 backdrop-blur-sm">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Logo />
          <p className="hidden items-center gap-2 text-xs tracking-[0.14em] uppercase text-muted-foreground sm:flex">
            <Lock className="size-3.5 text-primary" />
            Secure checkout
          </p>
          <div className="flex items-center gap-2">
            <BackLink to="/cart" label="Back to cart" className="hidden sm:inline-flex" />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
