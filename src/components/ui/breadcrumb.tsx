import { Slot } from '@radix-ui/react-slot'
import { ChevronRight } from 'lucide-react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

function Breadcrumb({ ...props }: ComponentPropsWithoutRef<'nav'>) {
  return <nav aria-label="Breadcrumb" {...props} />
}

function BreadcrumbList({ className, ...props }: ComponentPropsWithoutRef<'ol'>) {
  return (
    <ol
      className={cn('flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: ComponentPropsWithoutRef<'li'>) {
  return <li className={cn('inline-flex items-center gap-1.5', className)} {...props} />
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: ComponentPropsWithoutRef<'a'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'a'
  return <Comp className={cn('transition-colors hover:text-foreground', className)} {...props} />
}

function BreadcrumbPage({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return <span aria-current="page" className={cn('text-foreground', className)} {...props} />
}

function BreadcrumbSeparator({ children, className, ...props }: ComponentPropsWithoutRef<'li'> & { children?: ReactNode }) {
  return (
    <li role="presentation" aria-hidden="true" className={cn('[&>svg]:size-3.5', className)} {...props}>
      {children ?? <ChevronRight />}
    </li>
  )
}

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator }
