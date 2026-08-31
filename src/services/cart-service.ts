import type { CartItem } from '@/types/cart'

export type CartService = {
  list: () => Promise<CartItem[]>
  add: (item: CartItem) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  remove: (productId: string) => Promise<void>
  clear: () => Promise<void>
}
