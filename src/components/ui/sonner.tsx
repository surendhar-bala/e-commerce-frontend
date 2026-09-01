import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { useThemeStore } from '@/store/theme-store'

function Toaster(props: ToasterProps) {
  const theme = useThemeStore((state) => state.theme)

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-soft',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
