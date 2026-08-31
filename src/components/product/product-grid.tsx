import { ProductCard } from '@/components/product/product-card'
import type { Product, ProductCategory } from '@/types/product'

type ProductGridProps = {
  products: Product[]
  categories: ProductCategory[]
}

export function ProductGrid({ products, categories }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          category={categories.find((category) => category.id === product.categoryId)}
        />
      ))}
    </div>
  )
}
