import { CheckoutRequestSchema } from '@/api/schemas/checkout'
import type { CheckoutResponse } from '@/api/schemas/checkout'
import { createServerFn } from '@tanstack/react-start'

const API_URL = process.env.VITE_API_URL || 'https://fakestoreapi.com'

export const submitCheckout = createServerFn({ method: 'POST' })
  .inputValidator(CheckoutRequestSchema)
  .handler(async ({ data }): Promise<CheckoutResponse> => {
    const res = await fetch(`${API_URL}/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 1,
        date: new Date().toISOString(),
        products: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }),
    })
    const result = await res.json()
    return {
      id: result.id,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }
  })
