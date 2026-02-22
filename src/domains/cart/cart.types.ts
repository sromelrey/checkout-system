import type { Product } from '@/api/schemas/product'

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartState {
  items: CartItem[]
}
