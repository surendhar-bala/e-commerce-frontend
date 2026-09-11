import { Check } from 'lucide-react'
import { getOrderStatusIndex, getOrderStatusLabel, ORDER_STATUS_STEPS } from '@/lib/order-status'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/types/order'

type OrderStatusTrackerProps = {
  status: OrderStatus
  className?: string
}

export function OrderStatusTracker({ status, className }: OrderStatusTrackerProps) {
  if (status === 'cancelled') {
    return (
      <p className={cn('text-sm font-medium text-destructive', className)}>
        This order was cancelled.
      </p>
    )
  }

  const currentIndex = getOrderStatusIndex(status)

  return (
    <ol className={cn('grid gap-2 sm:grid-cols-4', className)}>
      {ORDER_STATUS_STEPS.map((step, index) => {
        const complete = index <= currentIndex
        const active = index === currentIndex
        return (
          <li
            key={step}
            className={cn(
              'flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors',
              complete
                ? 'border-primary/30 bg-primary/5 text-foreground dark:border-primary/40 dark:bg-primary/10'
                : 'border-border bg-muted/30 text-muted-foreground',
              active &&
                'border-primary bg-primary/15 ring-2 ring-primary/25 dark:border-primary/50 dark:bg-primary/20 dark:ring-primary/35',
            )}
          >
            <span
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs',
                complete
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground',
                active && 'ring-2 ring-primary/30 ring-offset-2 ring-offset-background',
              )}
            >
              {complete && index < currentIndex ? <Check className="size-3.5" /> : index + 1}
            </span>
            <span className="font-medium">{getOrderStatusLabel(step)}</span>
          </li>
        )
      })}
    </ol>
  )
}
