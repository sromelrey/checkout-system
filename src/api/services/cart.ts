import type { Product } from '../schemas/product'
import { apiClient } from '../client'

/**
 * Simulates syncing a cart update to the server.
 * Uses the Fake Store API /carts endpoint.
 */
export const syncCartToServer = async (product: Product) => {
  const response = await apiClient.post('/carts', {
    userId: 1,
    date: new Date().toISOString(),
    products: [{ productId: product.id, quantity: 1 }],
  })

  return response.data
}

/**
 * Simulates updating item quantity on the server.
 */
export const updateCartItemQuantity = async (
  productId: number,
  quantity: number,
) => {
  const response = await apiClient.patch('/carts/1', {
    products: [{ productId, quantity }],
  })
  return response.data
}

/**
 * Simulates removing an item on the server.
 */
export const removeFromCartServer = async (productId: number) => {
  const response = await apiClient.delete('/carts/1')
  return response.data
}

/**
 * Simulates clearing the entire cart on the server.
 */
export const clearCartServer = async () => {
  const response = await apiClient.delete('/carts/1')
  return response.data
}
