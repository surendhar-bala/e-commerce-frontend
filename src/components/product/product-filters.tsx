import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { SORT_OPTIONS } from '@/lib/constants'
import { formatCurrency } from '@/lib/format'
import type { ProductSearch } from '@/features/products/search-schema'
import type { ProductCategory } from '@/types/product'

type ProductFiltersProps = {
  categories: ProductCategory[]
  search: ProductSearch
  onChange: (next: ProductSearch) => void
}

export function ProductFilters({ categories, search, onChange }: ProductFiltersProps) {
  const priceRange: [number, number] = [search.minPrice ?? 0, search.maxPrice ?? 520]

  return (
    <div className="grid gap-4 rounded-2xl bg-card p-4 shadow-soft md:grid-cols-2 lg:grid-cols-4">
      <div className="relative">
        <Label htmlFor="listing-search">Search</Label>
        <Search className="pointer-events-none absolute top-10 left-3 size-4 text-muted-foreground" />
        <Input
          id="listing-search"
          className="mt-2 pl-10"
          value={search.q ?? ''}
          placeholder="Search the collection"
          onChange={(event) => onChange({ ...search, q: event.target.value || undefined, page: 1 })}
        />
      </div>
      <div>
        <Label>Category</Label>
        <Select
          value={search.category ?? 'all'}
          onValueChange={(value) =>
            onChange({ ...search, category: value === 'all' ? undefined : value, page: 1 })
          }
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Sort</Label>
        <Select
          value={search.sort ?? 'featured'}
          onValueChange={(value) =>
            onChange({ ...search, sort: value as ProductSearch['sort'], page: 1 })
          }
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <Label>Price</Label>
          <span className="text-xs text-muted-foreground">
            {formatCurrency(priceRange[0])} – {formatCurrency(priceRange[1])}
          </span>
        </div>
        <Slider
          className="mt-5"
          min={0}
          max={520}
          step={10}
          value={priceRange}
          onValueChange={([minPrice, maxPrice]) =>
            onChange({
              ...search,
              minPrice: minPrice === 0 ? undefined : minPrice,
              maxPrice: maxPrice === 520 ? undefined : maxPrice,
              page: 1,
            })
          }
        />
      </div>
    </div>
  )
}
