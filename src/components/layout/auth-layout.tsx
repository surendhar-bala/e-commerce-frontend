import type { ReactNode } from 'react'
import { Logo } from '@/components/common/logo'
import { ThemeToggle } from '@/components/common/theme-toggle'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-foreground lg:block">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80"
          alt="Quiet boutique interior with warm lighting"
          className="absolute inset-0 size-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="font-display text-4xl text-background">A quieter kind of luxury.</p>
          <p className="mt-3 max-w-md text-sm text-background/70">
            Sign in to follow orders, save pieces, and check out more quickly.
          </p>
        </div>
      </div>
      <div className="flex min-h-svh flex-col">
        <div className="flex items-center justify-between px-6 py-5">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  )
}
