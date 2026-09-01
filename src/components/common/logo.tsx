import { Link } from '@tanstack/react-router'
import { BRAND } from '@/lib/constants'
import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
  inverted?: boolean
}

export function Logo({ className, inverted = false }: LogoProps) {
  return (
    <Link
      to="/"
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
