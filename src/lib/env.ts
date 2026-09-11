export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? '',
  apiAuthPath: import.meta.env.VITE_API_AUTH_PATH ?? '/api/auth',
  apiProductsPath: import.meta.env.VITE_API_PRODUCTS_PATH ?? '/api/products',
  apiOrdersPath: import.meta.env.VITE_API_ORDERS_PATH ?? '/api/orders',
  apiPaymentsPath: import.meta.env.VITE_API_PAYMENTS_PATH ?? '/api/payments',
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID ?? '',
  enforceRouteGuards: import.meta.env.VITE_ENFORCE_ROUTE_GUARDS === 'true',
} as const
