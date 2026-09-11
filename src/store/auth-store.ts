import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { setAccessToken } from '@/services/http'
import type { User } from '@/types/user'
import type { UserRole } from '@/types/user'

type AuthState = {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  role: UserRole | null
  isLoading: boolean
  setSession: (user: User, accessToken?: string) => void
  clearSession: () => void
  setLoading: (isLoading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      role: null,
      isLoading: false,
      setSession: (user, accessToken) => {
        if (accessToken) {
          setAccessToken(accessToken)
        }
        set({
          user,
          accessToken: accessToken ?? null,
          isAuthenticated: true,
          role: user.role,
          isLoading: false,
        })
      },
      clearSession: () => {
        setAccessToken(null)
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          role: null,
          isLoading: false,
        })
      },
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'velora-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          setAccessToken(state.accessToken)
        }
      },
    },
  ),
)
