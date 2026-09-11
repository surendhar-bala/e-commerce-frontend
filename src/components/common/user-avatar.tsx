import { UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'

type UserAvatarProps = {
  name?: string | null
  className?: string
  size?: 'sm' | 'md'
}

export function UserAvatar({ name, className, size = 'md' }: UserAvatarProps) {
  const initial = name?.trim().charAt(0).toUpperCase()

  if (!initial) {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-full bg-secondary text-muted-foreground',
          size === 'sm' ? 'size-8' : 'size-9',
          className,
        )}
      >
        <UserRound className={size === 'sm' ? 'size-4' : 'size-5'} />
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground',
        size === 'sm' ? 'size-8 text-xs' : 'size-9 text-sm',
        className,
      )}
      aria-hidden
    >
      {initial}
    </span>
  )
}
