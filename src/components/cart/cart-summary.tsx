import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/format'
import { getCartSummary } from '@/store/cart-store'
import type { CartItem } from '@/types/cart'

type CartSummaryCardProps = {
  items: CartItem[]
}

export function CartSummaryCard({ items }: CartSummaryCardProps) {
  const summary = getCartSummary(items)

  return (
    <aside className="h-fit rounded-2xl bg-card p-6 shadow-soft">
      <h2 className="font-display text-xl">Order summary</h2>
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd>{formatCurrency(summary.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Discount</dt>
          <dd>{formatCurrency(summary.discount)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">GST (18%)</dt>
          <dd>{formatCurrency(summary.tax)}</dd>
        </div>
      </dl>
      <Separator className="my-4" />
      <div className="flex justify-between text-base">
        <span>Total</span>
        <span className="text-price text-lg">{formatCurrency(summary.total)}</span>
      </div>
      <Button asChild className="mt-6 w-full" size="lg">
        <Link to="/checkout">Continue to checkout</Link>
      </Button>
    </aside>
  )
}
