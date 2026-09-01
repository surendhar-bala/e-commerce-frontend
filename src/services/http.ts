import { env } from '@/lib/env'

export class ServiceError extends Error {
  readonly status: number
  readonly code: string

  constructor(message: string, status = 500, code = 'SERVICE_ERROR') {
    super(message)
    this.name = 'ServiceError'
    this.status = status
    this.code = code
  }
}

export class BackendUnavailableError extends ServiceError {
  constructor(service: string) {
    super(
      `${service} is ready for the NestJS API. Set VITE_API_URL and replace the mock adapter to enable this action.`,
      503,
      'BACKEND_UNAVAILABLE',
    )
    this.name = 'BackendUnavailableError'
  }
}

export function getApiBaseUrl(): string {
  return env.apiUrl.replace(/\/$/, '')
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl()
  if (!baseUrl) {
    throw new BackendUnavailableError('API')
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new ServiceError(`Request failed with status ${response.status}`, response.status)
  }

  return (await response.json()) as T
}
