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
          toast: 'group toast group-[.toaster]:border group-[.toaster]:shadow-soft',
          success:
            'group-[.toaster]:bg-success group-[.toaster]:text-success-foreground group-[.toaster]:border-success/20',
          error:
            'group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground group-[.toaster]:border-destructive/20',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
