import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center px-4 py-16 text-center', className)}>
      {icon ? <div className="mb-5 text-muted-foreground">{icon}</div> : null}
      <h2 className="font-display text-2xl font-medium tracking-tight">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
