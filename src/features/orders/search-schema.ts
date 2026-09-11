import { z } from 'zod'

export const ordersSearchSchema = z.object({
  page: z.number().optional(),
})

export type OrdersSearch = z.infer<typeof ordersSearchSchema>
