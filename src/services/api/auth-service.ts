import { apiRequest } from '@/services/http'
import type { AuthService } from '@/services/auth-service'
import { apiEndpoints } from '@/lib/api-endpoints'
import type {
  AuthSession,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from '@/types/auth'
import { ServiceError } from '@/services/http'

type ApiErrorBody = { message?: string; code?: string }

async function parseSessionResponse(response: Response): Promise<AuthSession> {
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody
    throw new ServiceError(body.message ?? 'Request failed', response.status, body.code ?? 'REQUEST_FAILED')
  }
  return (await response.json()) as AuthSession
}

export const apiAuthService: AuthService = {
  async login(payload: LoginPayload) {
    const response = await fetch(`${apiEndpoints.baseUrl}${apiEndpoints.auth}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return parseSessionResponse(response)
  },

  async register(payload: RegisterPayload) {
    const response = await fetch(`${apiEndpoints.baseUrl}${apiEndpoints.auth}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return parseSessionResponse(response)
  },

  async logout() {
    await apiRequest<void>(`${apiEndpoints.auth}/logout`, { method: 'POST' })
  },

  async forgotPassword(payload: ForgotPasswordPayload) {
    await apiRequest<void>(`${apiEndpoints.auth}/forgot-password`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async resetPassword(payload: ResetPasswordPayload) {
    await apiRequest<void>(`${apiEndpoints.auth}/reset-password`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async getSession() {
    try {
      return await apiRequest<AuthSession>(`${apiEndpoints.auth}/me`)
    } catch {
      return null
    }
  },
}
