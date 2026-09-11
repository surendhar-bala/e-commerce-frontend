import { categories } from '@/data/categories'
import { products as seedProducts } from '@/data/products'
import { PAGE_SIZE } from '@/lib/constants'
import { localStoreKeys, readLocalJson, writeLocalJson } from '@/lib/local-store'
import { ServiceError } from '@/services/http'
import type { ProductDraft, ProductService } from '@/services/product-service'
import { ProductStatus, type PaginatedProducts, type Product, type ProductMedia } from '@/types/product'

function loadExtras(): Product[] {
  return readLocalJson<Product[]>(localStoreKeys.catalogExtras, [])
}

function saveExtras(extras: Product[]) {
  writeLocalJson(localStoreKeys.catalogExtras, extras)
}

function catalog(): Product[] {
  const extras = loadExtras()
  const extraIds = new Set(extras.map((product) => product.id))
  return [...extras, ...seedProducts.filter((product) => !extraIds.has(product.id))]
}

function persistProduct(product: Product) {
  const extras = loadExtras().filter((item) => item.id !== product.id)
  extras.unshift(product)
  saveExtras(extras)
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function mediaFromDraft(draft: ProductDraft, fallbackName: string, existing?: ProductMedia[]): ProductMedia[] {
  if (draft.mediaItems?.length) {
    return draft.mediaItems.map((item, index) => ({
      id: existing?.[index]?.id ?? crypto.randomUUID(),
      url: item.url,
      alt: fallbackName,
      type: item.type,
      publicId: item.r2Key,
    }))
  }

  const urls = (draft.imageUrls ?? []).filter(Boolean)
  if (draft.imageUrl) {
    urls.unshift(draft.imageUrl)
  }
  const unique = [...new Set(urls)].slice(0, 5)
  const images: ProductMedia[] =
    unique.length === 0
      ? existing?.filter((item) => item.type !== 'video')?.length
        ? existing.filter((item) => item.type !== 'video')
        : [
            {
              id: crypto.randomUUID(),
              url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
              alt: fallbackName,
              type: 'image',
            },
          ]
      : unique.map((url, index) => ({
          id: existing?.[index]?.id ?? crypto.randomUUID(),
          url,
          alt: fallbackName,
          type: 'image' as const,
        }))

  if (draft.videoUrl) {
    images.push({
      id: crypto.randomUUID(),
      url: draft.videoUrl,
      alt: `${fallbackName} video`,
      type: 'video',
    })
  }

  return images
}

function applyFilters(items: Product[], filters: Parameters<ProductService['list']>[0] = {}): Product[] {
  let next = items

  if (filters.sellerId) {
    next = next.filter((product) => product.sellerId === filters.sellerId)
  } else if (filters.sellerOnly) {
    next = next.filter((product) => Boolean(product.sellerId))
  }

  if (!filters.includeInactive) {
    next = next.filter((product) => product.status === ProductStatus.Active)
  }

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
    case 'discount':
      next = [...next].sort((a, b) => {
        const discountA =
          a.compareAtPrice && a.compareAtPrice > a.price
            ? (a.compareAtPrice - a.price) / a.compareAtPrice
            : 0
        const discountB =
          b.compareAtPrice && b.compareAtPrice > b.price
            ? (b.compareAtPrice - b.price) / b.compareAtPrice
            : 0
        return discountB - discountA
      })
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
    const filtered = applyFilters(catalog(), filters)
    const start = (page - 1) * pageSize

    return {
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    }
  },

  async getById(id) {
    return catalog().find((product) => product.id === id) ?? null
  },

  async getBySlug(slug) {
    return catalog().find((product) => product.slug === slug) ?? null
  },

  async listCategories() {
    return categories
  },

  async getRelated(productId) {
    const current = catalog().find((product) => product.id === productId)
    if (!current) {
      return []
    }
    return catalog()
      .filter((product) => product.id !== productId && product.categoryId === current.categoryId)
      .slice(0, 4)
  },

  async create(draft: ProductDraft) {
    const product: Product = {
      id: `prod-${crypto.randomUUID()}`,
      slug: slugify(draft.name) || `product-${Date.now()}`,
      name: draft.name,
      description: draft.description,
      categoryId: draft.categoryId,
      price: draft.price,
      compareAtPrice: draft.compareAtPrice,
      stock: draft.stock,
      status: draft.status ?? ProductStatus.Active,
      rating: 0,
      reviewCount: 0,
      featured: false,
      trending: false,
      createdAt: new Date().toISOString(),
      sellerId: draft.sellerId,
      media: mediaFromDraft(draft, draft.name),
      specifications: [],
    }
    persistProduct(product)
    return product
  },

  async update(id, draft) {
    const existing = catalog().find((product) => product.id === id)
    if (!existing) {
      throw new ServiceError('Product not found', 404, 'NOT_FOUND')
    }

    const updated: Product = {
      ...existing,
      name: draft.name,
      slug: slugify(draft.name) || existing.slug,
      description: draft.description,
      categoryId: draft.categoryId,
      price: draft.price,
      compareAtPrice: draft.compareAtPrice,
      stock: draft.stock,
      status: draft.status ?? existing.status,
      sellerId: draft.sellerId ?? existing.sellerId,
      media: mediaFromDraft(draft, draft.name, existing.media),
    }
    persistProduct(updated)
    return updated
  },

  async remove(id) {
    const extras = loadExtras().filter((product) => product.id !== id)
    saveExtras(extras)
  },
}
