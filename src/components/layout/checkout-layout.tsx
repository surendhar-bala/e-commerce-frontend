import { Lock } from 'lucide-react'
import { createContext, useContext, useState, type ReactNode } from 'react'
import { BackLink } from '@/components/common/back-link'
import { Logo } from '@/components/common/logo'
import { ThemeToggle } from '@/components/common/theme-toggle'

type CheckoutHeaderContextValue = {
  hideBackToCart: boolean
  setHideBackToCart: (hide: boolean) => void
}

const CheckoutHeaderContext = createContext<CheckoutHeaderContextValue | null>(null)

export function useCheckoutHeader() {
  const context = useContext(CheckoutHeaderContext)
  if (!context) {
    throw new Error('useCheckoutHeader must be used within CheckoutLayout')
  }
  return context
}

export function CheckoutLayout({ children }: { children: ReactNode }) {
  const [hideBackToCart, setHideBackToCart] = useState(false)

  return (
    <CheckoutHeaderContext.Provider value={{ hideBackToCart, setHideBackToCart }}>
      <div className="flex min-h-svh flex-col bg-secondary/30">
        <header className="border-b border-border/60 bg-background/95 backdrop-blur-sm">
          <div className="container-page flex h-16 items-center justify-between gap-4">
            <Logo />
            <p className="hidden items-center gap-2 text-xs tracking-[0.14em] uppercase text-muted-foreground sm:flex">
              <Lock className="size-3.5 text-primary" />
              Secure checkout
            </p>
            <div className="flex items-center gap-2">
              {!hideBackToCart ? (
                <BackLink to="/cart" label="Back to cart" className="hidden sm:inline-flex" />
              ) : null}
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </CheckoutHeaderContext.Provider>
  )
}
