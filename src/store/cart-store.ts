import { create } from 'zustand'

import { persist } from 'zustand/middleware'

import { TAX_RATE } from '@/lib/constants'

import type { CartItem, CartSummary } from '@/types/cart'

import type { Product } from '@/types/product'



type CartState = {

  items: CartItem[]

  addItem: (product: Product, quantity?: number) => boolean

  updateQuantity: (productId: string, quantity: number) => void

  removeItem: (productId: string) => void

  clear: () => void

}



function normalizeStock(stock: number | undefined) {

  const value = Number(stock)

  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0

}



function pickProductImage(product: Product) {

  const image = product.media.find((item) => item.type !== 'video') ?? product.media[0]

  return {

    imageUrl: image?.url ?? '',

    imageAlt: image?.alt ?? product.name,

  }

}



export function getCartItemCount(items: CartItem[]) {

  return items.reduce((sum, item) => sum + item.quantity, 0)

}



export function getCartSummary(items: CartItem[]): CartSummary {

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const shipping = 0

  const discount = 0

  const tax = Math.round(subtotal * TAX_RATE)

  const total = Math.round(subtotal - discount + shipping + tax)



  return { subtotal, discount, shipping, tax, total }

}



export const useCartStore = create<CartState>()(

  persist(

    (set) => ({

      items: [],

      addItem: (product, quantity = 1) => {

        const stock = normalizeStock(product.stock)

        if (stock <= 0) {

          return false

        }



        const qty = Math.max(1, Math.min(quantity, stock))

        let added = false



        set((state) => {

          const existing = state.items.find((item) => item.productId === product.id)

          if (existing) {

            const nextQuantity = Math.min(existing.quantity + qty, stock)

            added = nextQuantity > existing.quantity

            return {

              items: state.items.map((item) =>

                item.productId === product.id

                  ? { ...item, quantity: nextQuantity, stock }

                  : item,

              ),

            }

          }



          const { imageUrl, imageAlt } = pickProductImage(product)

          added = true

          return {

            items: [

              ...state.items,

              {

                productId: product.id,

                name: product.name,

                price: product.price,

                imageUrl,

                imageAlt,

                quantity: qty,

                stock,

              },

            ],

          }

        })



        return added

      },

      updateQuantity: (productId, quantity) =>

        set((state) => ({

          items:

            quantity <= 0

              ? state.items.filter((item) => item.productId !== productId)

              : state.items.map((item) =>

                  item.productId === productId

                    ? { ...item, quantity: Math.min(Math.max(1, quantity), item.stock) }

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

      onRehydrateStorage: () => (state) => {

        if (!state) return

        state.items = state.items.filter((item) => item.quantity > 0 && item.stock > 0)

      },

    },

  ),

)

