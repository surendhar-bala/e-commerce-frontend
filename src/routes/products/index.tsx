import { createFileRoute } from '@tanstack/react-router'
import { ProductsPage } from '@/features/products/products-page'
import { productSearchSchema } from '@/features/products/search-schema'

export const Route = createFileRoute('/products/')({
  validateSearch: productSearchSchema,
  component: ProductsRoute,
})

function ProductsRoute() {
  const search = Route.useSearch()
  return <ProductsPage search={search} />
}
