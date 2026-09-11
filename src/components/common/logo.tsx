import { Link } from '@tanstack/react-router'
import { BRAND } from '@/lib/constants'
import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
  inverted?: boolean
  to?: '/products' | '/seller' | '/'
}

export function Logo({ className, inverted = false, to = '/products' }: LogoProps) {
  return (
    <Link
      to={to}
      className={cn(
        'font-display text-[1.45rem] leading-none tracking-tight',
        inverted ? 'text-background' : 'text-foreground',
        className,
      )}
      aria-label={`${BRAND.name} home`}
    >
      {BRAND.name}
    </Link>
  )
}
