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
              'flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm',
              complete ? 'border-primary/30 bg-primary/5 text-foreground' : 'border-border bg-muted/30 text-muted-foreground',
              active && 'ring-1 ring-primary/30',
            )}
          >
            <span
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs',
                complete ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
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
