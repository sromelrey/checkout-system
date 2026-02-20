import { z } from 'zod'

export const CheckoutFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
})

export type CheckoutFormData = z.infer<typeof CheckoutFormSchema>
