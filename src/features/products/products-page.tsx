import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { LoadingState } from '@/components/common/loading-state'
import { ProductFilters } from '@/components/product/product-filters'
import { ProductGrid } from '@/components/product/product-grid'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { PAGE_SIZE } from '@/lib/constants'
import { productService } from '@/services'
import type { ProductSearch } from '@/features/products/search-schema'
import type { PaginatedProducts, ProductCategory } from '@/types/product'

type ProductsPageProps = {
  search: ProductSearch
}

export function ProductsPage({ search }: ProductsPageProps) {
  useDocumentTitle('Products')
  const navigate = useNavigate()
  const [data, setData] = useState<PaginatedProducts | null>(null)
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [loadedKey, setLoadedKey] = useState<string | null>(null)
  const [failedKey, setFailedKey] = useState<string | null>(null)
  const requestKey = JSON.stringify(search)
  const status =
    failedKey === requestKey ? 'error' : loadedKey === requestKey ? 'ready' : 'loading'

  useEffect(() => {
    let active = true
    Promise.all([
      productService.list({
        query: search.q,
        category: search.category,
        minPrice: search.minPrice,
        maxPrice: search.maxPrice,
        sort: search.sort,
        page: search.page ?? 1,
        pageSize: PAGE_SIZE,
      }),
      productService.listCategories(),
    ])
      .then(([result, nextCategories]) => {
        if (!active) return
        setData(result)
        setCategories(nextCategories)
        setLoadedKey(requestKey)
        setFailedKey(null)
      })
      .catch(() => {
        if (active) setFailedKey(requestKey)
      })
    return () => {
      active = false
    }
  }, [search, requestKey])

  const page = search.page ?? 1
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1

  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-page mt-5">All products</h1>
      <p className="mt-2 max-w-xl text-small">
        Painting materials, kids’ toys, and everyday products — priced in ₹. Clothing is not listed yet.
      </p>
      <div className="mt-8">
        <ProductFilters
          categories={categories}
          search={search}
          onChange={(next) => {
            void navigate({ to: '/products', search: next })
          }}
        />
      </div>
      <div className="mt-10">
        {status === 'loading' ? <LoadingState /> : null}
        {status === 'error' ? (
          <ErrorState onRetry={() => void navigate({ to: '/products', search })} />
        ) : null}
        {status === 'ready' && data?.items.length === 0 ? (
          <EmptyState
            title="Nothing matches"
            description="Try another category, a wider price range, or a simpler search."
          />
        ) : null}
        {status === 'ready' && data && data.items.length > 0 ? (
          <>
            <p className="mb-6 text-sm text-muted-foreground">{data.total} pieces</p>
            <ProductGrid products={data.items} categories={categories} />
            <div className="mt-10 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => void navigate({ to: '/products', search: { ...search, page: page - 1 } })}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => void navigate({ to: '/products', search: { ...search, page: page + 1 } })}
              >
                Next
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
