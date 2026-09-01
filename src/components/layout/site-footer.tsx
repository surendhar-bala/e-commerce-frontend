import { Link } from '@tanstack/react-router'
import { Logo } from '@/components/common/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BRAND } from '@/lib/constants'
import { toast } from 'sonner'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-foreground text-background">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo inverted />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-background/70">{BRAND.tagline}</p>
          <form
            className="mt-6 flex max-w-sm gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              const form = event.currentTarget
              const email = new FormData(form).get('email')
              if (typeof email === 'string' && email.includes('@')) {
                toast.success('You are on the list. We write rarely.')
                form.reset()
              } else {
                toast.error('Please enter a valid email.')
              }
            }}
          >
            <label className="sr-only" htmlFor="footer-email">
              Email address
            </label>
            <Input
              id="footer-email"
              name="email"
              type="email"
              required
              placeholder="Email address"
              className="border-background/20 bg-background/8 text-background placeholder:text-background/50"
            />
            <Button type="submit" variant="secondary">
              Join
            </Button>
          </form>
        </div>
        <div>
          <p className="text-caption text-background/50">Shop</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/products" className="hover:text-accent">
                All products
              </Link>
            </li>
            <li>
              <Link to="/products" search={{ category: 'cat-art' }} className="hover:text-accent">
                Painting materials
              </Link>
            </li>
            <li>
              <Link to="/products" search={{ category: 'cat-toys' }} className="hover:text-accent">
                Kids toys
              </Link>
            </li>
            <li>
              <Link to="/products" search={{ category: 'cat-everyday' }} className="hover:text-accent">
                Everyday products
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-caption text-background/50">Account</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/login" className="hover:text-accent">
                Sign in
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-accent">
                Create account
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-accent">
                Orders
              </Link>
            </li>
            <li>
              <Link to="/forgot-password" className="hover:text-accent">
                Reset password
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-caption text-background/50">Help</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href={`mailto:${BRAND.supportEmail}`} className="hover:text-accent">
                {BRAND.supportEmail}
              </a>
            </li>
            <li>
              <Link to="/register" search={{ as: 'seller' }} className="hover:text-accent">
                Sell on Velora
              </Link>
            </li>
            <li>
              <Link to="/seller" className="hover:text-accent">
                Seller hub
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-accent">
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-background/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p>Free delivery over ₹499 · 7-day returns · COD available</p>
        </div>
      </div>
    </footer>
  )
}
