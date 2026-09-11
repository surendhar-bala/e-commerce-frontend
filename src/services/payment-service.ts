export type PaymentIntent = {
  clientSecret: string
  provider: 'pending' | 'razorpay'
  orderId?: string
  razorpayOrderId?: string
  amount?: number
  currency?: string
  keyId?: string
}

export type VerifyPaymentPayload = {
  orderId: string
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
  amount: number
}

export type PaymentService = {
  createIntent: (amount: number, currency?: string, orderId?: string) => Promise<PaymentIntent>
  verifyPayment: (payload: VerifyPaymentPayload) => Promise<{ success: boolean }>
}
