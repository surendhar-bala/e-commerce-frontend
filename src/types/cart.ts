export type CartItem = {
  productId: string
  name: string
  price: number
  imageUrl: string
  imageAlt: string
  quantity: number
  stock: number
}

export type CartSummary = {
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
}
