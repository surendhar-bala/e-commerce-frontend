import { Link } from '@tanstack/react-router'
import { ShoppingBag } from 'lucide-react'
import { CartLineItem } from '@/components/cart/cart-line-item'
import { CartSummaryCard } from '@/components/cart/cart-summary'
import { EmptyState } from '@/components/common/empty-state'
import { Button } from '@/components/ui/button'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useCartStore } from '@/store/cart-store'

export function CartPage() {
  useDocumentTitle('Cart')
  const items = useCartStore((state) => state.items)

  if (items.length === 0) {
    return (
      <div className="container-page">
        <EmptyState
          icon={<ShoppingBag className="size-10" />}
          title="Your cart is empty"
          description="Add paints, a toy, or a tiffin — we will keep it here until you check out."
          action={
            <Button asChild>
              <Link to="/products">Continue shopping</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="container-page py-8 md:py-12">
      <h1 className="text-page">Cart</h1>
      <p className="mt-2 text-small">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="rounded-2xl bg-card px-4 shadow-soft sm:px-6">
          {items.map((item) => (
            <CartLineItem key={item.productId} item={item} />
          ))}
        </div>
        <CartSummaryCard items={items} />
      </div>
    </div>
  )
}
