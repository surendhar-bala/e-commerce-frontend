import type { PaginatedProducts, Product, ProductCategory, ProductFilters, ProductStatus } from '@/types/product'

export type ProductDraft = {
  name: string
  description: string
  categoryId: string
  price: number
  compareAtPrice?: number
  stock: number
  imageUrl?: string
  imageUrls?: string[]
  sellerId?: string
  status?: ProductStatus
}

export type ProductService = {
  list: (filters?: ProductFilters) => Promise<PaginatedProducts>
  getById: (id: string) => Promise<Product | null>
  getBySlug: (slug: string) => Promise<Product | null>
  listCategories: () => Promise<ProductCategory[]>
  getRelated: (productId: string) => Promise<Product[]>
  create: (draft: ProductDraft) => Promise<Product>
  update: (id: string, draft: ProductDraft) => Promise<Product>
  remove: (id: string) => Promise<void>
}
