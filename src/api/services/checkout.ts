import type { CheckoutRequest, CheckoutResponse } from '../schemas/checkout'
import { apiClient } from '../client'

export const submitCheckout = async (
  data: CheckoutRequest,
): Promise<CheckoutResponse> => {
  // POST to Fake Store API's cart endpoint
  const response = await apiClient.post('/carts', {
    userId: 1,
    date: new Date().toISOString(),
    products: data.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  })

  // The API returns { id, userId, date, products }
  // We map it to our CheckoutResponse shape
  return {
    id: response.data.id,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }
}
