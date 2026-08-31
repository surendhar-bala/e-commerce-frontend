export type PaymentIntent = {
  clientSecret: string
  provider: 'pending'
}

export type PaymentService = {
  createIntent: (amount: number, currency?: string) => Promise<PaymentIntent>
}
