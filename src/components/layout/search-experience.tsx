import { Link, useNavigate } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { recentSearchSeeds } from '@/data/content'
import { products } from '@/data/products'
import { cn } from '@/lib/utils'

type SearchExperienceProps = {
  compact?: boolean
  autoFocus?: boolean
  onNavigate?: () => void
  className?: string
}

export function SearchExperience({
  compact = false,
  autoFocus = false,
  onNavigate,
  className,
}: SearchExperienceProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const suggestions = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) {
      return []
    }
    return products
      .filter((product) => product.name.toLowerCase().includes(value))
      .slice(0, 5)
  }, [query])

  function submitSearch() {
    const value = query.trim()
    if (!value) {
      return
    }
    void navigate({ to: '/products', search: { q: value } })
    setOpen(false)
    onNavigate?.()
  }

  return (
    <div className={cn('relative w-full', className)}>
      <label className="sr-only" htmlFor={compact ? 'mobile-search' : 'desktop-search'}>
        Search products
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id={compact ? 'mobile-search' : 'desktop-search'}
        value={query}
        autoFocus={autoFocus}
        placeholder="Search linen, scent, leather…"
        className={cn('pr-10 pl-10', compact ? 'h-12' : 'h-11 bg-background/80')}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            submitSearch()
          }
          if (event.key === 'Escape') {
            setOpen(false)
          }
        }}
      />
      {query ? (
        <button
          type="button"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={() => setQuery('')}
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      ) : null}

      {open ? (
        <div className="absolute top-[calc(100%+0.5rem)] z-40 w-full overflow-hidden rounded-xl border bg-popover shadow-lift">
          {suggestions.length > 0 ? (
            <ul className="p-2">
              {suggestions.map((product) => (
                <li key={product.id}>
                  <Link
                    to="/products/$productId"
                    params={{ productId: product.id }}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-secondary"
                    onClick={() => {
                      setOpen(false)
                      onNavigate?.()
                    }}
                  >
                    <span>{product.name}</span>
                    <span className="text-caption">{product.categoryId.replace('cat-', '')}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4">
              <p className="text-caption mb-3">Recent searches</p>
              <div className="flex flex-wrap gap-2">
                {recentSearchSeeds.map((term) => (
                  <button
                    key={term}
                    type="button"
                    className="rounded-full border px-3 py-1 text-xs hover:border-primary hover:text-primary"
                    onClick={() => {
                      setQuery(term)
                      void navigate({ to: '/products', search: { q: term } })
                      setOpen(false)
                      onNavigate?.()
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
