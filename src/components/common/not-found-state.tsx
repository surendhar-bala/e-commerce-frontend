import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function NotFoundState() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-caption">404</p>
      <h1 className="text-page mt-3">This page has gone quiet</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        The page you are looking for is no longer here. Continue browsing the collection instead.
      </p>
      <Button asChild className="mt-8">
        <Link to="/products">Browse products</Link>
      </Button>
    </div>
  )
}
