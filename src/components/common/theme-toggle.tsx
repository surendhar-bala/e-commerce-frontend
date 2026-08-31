import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/store/theme-store'

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
