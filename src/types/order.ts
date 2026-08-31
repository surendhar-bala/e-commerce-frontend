export const OrderStatus = {
  Pending: 'pending',
  Paid: 'paid',
  Shipped: 'shipped',
  Delivered: 'delivered',
  Cancelled: 'cancelled',
} as const

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]

export type OrderItem = {
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl: string
}

export type ShippingAddress = {
  fullName: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export type Order = {
  id: string
  placedAt: string
  status: OrderStatus
  items: OrderItem[]
  shippingAddress: ShippingAddress
  subtotal: number
  shipping: number
  total: number
}
