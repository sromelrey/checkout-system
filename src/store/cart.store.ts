import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/api/schemas/product'
import type { CartItem } from '@/domains/cart/cart.types'
import { calculateSubtotal, getItemCount } from '@/domains/cart/cart.logic'

interface CartStore {
  items: CartItem[]

  // Actions
  addItem: (product: Product) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void

  // Derived state
  getSubtotal: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            }
          }
          return { items: [...state.items, { product, quantity: 1 }] }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((i) => i.product.id !== productId),
            }
          }
          return {
            items: state.items.map((i) =>
              i.product.id === productId ? { ...i, quantity } : i,
            ),
          }
        }),

      clearCart: () => set({ items: [] }),

      getSubtotal: () => calculateSubtotal({ items: get().items }),
      getTotalItems: () => getItemCount(get().items),
    }),
    {
      name: 'cart-storage',
    },
  ),
)
