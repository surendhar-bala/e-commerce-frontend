import { apiEndpoints } from '@/lib/api-endpoints'
import { apiRequest } from '@/services/http'
import type { PaymentIntent, PaymentService, VerifyPaymentPayload } from '@/services/payment-service'

export const apiPaymentService: PaymentService = {
  async createIntent(amount, currency = 'INR', orderId) {
    return apiRequest<PaymentIntent>(`${apiEndpoints.payments}/create-intent`, {
      method: 'POST',
      body: JSON.stringify({ amount, currency, orderId }),
    })
  },

  async verifyPayment(payload: VerifyPaymentPayload) {
    return apiRequest<{ success: boolean }>(`${apiEndpoints.payments}/verify`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}
