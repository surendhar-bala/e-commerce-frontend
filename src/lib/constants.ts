export const BRAND = {
  name: 'Velora',
  tagline: 'Curated for a considered life.',
  supportEmail: 'hello@velora.studio',
} as const

export const SHIPPING_THRESHOLD = 150
export const STANDARD_SHIPPING = 12
export const TAX_RATE = 0.08

export const PAGE_SIZE = 12

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to high' },
  { value: 'price-desc', label: 'Price: High to low' },
] as const

export type SortOption = (typeof SORT_OPTIONS)[number]['value']
