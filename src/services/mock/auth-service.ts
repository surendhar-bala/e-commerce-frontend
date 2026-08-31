import { BackendUnavailableError } from '@/services/http'
import type { AuthService } from '@/services/auth-service'

export const mockAuthService: AuthService = {
  async login() {
    throw new BackendUnavailableError('Authentication')
  },
  async register() {
    throw new BackendUnavailableError('Registration')
  },
  async logout() {
    return
  },
  async forgotPassword() {
    throw new BackendUnavailableError('Password recovery')
  },
  async resetPassword() {
    throw new BackendUnavailableError('Password reset')
  },
  async getSession() {
    return null
  },
}
