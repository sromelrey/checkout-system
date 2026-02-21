import { describe, it, expect } from 'vitest'
import { ProductSchema } from './product'

const validProduct = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  image: 'https://example.com/image.jpg',
  description: 'A test product',
  category: 'electronics',
  rating: { rate: 4.5, count: 100 },
}

describe('ProductSchema', () => {
  it('parses a valid product', () => {
    const result = ProductSchema.safeParse(validProduct)
    expect(result.success).toBe(true)
  })

  it('fails when required fields are missing', () => {
    const { title: _title, ...noTitle } = validProduct
    const result = ProductSchema.safeParse(noTitle)
    expect(result.success).toBe(false)
  })

  it('fails when price is not a number', () => {
    const result = ProductSchema.safeParse({
      ...validProduct,
      price: 'not-a-number',
    })
    expect(result.success).toBe(false)
  })

  it('fails when rating is incomplete', () => {
    const result = ProductSchema.safeParse({
      ...validProduct,
      rating: { rate: 4.5 }, // missing count
    })
    expect(result.success).toBe(false)
  })

  it('fails when id is missing', () => {
    const { id: _id, ...noId } = validProduct
    const result = ProductSchema.safeParse(noId)
    expect(result.success).toBe(false)
  })
})
