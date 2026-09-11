import { createFileRoute } from '@tanstack/react-router'
import { ProductsPage } from '@/features/products/products-page'
import { productSearchSchema } from '@/features/products/search-schema'
import { redirectSellerFromStorefront } from '@/lib/storefront-guards'

export const Route = createFileRoute('/products/')({
  validateSearch: productSearchSchema,
  beforeLoad: () => {
    redirectSellerFromStorefront()
  },
  component: ProductsPage,
})
