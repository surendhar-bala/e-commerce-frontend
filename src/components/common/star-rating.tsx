import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

type StarRatingProps = {
  rating: number
  count?: number
  className?: string
}

export function StarRating({ rating, count, className }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              'size-3.5',
              index < Math.round(rating) ? 'fill-accent text-accent' : 'text-border',
            )}
            aria-hidden="true"
          />
        ))}
      </div>
      {count !== undefined ? (
        <span className="text-xs text-muted-foreground">
          {rating.toFixed(1)} ({count})
        </span>
      ) : null}
    </div>
  )
}
