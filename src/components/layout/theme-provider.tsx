import { useEffect, type ReactNode } from 'react'
import { applyTheme, useThemeStore } from '@/store/theme-store'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return children
}
