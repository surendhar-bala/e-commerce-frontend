import { Trash2 } from 'lucide-react'
import { QuantityStepper } from '@/components/common/quantity-stepper'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/format'
import { useCartStore } from '@/store/cart-store'
import type { CartItem } from '@/types/cart'

type CartLineItemProps = {
  item: CartItem
}

export function CartLineItem({ item }: CartLineItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)

  return (
    <article className="grid grid-cols-[88px_1fr] gap-4 border-b py-5 last:border-b-0 sm:grid-cols-[104px_1fr_auto]">
      <img
        src={`${item.imageUrl}?auto=format&fit=crop&w=240&q=80`}
        alt={item.imageAlt}
        className="aspect-[4/5] w-full rounded-lg object-cover"
      />
      <div className="min-w-0">
        <h3 className="text-product-title">{item.name}</h3>
        <p className="mt-1 text-price">{formatCurrency(item.price)}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <QuantityStepper
            value={item.quantity}
            max={item.stock}
            onChange={(quantity) => updateQuantity(item.productId, quantity)}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeItem(item.productId)}
          >
            <Trash2 />
            Remove
          </Button>
        </div>
      </div>
      <p className="hidden text-right text-price sm:block">
        {formatCurrency(item.price * item.quantity)}
      </p>
    </article>
  )
}
