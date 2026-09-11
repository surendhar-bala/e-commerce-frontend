import { apiEndpoints } from '@/lib/api-endpoints'
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
      `${service} requires the backend API. Set VITE_API_URL in your .env file and start the Express server.`,
      503,
      'BACKEND_UNAVAILABLE',
    )
    this.name = 'BackendUnavailableError'
  }
}

const ACCESS_TOKEN_KEY = 'velora-access-token'

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token: string | null) {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  }
}

export function getApiBaseUrl(): string {
  return apiEndpoints.baseUrl
}

export function isApiEnabled(): boolean {
  return Boolean(env.apiUrl)
}

type ApiErrorBody = {
  message?: string
  code?: string
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl()
  if (!baseUrl) {
    throw new BackendUnavailableError('API')
  }

  const token = getAccessToken()
  const method = (init?.method ?? 'GET').toUpperCase()
  const hasBody = init?.body != null
  const headers = new Headers(init?.headers)

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (hasBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (!hasBody && method === 'GET' && headers.has('Content-Type')) {
    headers.delete('Content-Type')
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
  })

  if (response.status === 204) {
    return undefined as T
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody
    throw new ServiceError(
      body.message ?? `Request failed with status ${response.status}`,
      response.status,
      body.code ?? 'REQUEST_FAILED',
    )
  }

  return (await response.json()) as T
}
