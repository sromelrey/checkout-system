import { vi, describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { Product } from '@/api/schemas/product'

import { ProductCard } from './ProductCard'

// Mock useAddToCart so we don't need mutation/query infrastructure
vi.mock('../cart/hooks', () => ({
  useAddToCart: () => ({ mutate: vi.fn(), isPending: false }),
}))

const mockProduct: Product = {
  id: 1,
  title: 'Wireless Bluetooth Headphones',
  price: 59.99,
  image: 'https://fakestoreapi.com/img/headphones.jpg',
  description: 'High quality wireless headphones',
  category: "men's clothing",
  rating: { rate: 4.2, count: 120 },
}

describe('ProductCard', () => {
  it('renders product title', () => {
    render(<ProductCard product={mockProduct} />)
    expect(
      screen.getByText('Wireless Bluetooth Headphones'),
    ).toBeInTheDocument()
  })

  it('renders product price', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('$59.99')).toBeInTheDocument()
  })

  it('renders product category', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText("men's clothing")).toBeInTheDocument()
  })

  it('renders product image with alt text', () => {
    render(<ProductCard product={mockProduct} />)
    const img = screen.getByAltText('Wireless Bluetooth Headphones')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', mockProduct.image)
  })

  it('renders Add to Cart button', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Add to Cart')).toBeInTheDocument()
  })
})
