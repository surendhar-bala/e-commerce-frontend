import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { LoadingState } from '@/components/common/loading-state'
import { Pagination } from '@/components/common/pagination'
import { ProductFilters } from '@/components/product/product-filters'
import { ProductGrid } from '@/components/product/product-grid'
import { Button } from '@/components/ui/button'
import { getCategoryName } from '@/data/categories'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { PAGE_SIZE } from '@/lib/constants'
import { productService } from '@/services'
import type { PaginatedProducts } from '@/types/product'

export function ProductsPage() {
  useDocumentTitle('Products')
  const navigate = useNavigate({ from: '/products/' })
  const search = useSearch({ from: '/products/' })
  const [data, setData] = useState<PaginatedProducts | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [debouncedQuery, setDebouncedQuery] = useState(search.q ?? '')

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(search.q ?? ''), 300)
    return () => window.clearTimeout(timer)
  }, [search.q])

  useEffect(() => {
    let active = true
    setStatus('loading')

    productService
      .list({
        page: search.page ?? 1,
        pageSize: PAGE_SIZE,
        sort: search.sort ?? 'featured',
        category: search.category,
        query: debouncedQuery || undefined,
      })
      .then((result) => {
        if (!active) return
        setData(result)
        setStatus('ready')
      })
      .catch(() => {
        if (active) setStatus('error')
      })

    return () => {
      active = false
    }
  }, [search.page, search.sort, search.category, debouncedQuery])

  function updateSearch(next: typeof search) {
    void navigate({ search: next })
  }

  function reload() {
    updateSearch({ ...search })
  }

  const categoryLabel = search.category ? getCategoryName(search.category) : null
  const currentPage = search.page ?? 1

  function goToPage(page: number) {
    updateSearch({ ...search, page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container-page py-8 md:py-12">
      <div className="max-w-2xl">
        <h1 className="text-page">
          {categoryLabel ? categoryLabel : 'All products'}
        </h1>
        <p className="mt-2 text-small">
          {categoryLabel
            ? `Browse ${categoryLabel.toLowerCase()} — filter, search, and sort to find what you need.`
            : 'Browse our collection — filter by category, search, or sort by price and discount.'}
        </p>
      </div>

      <div className="mt-8">
        <ProductFilters search={search} onChange={updateSearch} />
      </div>

      <div className="mt-8">
        {status === 'loading' ? <LoadingState /> : null}
        {status === 'error' ? <ErrorState onRetry={reload} /> : null}
        {status === 'ready' && data?.items.length === 0 ? (
          <EmptyState
            title={search.q || search.category ? 'No products found' : 'No products yet'}
            description={
              search.q || search.category
                ? 'Try a different search term or category, or clear your filters.'
                : 'Check back soon — new products are added regularly.'
            }
            action={
              search.q || search.category ? (
                <Button type="button" variant="outline" onClick={() => updateSearch({ page: 1 })}>
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        ) : null}
        {status === 'ready' && data && data.items.length > 0 ? (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              Showing {(currentPage - 1) * data.pageSize + 1}–
              {(currentPage - 1) * data.pageSize + data.items.length} of {data.total}{' '}
              {data.total === 1 ? 'product' : 'products'}
            </p>
            <ProductGrid products={data.items} />
            {data.total > PAGE_SIZE ? (
              <Pagination
                className="mt-10"
                page={currentPage}
                pageSize={data.pageSize}
                total={data.total}
                onPageChange={goToPage}
              />
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  )
}
