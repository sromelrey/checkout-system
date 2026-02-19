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

export type Product = z.infer<typeof ProductSchema>
