import { formatCurrency, formatDiscount } from '@/lib/format'
import { cn } from '@/lib/utils'

type PriceDisplayProps = {
  price: number
  compareAtPrice?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PriceDisplay({ price, compareAtPrice, size = 'md', className }: PriceDisplayProps) {
  const discount = compareAtPrice ? formatDiscount(price, compareAtPrice) : 0
  const sizeClass =
    size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-base'

  return (
    <div className={cn('flex flex-wrap items-baseline gap-2', className)}>
      <span className={cn('text-price text-foreground', sizeClass)}>{formatCurrency(price)}</span>
      {compareAtPrice && discount > 0 ? (
        <>
          <span className="text-sm text-muted-foreground line-through">{formatCurrency(compareAtPrice)}</span>
          <span className="text-xs font-medium text-primary">-{discount}%</span>
        </>
      ) : null}
    </div>
  )
}
