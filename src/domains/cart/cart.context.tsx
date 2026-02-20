import React, { createContext, useContext, useEffect, useReducer } from 'react'
import type { CartAction, CartState } from './cart.types'
import { calculateSubtotal, cartReducer, getItemCount } from './cart.logic'

const CART_STORAGE_KEY = 'mochi_cart'

interface CartContextType extends CartState {
  dispatch: React.Dispatch<CartAction>
  subtotal: number
  totalItems: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
  })
  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', items: parsed.items })
      } catch (error) {
        console.error('Failed to load cart from local storage', error)
      }
    }
  }, [])
  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
  }, [state])
  const subtotal = calculateSubtotal(state)
  const totalItems = getItemCount(state.items)
  return (
    <CartContext.Provider value={{ ...state, dispatch, subtotal, totalItems }}>
      {children}
    </CartContext.Provider>
  )
}
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
