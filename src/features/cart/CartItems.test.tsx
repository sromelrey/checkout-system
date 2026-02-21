import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

import { CartItems } from './CartItems'
import type { Product } from '@/api/schemas/product'

// All mocks must be declared before imports (Vitest hoists vi.mock to top)
vi.mock('./hooks', () => ({
  useUpdateQuantity: () => ({ mutate: vi.fn() }),
  useRemoveFromCart: () => ({ mutate: vi.fn() }),
  useClearCart: () => ({ mutate: vi.fn() }),
}))

// Mock TanStack Router's Link component
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))

const mockUseCart = vi.fn()
vi.mock('@/domains/cart/cart.context', () => ({
  useCart: () => mockUseCart(),
}))

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
  description: 'Another product',
  category: 'clothing',
  rating: { rate: 3.8, count: 50 },
}

describe('CartItems', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty cart message when no items', () => {
    mockUseCart.mockReturnValue({
      items: [],
      subtotal: 0,
      totalItems: 0,
      dispatch: vi.fn(),
    })

    render(<CartItems />)
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument()
  })

  it('renders cart items with product info', () => {
    mockUseCart.mockReturnValue({
      items: [
        { product: mockProduct, quantity: 2 },
        { product: mockProduct2, quantity: 1 },
      ],
      subtotal: 109.97,
      totalItems: 3,
      dispatch: vi.fn(),
    })

    render(<CartItems />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('Another Product')).toBeInTheDocument()
    expect(screen.getByText('$29.99 each')).toBeInTheDocument()
    expect(screen.getByText('$49.99 each')).toBeInTheDocument()
  })

  it('displays order summary section', () => {
    mockUseCart.mockReturnValue({
      items: [{ product: mockProduct, quantity: 1 }],
      subtotal: 29.99,
      totalItems: 1,
      dispatch: vi.fn(),
    })

    render(<CartItems />)
    expect(screen.getByText('Order Summary')).toBeInTheDocument()
    expect(screen.getByText('Subtotal')).toBeInTheDocument()
  })

  it('displays discount when subtotal qualifies (> $20)', () => {
    mockUseCart.mockReturnValue({
      items: [{ product: mockProduct, quantity: 1 }],
      subtotal: 29.99,
      totalItems: 1,
      dispatch: vi.fn(),
    })

    render(<CartItems />)
    expect(screen.getByText('10% OFF')).toBeInTheDocument()
  })

  it('shows Checkout link and Clear Cart button', () => {
    mockUseCart.mockReturnValue({
      items: [{ product: mockProduct, quantity: 1 }],
      subtotal: 29.99,
      totalItems: 1,
      dispatch: vi.fn(),
    })

    render(<CartItems />)
    expect(screen.getByText('Checkout')).toBeInTheDocument()
    expect(screen.getByText('Clear Cart')).toBeInTheDocument()
  })
})
