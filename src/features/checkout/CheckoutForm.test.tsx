import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import { CheckoutForm } from './CheckoutForm'
import type { Product } from '@/api/schemas/product'
import { useCartStore } from '@/store/cart.store'

// All vi.mock calls are hoisted — must come before imports
const mockMutate = vi.fn()
vi.mock('./hooks', () => ({
  useCheckoutMutation: () => ({
    mutate: mockMutate,
    isPending: false,
    isSuccess: false,
    isError: false,
  }),
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
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

describe('CheckoutForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useCartStore.setState({
      items: [{ product: mockProduct, quantity: 2 }],
    })
  })

  it('renders empty cart message when cart is empty', () => {
    useCartStore.setState({
      items: [],
    })

    render(<CheckoutForm />)
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument()
    expect(screen.getByText('Go back to shopping')).toBeInTheDocument()
  })

  it('renders all form fields', () => {
    render(<CheckoutForm />)
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Address')).toBeInTheDocument()
  })

  it('renders order summary with items', () => {
    render(<CheckoutForm />)
    expect(screen.getByText('Order Summary')).toBeInTheDocument()
    expect(screen.getByText(/Test Product/)).toBeInTheDocument()
  })

  it('shows validation errors on empty submit', () => {
    render(<CheckoutForm />)

    const submitButton = screen.getByRole('button', { name: /Place Order/i })
    fireEvent.click(submitButton)

    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Invalid email address')).toBeInTheDocument()
    expect(screen.getByText('Address is required')).toBeInTheDocument()
  })

  it('shows Place Order button', () => {
    render(<CheckoutForm />)
    expect(
      screen.getByRole('button', { name: /Place Order/i }),
    ).toBeInTheDocument()
  })
})
