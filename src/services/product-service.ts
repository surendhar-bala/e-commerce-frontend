import type { PaginatedProducts, Product, ProductCategory, ProductFilters } from '@/types/product'

export type ProductDraft = {
  name: string
  description: string
  categoryId: string
  price: number
  compareAtPrice?: number
  stock: number
  imageUrl?: string
}

export type ProductService = {
  list: (filters?: ProductFilters) => Promise<PaginatedProducts>
  getById: (id: string) => Promise<Product | null>
  getBySlug: (slug: string) => Promise<Product | null>
  listCategories: () => Promise<ProductCategory[]>
  getRelated: (productId: string) => Promise<Product[]>
  create: (draft: ProductDraft) => Promise<Product>
  update: (id: string, draft: ProductDraft) => Promise<Product>
}
