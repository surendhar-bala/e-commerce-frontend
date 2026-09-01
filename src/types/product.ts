export const ProductStatus = {
  Active: 'active',
  Draft: 'draft',
  Archived: 'archived',
} as const

export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus]

export type ProductMedia = {
  id: string
  url: string
  alt: string
  publicId?: string
  width?: number
  height?: number
}

export type ProductCategory = {
  id: string
  slug: string
  name: string
  description: string
  image: ProductMedia
}

export type Product = {
  id: string
  slug: string
  name: string
  description: string
  categoryId: string
  price: number
  compareAtPrice?: number
  stock: number
  status: ProductStatus
  rating: number
  reviewCount: number
  featured: boolean
  trending: boolean
  createdAt: string
  sellerId?: string
  media: ProductMedia[]
  specifications: Array<{ label: string; value: string }>
}

export type ProductFilters = {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: 'featured' | 'newest' | 'price-asc' | 'price-desc'
  page?: number
  pageSize?: number
  sellerId?: string
  sellerOnly?: boolean
  includeInactive?: boolean
}

export type PaginatedProducts = {
  items: Product[]
  total: number
  page: number
  pageSize: number
}
