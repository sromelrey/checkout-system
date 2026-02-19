import { z } from 'zod'
import { apiClient } from '../client'
import { ProductSchema } from '../schemas/product'
import type { Product } from '../schemas/product'

export const getProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get('/products')
  return z.array(ProductSchema).parse(response.data)
}

export const getProduct = async (id: number): Promise<Product> => {
  const response = await apiClient.get(`/products/${id}`)
  return ProductSchema.parse(response.data)
}
