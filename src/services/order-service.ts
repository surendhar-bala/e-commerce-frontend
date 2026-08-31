import type { Order, ShippingAddress } from '@/types/order'
import type { CartItem } from '@/types/cart'

export type CreateOrderPayload = {
  items: CartItem[]
  shippingAddress: ShippingAddress
}

export type OrderService = {
  list: () => Promise<Order[]>
  getById: (id: string) => Promise<Order | null>
  create: (payload: CreateOrderPayload) => Promise<Order>
}
