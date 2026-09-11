import { ArrowUpDown, Search, X } from 'lucide-react'
import { categories } from '@/data/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SORT_OPTIONS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { ProductSearch } from '@/features/products/search-schema'

type ProductFiltersProps = {
  search: ProductSearch
  onChange: (next: ProductSearch) => void
}

export function ProductFilters({ search, onChange }: ProductFiltersProps) {
  const activeCategory = search.category ?? 'all'
  const hasActiveFilters = Boolean(search.q || search.category || (search.sort && search.sort !== 'featured'))

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="listing-search"
            className="h-11 rounded-full border-border/70 bg-secondary/40 pl-10 shadow-none focus-visible:bg-background"
            value={search.q ?? ''}
            placeholder="Search products…"
            onChange={(event) => onChange({ ...search, q: event.target.value || undefined, page: 1 })}
          />
        </div>
        <Select
          value={search.sort ?? 'featured'}
          onValueChange={(value) =>
            onChange({ ...search, sort: value as ProductSearch['sort'], page: 1 })
          }
        >
          <SelectTrigger className="h-11 w-full rounded-full border-border/70 bg-secondary/40 shadow-none sm:w-[11.5rem]">
            <ArrowUpDown className="size-4 shrink-0 text-muted-foreground" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent align="end">
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onChange({ ...search, category: undefined, page: 1 })}
          className={cn(
            'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
            activeCategory === 'all'
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border/70 bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground',
          )}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange({ ...search, category: category.id, page: 1 })}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
              activeCategory === category.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border/70 bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )}
          >
            {category.name}
          </button>
        ))}
        {hasActiveFilters ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-auto gap-1.5 rounded-full text-muted-foreground"
            onClick={() => onChange({ page: 1 })}
          >
            <X className="size-3.5" />
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  )
}
