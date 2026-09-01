export const BRAND = {
  name: 'Velora',
  tagline: 'Paints, toys, and daily essentials for Indian homes.',
  supportEmail: 'hello@velora.in',
} as const

export const SHIPPING_THRESHOLD = 499
export const STANDARD_SHIPPING = 49
export const TAX_RATE = 0.18
export const PRICE_FILTER_MAX = 2500

export const PAGE_SIZE = 12

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to high' },
  { value: 'price-desc', label: 'Price: High to low' },
] as const

export type SortOption = (typeof SORT_OPTIONS)[number]['value']
