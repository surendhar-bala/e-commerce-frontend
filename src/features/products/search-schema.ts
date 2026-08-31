import { z } from 'zod'

export const productSearchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  sort: z.enum(['featured', 'newest', 'price-asc', 'price-desc']).optional(),
  page: z.number().optional(),
})

export type ProductSearch = z.infer<typeof productSearchSchema>
