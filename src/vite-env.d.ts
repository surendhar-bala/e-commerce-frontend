/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_AUTH_PATH: string
  readonly VITE_API_PRODUCTS_PATH: string
  readonly VITE_API_ORDERS_PATH: string
  readonly VITE_API_PAYMENTS_PATH: string
  readonly VITE_RAZORPAY_KEY_ID: string
  readonly VITE_ENFORCE_ROUTE_GUARDS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
