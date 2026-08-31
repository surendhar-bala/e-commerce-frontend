import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/user'
import type { UserRole } from '@/types/user'

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  role: UserRole | null
  isLoading: boolean
  setSession: (user: User) => void
  clearSession: () => void
  setLoading: (isLoading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      role: null,
      isLoading: false,
      setSession: (user) =>
        set({
          user,
          isAuthenticated: true,
          role: user.role,
          isLoading: false,
        }),
      clearSession: () =>
        set({
          user: null,
          isAuthenticated: false,
          role: null,
          isLoading: false,
        }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'velora-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
      }),
    },
  ),
)
