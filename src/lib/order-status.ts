import type { OrderStatus } from '@/types/order'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Placed',
  paid: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const ORDER_STATUS_STEPS: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered']

export function getOrderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status] ?? status
}

export function getOrderStatusIndex(status: OrderStatus): number {
  if (status === 'cancelled') return -1
  return ORDER_STATUS_STEPS.indexOf(status)
}

export function isPendingDelivery(status: OrderStatus): boolean {
  return status === 'pending' || status === 'paid' || status === 'shipped'
}
