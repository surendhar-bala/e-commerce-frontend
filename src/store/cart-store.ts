import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SHIPPING_THRESHOLD, STANDARD_SHIPPING, TAX_RATE } from '@/lib/constants'
import type { CartItem, CartSummary } from '@/types/cart'
import type { Product } from '@/types/product'

type CartState = {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clear: () => void
}

export function getCartSummary(items: CartItem[]): CartSummary {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal === 0 || subtotal >= SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING
  const discount = 0
  const tax = Math.round(subtotal * TAX_RATE)
  const total = Math.round(subtotal - discount + shipping + tax)

  return { subtotal, discount, shipping, tax, total }
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.productId === product.id)
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id
                  ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock) }
                  : item,
              ),
            }
          }

          const image = product.media[0]
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                name: product.name,
                price: product.price,
                imageUrl: image?.url ?? '',
                imageAlt: image?.alt ?? product.name,
                quantity: Math.min(quantity, product.stock),
                stock: product.stock,
              },
            ],
          }
        }),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.productId !== productId)
              : state.items.map((item) =>
                  item.productId === productId
                    ? { ...item, quantity: Math.min(quantity, item.stock) }
                    : item,
                ),
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'velora-cart-inr',
    },
  ),
)
