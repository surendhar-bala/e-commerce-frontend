import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const alertVariants = cva('relative w-full rounded-xl border px-4 py-3 text-sm', {
  variants: {
    variant: {
      default: 'border-border bg-card text-foreground',
      destructive: 'border-destructive/30 bg-destructive/8 text-destructive',
      info: 'border-info/30 bg-info/8 text-info',
      warning: 'border-warning/30 bg-warning/12 text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

function Alert({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>) {
  return <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
}

function AlertTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn('mb-1 font-medium', className)} {...props} />
}

function AlertDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <div className={cn('text-sm leading-relaxed opacity-90', className)} {...props} />
}

export { Alert, AlertTitle, AlertDescription }
