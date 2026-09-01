import { Link } from '@tanstack/react-router'
import { Heart, Menu, Search, ShoppingBag, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Logo } from '@/components/common/logo'
import { ThemeToggle } from '@/components/common/theme-toggle'
import { SearchExperience } from '@/components/layout/search-experience'
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
import { categories } from '@/data/categories'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'
import { useCartStore } from '@/store/cart-store'
import { toast } from 'sonner'

export function SiteHeader() {
  const [compact, setCompact] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const itemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0))
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const role = useAuthStore((state) => state.role)
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b bg-background/85 backdrop-blur-xl transition-[height,box-shadow] duration-200',
        compact ? 'shadow-soft' : '',
      )}
    >
      <div className="container-page">
        <div className={cn('flex items-center gap-3', compact ? 'h-14' : 'h-16 md:h-[4.25rem]')}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu />
          </Button>

          <Logo />

          <nav className="ml-8 hidden items-center gap-6 lg:flex" aria-label="Primary">
            <Link to="/products" className="text-sm transition-colors hover:text-primary">
              Shop
            </Link>
            {role === 'seller' || role === 'admin' ? (
              <Link to="/seller" className="text-sm transition-colors hover:text-primary">
                Sell
              </Link>
            ) : (
              <Link to="/register" search={{ as: 'seller' }} className="text-sm transition-colors hover:text-primary">
                Sell
              </Link>
            )}
            {categories.map((category) => (
              <Link
                key={category.id}
                to="/products"
                search={{ category: category.id }}
                className="text-sm transition-colors hover:text-primary"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          <div className="mx-auto hidden w-full max-w-md flex-1 lg:block">
            <SearchExperience />
          </div>

          <div className="ml-auto flex items-center gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search />
            </Button>
            <ThemeToggle />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex"
              aria-label="Wishlist"
              onClick={() => toast('Wishlist will connect when accounts are live.')}
            >
              <Heart />
            </Button>
            <Link
              to="/cart"
              className="relative inline-flex size-10 items-center justify-center rounded-md hover:bg-secondary"
              aria-label={`Cart, ${itemCount} items`}
            >
              <ShoppingBag className="size-4" />
              {itemCount > 0 ? (
                <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {itemCount}
                </span>
              ) : null}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="icon" aria-label="Account">
                  <UserRound />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAuthenticated ? (
                  <>
                    {user?.name ? <DropdownMenuLabel className="font-normal text-muted-foreground">{user.name}</DropdownMenuLabel> : null}
                    <DropdownMenuItem asChild>
                      <Link to="/orders">Orders</Link>
                    </DropdownMenuItem>
                    {role === 'seller' || role === 'admin' ? (
                      <DropdownMenuItem asChild>
                        <Link to="/seller">Seller hub</Link>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem asChild>
                        <Link to="/register" search={{ as: 'seller' }}>
                          Become a seller
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {role === 'admin' ? (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">Admin</Link>
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem
                      onSelect={() => {
                        clearSession()
                        toast.success('Signed out.')
                      }}
                    >
                      Sign out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login">Sign in</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register">Create account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register" search={{ as: 'seller' }}>
                        Sell on Velora
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders">Orders</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[min(100%,22rem)]">
          <SheetHeader>
            <SheetTitle>
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-8 flex flex-col gap-4" aria-label="Mobile">
            <Link to="/products" className="text-lg" onClick={() => setMobileOpen(false)}>
              All products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                to="/products"
                search={{ category: category.id }}
                className="text-lg"
                onClick={() => setMobileOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            {role === 'seller' || role === 'admin' ? (
              <Link to="/seller" className="text-lg" onClick={() => setMobileOpen(false)}>
                Sell
              </Link>
            ) : (
              <Link
                to="/register"
                search={{ as: 'seller' }}
                className="text-lg"
                onClick={() => setMobileOpen(false)}
              >
                Sell
              </Link>
            )}
            <Link to="/login" className="text-lg" onClick={() => setMobileOpen(false)}>
              Sign in
            </Link>
            <Link to="/register" className="text-lg" onClick={() => setMobileOpen(false)}>
              Create account
            </Link>
            <Link to="/orders" className="text-lg" onClick={() => setMobileOpen(false)}>
              Orders
            </Link>
          </nav>
        </SheetContent>
      </Sheet>

      <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
        <SheetContent side="top" className="border-b">
          <SheetHeader>
            <SheetTitle>Search</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <SearchExperience compact autoFocus onNavigate={() => setSearchOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
