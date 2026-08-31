import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

type ThemeState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light'
        applyTheme(next)
        set({ theme: next })
      },
    }),
    {
      name: 'velora-theme',
      onRehydrateStorage: () => (state) => {
        applyTheme(state?.theme ?? 'light')
      },
    },
  ),
)
