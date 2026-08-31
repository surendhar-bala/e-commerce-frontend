import type { CartService } from '@/services/cart-service'

export const mockCartService: CartService = {
  async list() {
    return []
  },
  async add() {
    return
  },
  async updateQuantity() {
    return
  },
  async remove() {
    return
  },
  async clear() {
    return
  },
}
