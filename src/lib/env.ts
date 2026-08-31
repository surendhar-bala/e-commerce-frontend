export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? '',
  enforceRouteGuards: import.meta.env.VITE_ENFORCE_ROUTE_GUARDS === 'true',
} as const
