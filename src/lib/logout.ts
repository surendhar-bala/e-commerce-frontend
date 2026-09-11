import { authService } from '@/services'
import { setAccessToken } from '@/services/http'
import { useAuthStore } from '@/store/auth-store'

const AUTH_STORAGE_KEY = 'velora-auth'

export function logout() {
  setAccessToken(null)
  useAuthStore.getState().clearSession()
  localStorage.removeItem(AUTH_STORAGE_KEY)
  void authService.logout().catch(() => undefined)
}
