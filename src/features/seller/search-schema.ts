import { z } from 'zod'

export const sellerListSearchSchema = z.object({
  page: z.number().optional(),
})

export type SellerListSearch = z.infer<typeof sellerListSearchSchema>
