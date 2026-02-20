import { z } from 'zod'

export const CheckoutRequestSchema = z.object({
  customer: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    address: z.string().min(1, 'Address is required'),
  }),
  items: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number(),
      price: z.number(),
    }),
  ),
  totals: z.object({
    subtotal: z.number(),
    discount: z.number(),
    total: z.number(),
  }),
})

export const CheckoutResponseSchema = z.object({
  id: z.number(),
  status: z.string(),
  createdAt: z.string(),
})

export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>
export type CheckoutResponse = z.infer<typeof CheckoutResponseSchema>
