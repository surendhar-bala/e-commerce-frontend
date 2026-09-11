import { Link, useNavigate } from '@tanstack/react-router'
import { Menu, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Logo } from '@/components/common/logo'
import { ThemeToggle } from '@/components/common/theme-toggle'
import { UserAvatar } from '@/components/common/user-avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { logout } from '@/lib/logout'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'
import { getCartItemCount, useCartStore } from '@/store/cart-store'
import { toast } from 'sonner'

export function SiteHeader() {
  const navigate = useNavigate()
  const [compact, setCompact] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const cartItems = useCartStore((state) => state.items)
  const itemCount = getCartItemCount(cartItems)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleSignOut() {
    logout()
    toast.success('Signed out.')
    setMobileOpen(false)
    void navigate({ to: '/products' })
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl transition-[height,box-shadow] duration-200',
        compact ? 'shadow-soft' : '',
      )}
    >
      <div className="container-page">
        <div className={cn('flex min-w-0 items-center gap-2 sm:gap-3', compact ? 'h-14' : 'h-16 md:h-[4.25rem]')}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu />
          </Button>

          <Logo />

          <div className="ml-auto flex shrink-0 items-center gap-0.5">
            <ThemeToggle />
            <Link
              to="/cart"
              className="relative inline-flex size-10 items-center justify-center overflow-visible rounded-md hover:bg-secondary"
              aria-label={`Cart, ${itemCount} items`}
            >
              <ShoppingBag className="size-5" />
              {itemCount > 0 ? (
                <span className="absolute -top-1 -right-1 z-10 flex min-h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold leading-none text-primary-foreground ring-2 ring-background">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              ) : null}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={isAuthenticated ? `Account for ${user?.name ?? 'user'}` : 'Account'}
                  className="shrink-0 rounded-full"
                >
                  <UserAvatar name={isAuthenticated ? user?.name : null} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="truncate">Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAuthenticated ? (
                  <>
                    {user?.name ? (
                      <DropdownMenuLabel className="truncate font-normal normal-case tracking-normal text-muted-foreground">
                        {user.name}
                      </DropdownMenuLabel>
                    ) : null}
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="w-full">
                        Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleSignOut}>Sign out</DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login" className="w-full">
                        Sign in
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register" className="w-full truncate">
                        Create account
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="flex w-[min(100%,20rem)] flex-col">
          <SheetHeader className="shrink-0">
            <SheetTitle>
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-6 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto" aria-label="Mobile">
            <Link
              to="/cart"
              className="rounded-lg px-3 py-2.5 text-base font-medium hover:bg-secondary"
              onClick={() => setMobileOpen(false)}
            >
              Cart{itemCount > 0 ? ` (${itemCount})` : ''}
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/orders"
                  className="rounded-lg px-3 py-2.5 text-base font-medium hover:bg-secondary"
                  onClick={() => setMobileOpen(false)}
                >
                  Orders
                </Link>
                <button
                  type="button"
                  className="rounded-lg px-3 py-2.5 text-left text-base font-medium hover:bg-secondary"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-2.5 text-base font-medium hover:bg-secondary"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg px-3 py-2.5 text-base font-medium hover:bg-secondary"
                  onClick={() => setMobileOpen(false)}
                >
                  Create account
                </Link>
              </>
            )}
          </nav>
          <div className="mt-auto flex shrink-0 items-center gap-2 border-t pt-4">
            <ThemeToggle />
            <span className="text-sm text-muted-foreground">Theme</span>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
