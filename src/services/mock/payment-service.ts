import { BackendUnavailableError } from '@/services/http'
import type { PaymentService } from '@/services/payment-service'

export const mockPaymentService: PaymentService = {
  async createIntent() {
    throw new BackendUnavailableError('Payments')
  },
}
