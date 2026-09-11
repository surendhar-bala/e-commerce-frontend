import { categories } from '@/data/categories'
import { ServiceError } from '@/services/http'
import { apiEndpoints } from '@/lib/api-endpoints'
import { apiRequest } from '@/services/http'
import type { ProductDraft, ProductService } from '@/services/product-service'
import type { PaginatedProducts, Product, ProductCategory, ProductFilters } from '@/types/product'

function toQuery(filters: ProductFilters = {}) {
  const params = new URLSearchParams()
  if (filters.query) params.set('query', filters.query)
  if (filters.category) params.set('category', filters.category)
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice))
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice))
  if (filters.sort) params.set('sort', filters.sort)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.pageSize) params.set('pageSize', String(filters.pageSize))
  if (filters.sellerId) params.set('sellerId', filters.sellerId)
  if (filters.sellerOnly) params.set('sellerOnly', 'true')
  if (filters.includeInactive) params.set('includeInactive', 'true')
  const query = params.toString()
  return query ? `?${query}` : ''
}

export const apiProductService: ProductService = {
  async list(filters) {
    return apiRequest<PaginatedProducts>(`${apiEndpoints.products}${toQuery(filters)}`)
  },

  async getById(id) {
    try {
      return await apiRequest<Product>(`${apiEndpoints.products}/${id}`)
    } catch (error) {
      if (error instanceof ServiceError && error.status === 404) {
        return null
      }
      throw error
    }
  },

  async getBySlug(slug) {
    try {
      return await apiRequest<Product>(`${apiEndpoints.products}/slug/${slug}`)
    } catch (error) {
      if (error instanceof ServiceError && error.status === 404) {
        return null
      }
      throw error
    }
  },

  async listCategories() {
    return categories satisfies ProductCategory[]
  },

  async getRelated(productId) {
    return apiRequest<Product[]>(`${apiEndpoints.products}/${productId}/related`)
  },

  async create(draft: ProductDraft) {
    return apiRequest<Product>(apiEndpoints.products, {
      method: 'POST',
      body: JSON.stringify(draft),
    })
  },

  async update(id, draft) {
    return apiRequest<Product>(`${apiEndpoints.products}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(draft),
    })
  },

  async remove(id) {
    await apiRequest<void>(`${apiEndpoints.products}/${id}`, { method: 'DELETE' })
  },
}
