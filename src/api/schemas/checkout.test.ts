import { describe, it, expect } from 'vitest'
import { CheckoutRequestSchema, CheckoutResponseSchema } from './checkout'

const validRequest = {
  customer: {
    name: 'John Doe',
    email: 'john@example.com',
    address: '123 Main St',
  },
  items: [{ productId: 1, quantity: 2, price: 29.99 }],
  totals: { subtotal: 59.98, discount: 5.0, total: 54.98 },
}

describe('CheckoutRequestSchema', () => {
  it('parses a valid checkout request', () => {
    const result = CheckoutRequestSchema.safeParse(validRequest)
    expect(result.success).toBe(true)
  })

  it('fails when customer name is missing', () => {
    const result = CheckoutRequestSchema.safeParse({
      ...validRequest,
      customer: { ...validRequest.customer, name: '' },
    })
    expect(result.success).toBe(false)
  })

  it('fails when email is invalid', () => {
    const result = CheckoutRequestSchema.safeParse({
      ...validRequest,
      customer: { ...validRequest.customer, email: 'not-an-email' },
    })
    expect(result.success).toBe(false)
  })

  it('fails when address is missing', () => {
    const result = CheckoutRequestSchema.safeParse({
      ...validRequest,
      customer: { ...validRequest.customer, address: '' },
    })
    expect(result.success).toBe(false)
  })

  it('fails when items array is missing', () => {
    const { items: _items, ...noItems } = validRequest
    const result = CheckoutRequestSchema.safeParse(noItems)
    expect(result.success).toBe(false)
  })

  it('fails when totals are missing', () => {
    const { totals: _totals, ...noTotals } = validRequest
    const result = CheckoutRequestSchema.safeParse(noTotals)
    expect(result.success).toBe(false)
  })
})

describe('CheckoutResponseSchema', () => {
  it('parses a valid response', () => {
    const result = CheckoutResponseSchema.safeParse({
      id: 1,
      status: 'confirmed',
      createdAt: '2026-02-21T10:00:00Z',
    })
    expect(result.success).toBe(true)
  })

  it('fails when id is not a number', () => {
    const result = CheckoutResponseSchema.safeParse({
      id: 'abc',
      status: 'confirmed',
      createdAt: '2026-02-21T10:00:00Z',
    })
    expect(result.success).toBe(false)
  })
})
