import { z } from 'zod'

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  image: z.string(),
  description: z.string(),
  category: z.string(),
  rating: z.object({
    rate: z.number(),
    count: z.number(),
  }),
})

export const productSearchSchema = z.object({
  page: z.number().catch(1),
  q: z.string().catch(''),
  category: z.string().catch(''),
})

export type ProductSeach = z.infer<typeof productSearchSchema>
export type Product = z.infer<typeof ProductSchema>
