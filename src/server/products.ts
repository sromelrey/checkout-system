import { ProductSchema } from '@/api/schemas/product'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const API_URL = process.env.VITE_API_URL || 'https://fakestoreapi.com'

export const getProducts = createServerFn({ method: 'GET' }).handler(
  async () => {
    const res = await fetch(`${API_URL}/products`)
    const data = await res.json()
    return z.array(ProductSchema).parse(data)
  },
)

export const getProduct = createServerFn({ method: 'GET' }).handler(
  async ({ data: id }) => {
    const res = await fetch(`${API_URL}/products/${id}`)
    const data = await res.json()
    return ProductSchema.parse(data)
  },
)

export const getCategories = createServerFn({ method: 'GET' }).handler(
  async () => {
    const res = await fetch(`${API_URL}/products/categories`)
    const data = await res.json()
    return z.array(z.string()).parse(data)
  },
)
