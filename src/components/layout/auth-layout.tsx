import type { ReactNode } from 'react'
import { Logo } from '@/components/common/logo'
import { ThemeToggle } from '@/components/common/theme-toggle'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-foreground lg:block">
        <img
          src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1400&q=80"
          alt="Paint tubes and brushes on a wooden table"
          className="absolute inset-0 size-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="font-display text-4xl text-background">Shop it. Or sell it.</p>
          <p className="mt-3 max-w-md text-sm text-background/70">
            Create an account with your phone, email, and password — then shop paints, toys, and daily essentials, or list your own.
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
