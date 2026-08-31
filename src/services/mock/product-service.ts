import { categories } from '@/data/categories'
import { products as seedProducts } from '@/data/products'
import { PAGE_SIZE } from '@/lib/constants'
import { ServiceError } from '@/services/http'
import type { ProductDraft, ProductService } from '@/services/product-service'
import { ProductStatus, type PaginatedProducts, type Product } from '@/types/product'

const catalog: Product[] = [...seedProducts]

function applyFilters(items: Product[], filters: Parameters<ProductService['list']>[0] = {}): Product[] {
  let next = items.filter((product) => product.status === ProductStatus.Active)

  if (filters.query) {
    const query = filters.query.toLowerCase()
    next = next.filter(
      (product) =>
        product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
    )
  }

  if (filters.category) {
    next = next.filter((product) => product.categoryId === filters.category)
  }

  if (filters.minPrice !== undefined) {
    next = next.filter((product) => product.price >= filters.minPrice!)
  }

  if (filters.maxPrice !== undefined) {
    next = next.filter((product) => product.price <= filters.maxPrice!)
  }

  switch (filters.sort) {
    case 'price-asc':
      next = [...next].sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      next = [...next].sort((a, b) => b.price - a.price)
      break
    case 'newest':
      next = [...next].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      break
    default:
      next = [...next].sort((a, b) => Number(b.featured) - Number(a.featured))
  }

  return next
}

export const mockProductService: ProductService = {
  async list(filters = {}): Promise<PaginatedProducts> {
    const page = filters.page ?? 1
    const pageSize = filters.pageSize ?? PAGE_SIZE
    const filtered = applyFilters(catalog, filters)
    const start = (page - 1) * pageSize

    return {
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    }
  },

  async getById(id) {
    return catalog.find((product) => product.id === id) ?? null
  },

  async getBySlug(slug) {
    return catalog.find((product) => product.slug === slug) ?? null
  },

  async listCategories() {
    return categories
  },

  async getRelated(productId) {
    const current = catalog.find((product) => product.id === productId)
    if (!current) {
      return []
    }
    return catalog
      .filter((product) => product.id !== productId && product.categoryId === current.categoryId)
      .slice(0, 4)
  },

  async create(draft: ProductDraft) {
    const product: Product = {
      id: `prod-${crypto.randomUUID()}`,
      slug: draft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      name: draft.name,
      description: draft.description,
      categoryId: draft.categoryId,
      price: draft.price,
      compareAtPrice: draft.compareAtPrice,
      stock: draft.stock,
      status: ProductStatus.Active,
      rating: 0,
      reviewCount: 0,
      featured: false,
      trending: false,
      createdAt: new Date().toISOString(),
      media: [
        {
          id: crypto.randomUUID(),
          url:
            draft.imageUrl ||
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
          alt: draft.name,
        },
      ],
      specifications: [],
    }
    catalog.unshift(product)
    return product
  },

  async update(id, draft) {
    const index = catalog.findIndex((product) => product.id === id)
    const existing = catalog[index]
    if (index === -1 || !existing) {
      throw new ServiceError('Product not found', 404, 'NOT_FOUND')
    }

    const updated: Product = {
      ...existing,
      name: draft.name,
      description: draft.description,
      categoryId: draft.categoryId,
      price: draft.price,
      compareAtPrice: draft.compareAtPrice,
      stock: draft.stock,
      media: draft.imageUrl
        ? [{ id: existing.media[0]?.id ?? crypto.randomUUID(), url: draft.imageUrl, alt: draft.name }]
        : existing.media,
    }
    catalog[index] = updated
    return updated
  },
}
