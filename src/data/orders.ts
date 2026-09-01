import type { Order } from '@/types/order'
import { OrderStatus } from '@/types/order'

export const orders: Order[] = [
  {
    id: 'ord-1842',
    placedAt: '2026-07-18T14:20:00.000Z',
    status: OrderStatus.Delivered,
    items: [
      {
        productId: 'prod-acrylic-set',
        name: 'Acrylic Paint Set — 12 colours',
        price: 449,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
      },
      {
        productId: 'prod-wooden-blocks',
        name: 'Wooden Building Blocks',
        price: 799,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b',
      },
    ],
    shippingAddress: {
      fullName: 'Ananya Mehta',
      line1: '14, 2nd Main, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
    },
    subtotal: 1248,
    shipping: 0,
    total: 1248,
  },
  {
    id: 'ord-1904',
    placedAt: '2026-08-09T09:05:00.000Z',
    status: OrderStatus.Shipped,
    items: [
      {
        productId: 'prod-steel-tiffin',
        name: 'Steel Tiffin — 3 tier',
        price: 699,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
      },
    ],
    shippingAddress: {
      fullName: 'Ananya Mehta',
      line1: '14, 2nd Main, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
    },
    subtotal: 699,
    shipping: 0,
    total: 699,
  },
]
