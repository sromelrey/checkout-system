import { useMutation } from '@tanstack/react-query'
import { useCartStore } from '@/store/cart.store'
import { useToastStore } from '@/store/toast.store'
import {
  syncCartToServer,
  updateCartItemQuantity,
  removeFromCartServer,
  clearCartServer,
} from '@/server/cart'
import type { Product } from '@/api/schemas/product'

export function useAddToCart() {
  const addItem = useCartStore((s) => s.addItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const addToast = useToastStore((s) => s.addToast)

  return useMutation({
    mutationFn: (product: Product) =>
      syncCartToServer({
        data: { productId: product.id, quantity: 1 },
      }),

    onMutate: async (product) => {
      addItem(product)
      addToast(`Added ${product.title} to cart`, 'success')
      return { product }
    },

    onError: (_error, product) => {
      removeItem(product.id)
      addToast(`Failed to sync ${product.title}. Item removed.`, 'error')
    },
  })
}

export function useUpdateQuantity() {
  const items = useCartStore((s) => s.items)
  const updateQuantityAction = useCartStore((s) => s.updateQuantity)
  const addToast = useToastStore((s) => s.addToast)

  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: number
      quantity: number
    }) => updateCartItemQuantity({ data: { productId, quantity } }),

    onMutate: async ({ productId, quantity }) => {
      const oldQuantity = items.find(
        (i) => i.product.id === productId,
      )?.quantity

      updateQuantityAction(productId, quantity)

      return { productId, oldQuantity }
    },

    onError: (_error, _variables, context) => {
      if (context?.oldQuantity !== undefined) {
        updateQuantityAction(context.productId, context.oldQuantity)
      }
      addToast('Failed to update quantity. Rolled back.', 'error')
    },
  })
}

export function useRemoveFromCart() {
  const items = useCartStore((s) => s.items)
  const removeItemAction = useCartStore((s) => s.removeItem)
  const addItem = useCartStore((s) => s.addItem)
  const updateQuantityAction = useCartStore((s) => s.updateQuantity)
  const addToast = useToastStore((s) => s.addToast)

  return useMutation({
    mutationFn: (productId: number) =>
      removeFromCartServer({ data: productId }),

    onMutate: async (productId) => {
      const itemToRestore = items.find((i) => i.product.id === productId)

      removeItemAction(productId)
      addToast('Item removed', 'info')

      return { itemToRestore }
    },

    onError: (_error, _variables, context) => {
      if (context?.itemToRestore) {
        addItem(context.itemToRestore.product)
        updateQuantityAction(
          context.itemToRestore.product.id,
          context.itemToRestore.quantity,
        )
      }
      addToast('Failed to remove item. Restored.', 'error')
    },
  })
}

export function useClearCart() {
  const items = useCartStore((s) => s.items)
  const clearCartAction = useCartStore((s) => s.clearCart)
  const addItem = useCartStore((s) => s.addItem)
  const updateQuantityAction = useCartStore((s) => s.updateQuantity)
  const addToast = useToastStore((s) => s.addToast)

  return useMutation({
    mutationFn: () => clearCartServer(),

    onMutate: async () => {
      const itemsToRestore = [...items]

      clearCartAction()
      addToast('Cart cleared', 'info')

      return { itemsToRestore }
    },

    onError: (_error, _variables, context) => {
      if (context?.itemsToRestore) {
        // Rollback by re-adding all items
        context.itemsToRestore.forEach((item) => {
          addItem(item.product)
          updateQuantityAction(item.product.id, item.quantity)
        })
      }
      addToast('Failed to clear cart. Restored.', 'error')
    },
  })
}
