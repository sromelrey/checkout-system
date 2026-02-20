import { useMutation } from '@tanstack/react-query'
import { useCart } from '@/domains/cart/cart.context'
import { useToast } from '@/domains/toast/toast.context'
import {
  syncCartToServer,
  updateCartItemQuantity,
  removeFromCartServer,
  clearCartServer,
} from '@/api/services/cart'
import type { Product } from '@/api/schemas/product'

export function useAddToCart() {
  const { dispatch } = useCart()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: (product: Product) => syncCartToServer(product),

    onMutate: async (product) => {
      dispatch({ type: 'ADD_ITEM', product })
      addToast(`Added ${product.title} to cart`, 'success')
      return { product }
    },

    onError: (_error, product) => {
      dispatch({ type: 'REMOVE_ITEM', productId: product.id })
      addToast(`Failed to sync ${product.title}. Item removed.`, 'error')
    },
  })
}

export function useUpdateQuantity() {
  const { dispatch, items } = useCart()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: number
      quantity: number
    }) => updateCartItemQuantity(productId, quantity),

    onMutate: async ({ productId, quantity }) => {
      const oldQuantity = items.find(
        (i) => i.product.id === productId,
      )?.quantity

      dispatch({ type: 'UPDATE_QUANTITY', productId, quantity })

      return { productId, oldQuantity }
    },

    onError: (_error, _variables, context) => {
      if (context?.oldQuantity !== undefined) {
        dispatch({
          type: 'UPDATE_QUANTITY',
          productId: context.productId,
          quantity: context.oldQuantity,
        })
      }
      addToast('Failed to update quantity. Rolled back.', 'error')
    },
  })
}

export function useRemoveFromCart() {
  const { dispatch, items } = useCart()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: (productId: number) => removeFromCartServer(productId),

    onMutate: async (productId) => {
      const itemToRestore = items.find((i) => i.product.id === productId)

      dispatch({ type: 'REMOVE_ITEM', productId })
      addToast('Item removed', 'info')

      return { itemToRestore }
    },

    onError: (_error, _variables, context) => {
      if (context?.itemToRestore) {
        dispatch({ type: 'ADD_ITEM', product: context.itemToRestore.product })
      }
      addToast('Failed to remove item. Restored.', 'error')
    },
  })
}

export function useClearCart() {
  const { dispatch, items } = useCart()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: () => clearCartServer(),

    onMutate: async () => {
      const itemsToRestore = [...items]

      dispatch({ type: 'CLEAR_CART' })
      addToast('Cart cleared', 'info')

      return { itemsToRestore }
    },

    onError: (_error, _variables, context) => {
      if (context?.itemsToRestore) {
        // Rollback by re-adding all items
        context.itemsToRestore.forEach((item) => {
          dispatch({ type: 'ADD_ITEM', product: item.product })
          dispatch({
            type: 'UPDATE_QUANTITY',
            productId: item.product.id,
            quantity: item.quantity,
          })
        })
      }
      addToast('Failed to clear cart. Restored.', 'error')
    },
  })
}
