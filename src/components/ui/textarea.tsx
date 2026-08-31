import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'flex min-h-28 w-full rounded-md border border-input bg-card px-3.5 py-3 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
