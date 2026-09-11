import categoriesJson from '@/data/categories.json'
import type { ProductCategory } from '@/types/product'

export const categories = categoriesJson as ProductCategory[]

export function getCategoryById(id: string): ProductCategory | undefined {
  return categories.find((category) => category.id === id)
}

export function getCategoryName(id: string): string {
  return getCategoryById(id)?.name ?? id
}
