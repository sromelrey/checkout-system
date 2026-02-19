import type { CartAction, CartItem, CartState } from './cart.types'

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (item) => item.product.id === action.product.id,
      )
      // ? if the item already exists in the cart, increment the quantity
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        }
      }
      // ? if the item does not exist in the cart, add it
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: 1 }],
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (item) => item.product.id !== action.productId,
        ),
      }
    case 'UPDATE_QUANTITY':
      // ? if the quantity is less than or equal to 0, remove the item from the cart
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.product.id !== action.productId,
          ),
        }
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: action.quantity }
            : item,
        ),
      }
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      }
    case 'LOAD_CART':
      return {
        ...state,
        items: action.items,
      }
    default:
      return state
  }
}

export function calculateSubtotal(state: CartState): number {
  return state.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  )
}

export function getItemCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0)
}

export function findCartItemById(
  items: CartItem[],
  productId: number,
): CartItem | undefined {
  return items.find((item) => item.product.id === productId)
}
