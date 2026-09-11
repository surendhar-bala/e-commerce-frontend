import type { CartService } from '@/services/cart-service'

// Cart remains client-side in the MVP; Zustand owns cart state.
export const apiCartService: CartService = {
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
