export type RazorpaySuccessResponse = {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

type RazorpayCheckoutOptions = {
  key: string
  amount: number
  currency: string
  name: string
  description?: string
  order_id: string
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  theme?: {
    color?: string
  }
  handler: (response: RazorpaySuccessResponse) => void
  modal?: {
    ondismiss?: () => void
  }
}

type RazorpayInstance = {
  open: () => void
  on: (event: string, handler: (response: { error?: { description?: string } }) => void) => void
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance
  }
}

export function loadRazorpayScript(): Promise<void> {
  if (window.Razorpay) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Unable to load Razorpay checkout.'))
    document.body.appendChild(script)
  })
}

export type OpenRazorpayInput = {
  keyId: string
  razorpayOrderId: string
  amount: number
  currency?: string
  name?: string
  description?: string
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
}

export async function openRazorpayCheckout(input: OpenRazorpayInput): Promise<RazorpaySuccessResponse> {
  await loadRazorpayScript()

  const Razorpay = window.Razorpay
  if (!Razorpay) {
    throw new Error('Razorpay checkout is unavailable.')
  }

  return new Promise((resolve, reject) => {
    const rzp = new Razorpay({
      key: input.keyId,
      amount: Math.round(input.amount * 100),
      currency: input.currency ?? 'INR',
      name: input.name ?? 'Velora',
      description: input.description ?? 'Order payment',
      order_id: input.razorpayOrderId,
      prefill: input.prefill,
      theme: { color: '#171717' },
      handler: (response) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error('Payment was cancelled.')),
      },
    })

    rzp.on('payment.failed', (response) => {
      reject(new Error(response.error?.description ?? 'Payment failed.'))
    })

    rzp.open()
  })
}
