import { describe, it, expect } from 'vitest'
import {
  cartReducer,
  calculateSubtotal,
  getItemCount,
  findCartItemById,
} from './cart.logic'
import type { CartState } from './cart.types'
import type { Product } from '@/api/schemas/product'

// ── Test Fixtures ──────────────────────────────────────────────

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  image: 'https://example.com/image.jpg',
  description: 'A test product',
  category: 'electronics',
  rating: { rate: 4.5, count: 100 },
}

const mockProduct2: Product = {
  id: 2,
  title: 'Another Product',
  price: 49.99,
  image: 'https://example.com/image2.jpg',
  description: 'Another test product',
  category: 'clothing',
  rating: { rate: 3.8, count: 50 },
}

const emptyState: CartState = { items: [] }

const stateWithOneItem: CartState = {
  items: [{ product: mockProduct, quantity: 1 }],
}

const stateWithTwoItems: CartState = {
  items: [
    { product: mockProduct, quantity: 2 },
    { product: mockProduct2, quantity: 3 },
  ],
}

// ── cartReducer ────────────────────────────────────────────────

describe('cartReducer', () => {
  describe('ADD_ITEM', () => {
    it('adds a new item with quantity 1', () => {
      const result = cartReducer(emptyState, {
        type: 'ADD_ITEM',
        product: mockProduct,
      })
      expect(result.items).toHaveLength(1)
      expect(result.items[0].product.id).toBe(1)
      expect(result.items[0].quantity).toBe(1)
    })

    it('increments quantity when adding an existing item', () => {
      const result = cartReducer(stateWithOneItem, {
        type: 'ADD_ITEM',
        product: mockProduct,
      })
      expect(result.items).toHaveLength(1)
      expect(result.items[0].quantity).toBe(2)
    })

    it('does not mutate the original state', () => {
      const original = { ...emptyState, items: [...emptyState.items] }
      cartReducer(emptyState, { type: 'ADD_ITEM', product: mockProduct })
      expect(emptyState).toEqual(original)
    })
  })

  describe('REMOVE_ITEM', () => {
    it('removes the item by productId', () => {
      const result = cartReducer(stateWithOneItem, {
        type: 'REMOVE_ITEM',
        productId: 1,
      })
      expect(result.items).toHaveLength(0)
    })

    it('leaves other items untouched', () => {
      const result = cartReducer(stateWithTwoItems, {
        type: 'REMOVE_ITEM',
        productId: 1,
      })
      expect(result.items).toHaveLength(1)
      expect(result.items[0].product.id).toBe(2)
    })

    it('returns same state when productId not found', () => {
      const result = cartReducer(stateWithOneItem, {
        type: 'REMOVE_ITEM',
        productId: 999,
      })
      expect(result.items).toHaveLength(1)
    })
  })

  describe('UPDATE_QUANTITY', () => {
    it('updates quantity for the specified item', () => {
      const result = cartReducer(stateWithOneItem, {
        type: 'UPDATE_QUANTITY',
        productId: 1,
        quantity: 5,
      })
      expect(result.items[0].quantity).toBe(5)
    })

    it('removes item when quantity is 0', () => {
      const result = cartReducer(stateWithOneItem, {
        type: 'UPDATE_QUANTITY',
        productId: 1,
        quantity: 0,
      })
      expect(result.items).toHaveLength(0)
    })

    it('removes item when quantity is negative', () => {
      const result = cartReducer(stateWithOneItem, {
        type: 'UPDATE_QUANTITY',
        productId: 1,
        quantity: -1,
      })
      expect(result.items).toHaveLength(0)
    })
  })

  describe('CLEAR_CART', () => {
    it('removes all items', () => {
      const result = cartReducer(stateWithTwoItems, { type: 'CLEAR_CART' })
      expect(result.items).toHaveLength(0)
    })
  })

  describe('LOAD_CART', () => {
    it('replaces items with the provided list', () => {
      const loadedItems = [{ product: mockProduct2, quantity: 7 }]
      const result = cartReducer(emptyState, {
        type: 'LOAD_CART',
        items: loadedItems,
      })
      expect(result.items).toEqual(loadedItems)
    })
  })

  it('returns the same state for unknown action types', () => {
    const result = cartReducer(stateWithOneItem, { type: 'UNKNOWN' } as any)
    expect(result).toEqual(stateWithOneItem)
  })
})

// ── calculateSubtotal ──────────────────────────────────────────

describe('calculateSubtotal', () => {
  it('returns 0 for an empty cart', () => {
    expect(calculateSubtotal(emptyState)).toBe(0)
  })

  it('returns price × quantity for a single item', () => {
    expect(calculateSubtotal(stateWithOneItem)).toBeCloseTo(29.99)
  })

  it('sums price × quantity across multiple items', () => {
    // (29.99 × 2) + (49.99 × 3) = 59.98 + 149.97 = 209.95
    expect(calculateSubtotal(stateWithTwoItems)).toBeCloseTo(209.95)
  })
})

// ── getItemCount ───────────────────────────────────────────────

describe('getItemCount', () => {
  it('returns 0 for an empty list', () => {
    expect(getItemCount([])).toBe(0)
  })

  it('sums quantities across all items', () => {
    // 2 + 3 = 5
    expect(getItemCount(stateWithTwoItems.items)).toBe(5)
  })
})

// ── findCartItemById ───────────────────────────────────────────

describe('findCartItemById', () => {
  it('returns the matching cart item', () => {
    const found = findCartItemById(stateWithTwoItems.items, 1)
    expect(found).toBeDefined()
    expect(found?.product.title).toBe('Test Product')
  })

  it('returns undefined when not found', () => {
    const found = findCartItemById(stateWithTwoItems.items, 999)
    expect(found).toBeUndefined()
  })
})
