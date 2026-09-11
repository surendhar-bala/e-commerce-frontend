import { apiEndpoints } from '@/lib/api-endpoints'
import { ServiceError, apiRequest } from '@/services/http'
import type { CreateOrderPayload, OrderService } from '@/services/order-service'
import { getCartSummary } from '@/store/cart-store'
import type { Order } from '@/types/order'
export const apiOrderService: OrderService = {
  async list() {
    return apiRequest<Order[]>(apiEndpoints.orders)
  },

  async getById(id) {
    try {
      return await apiRequest<Order>(`${apiEndpoints.orders}/${id}`)
    } catch (error) {
      if (error instanceof ServiceError && error.status === 404) {
        return null
      }
      throw error
    }
  },

  async create(payload: CreateOrderPayload) {
    const summary = getCartSummary(payload.items)

    return apiRequest<Order>(apiEndpoints.orders, {
      method: 'POST',
      body: JSON.stringify({
        items: payload.items,
        shippingAddress: payload.shippingAddress,
        customerEmail: payload.customerEmail,
        customerPhone: payload.customerPhone,
        subtotal: summary.subtotal,
        shipping: 0,
        total: summary.total,
      }),
    })
  },
}
