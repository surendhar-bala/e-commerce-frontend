import type { Order } from '@/types/order'
import { OrderStatus } from '@/types/order'

export const orders: Order[] = [
  {
    id: 'ord-1842',
    placedAt: '2026-07-18T14:20:00.000Z',
    status: OrderStatus.Delivered,
    items: [
      {
        productId: 'prod-linen-shirt',
        name: 'Linen Oversized Shirt',
        price: 128,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
      },
      {
        productId: 'prod-santal',
        name: 'Bois de Santal',
        price: 148,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601',
      },
    ],
    shippingAddress: {
      fullName: 'Amelia Hart',
      line1: '18 Mercer Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10013',
      country: 'United States',
    },
    subtotal: 276,
    shipping: 0,
    total: 276,
  },
  {
    id: 'ord-1904',
    placedAt: '2026-08-09T09:05:00.000Z',
    status: OrderStatus.Shipped,
    items: [
      {
        productId: 'prod-leather-tote',
        name: 'Structured Leather Tote',
        price: 285,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
      },
    ],
    shippingAddress: {
      fullName: 'Amelia Hart',
      line1: '18 Mercer Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10013',
      country: 'United States',
    },
    subtotal: 285,
    shipping: 0,
    total: 285,
  },
]
