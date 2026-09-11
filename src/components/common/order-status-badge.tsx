import { Badge } from '@/components/ui/badge'
import { getOrderStatusLabel } from '@/lib/order-status'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/types/order'

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-warning/15 text-warning-foreground border-warning/30',
  paid: 'bg-info/15 text-info-foreground border-info/30',
  shipped: 'bg-primary/15 text-primary border-primary/30',
  delivered: 'bg-success/15 text-success-foreground border-success/30',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
}

type OrderStatusBadgeProps = {
  status: OrderStatus
  className?: string
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn('capitalize', STATUS_STYLES[status], className)}>
      {getOrderStatusLabel(status)}
    </Badge>
  )
}
