import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const API_URL = process.env.VITE_API_URL || 'https://fakestoreapi.com'

export const syncCartToServer = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      productId: z.number(),
      quantity: z.number(),
    }),
  )
  .handler(async ({ data }) => {
    const res = await fetch(`${API_URL}/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 1,
        date: new Date().toISOString(),
        products: [{ productId: data.productId, quantity: data.quantity }],
      }),
    })
    return res.json()
  })

export const updateCartItemQuantity = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ productId: z.number(), quantity: z.number() }))
  .handler(async ({ data }) => {
    const res = await fetch(`${API_URL}/carts/1`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        products: [{ productId: data.productId, quantity: data.quantity }],
      }),
    })
    return res.json()
  })

export const removeFromCartServer = createServerFn({ method: 'POST' })
  .inputValidator(z.number())
  .handler(async ({ data: id }) => {
    const res = await fetch(`${API_URL}/carts/${id}`, { method: 'DELETE' })
    return res.json()
  })

export const clearCartServer = createServerFn({ method: 'POST' }).handler(
  async () => {
    const res = await fetch(`${API_URL}/carts/1`, { method: 'DELETE' })
    return res.json()
  },
)
