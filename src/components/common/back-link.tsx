import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

type BackLinkProps = {
  to: string
  label: string
  params?: Record<string, string>
  className?: string
}

export function BackLink({ to, label, params, className }: BackLinkProps) {
  return (
    <Link
      to={to}
      params={params}
      className={cn(
        'inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground',
        className,
      )}
    >
      <ArrowLeft className="size-4" />
      {label}
    </Link>
  )
}
