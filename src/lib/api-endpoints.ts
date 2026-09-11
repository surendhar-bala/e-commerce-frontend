import { env } from '@/lib/env'

function normalizeBaseUrl(url: string) {
  return url.replace(/\/$/, '')
}

export const apiEndpoints = {
  baseUrl: normalizeBaseUrl(env.apiUrl),
  auth: env.apiAuthPath,
  products: env.apiProductsPath,
  orders: env.apiOrdersPath,
  payments: env.apiPaymentsPath,
  upload: '/api/upload',
} as const
