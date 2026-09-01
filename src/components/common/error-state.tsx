import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ErrorStateProps = {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this page. Please try again in a moment.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center px-4 py-16 text-center">
      <AlertCircle className="mb-4 size-8 text-destructive" aria-hidden="true" />
      <h2 className="font-display text-2xl font-medium tracking-tight">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      {onRetry ? (
        <Button className="mt-6" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  )
}
