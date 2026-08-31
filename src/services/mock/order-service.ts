import { orders as seedOrders } from '@/data/orders'
import { BackendUnavailableError } from '@/services/http'
import type { OrderService } from '@/services/order-service'

export const mockOrderService: OrderService = {
  async list() {
    return seedOrders
  },
  async getById(id) {
    return seedOrders.find((order) => order.id === id) ?? null
  },
  async create() {
    throw new BackendUnavailableError('Checkout')
  },
}
