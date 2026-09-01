import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type LoadingStateProps = {
  className?: string
  label?: string
}

export function LoadingState({ className, label = 'Loading' }: LoadingStateProps) {
  return (
    <div className={cn('space-y-4', className)} role="status" aria-live="polite" aria-label={label}>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full max-w-xl" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  )
}
