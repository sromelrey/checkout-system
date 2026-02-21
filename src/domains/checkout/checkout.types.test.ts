import { describe, it, expect } from 'vitest'
import { CheckoutFormSchema } from './checkout.types'

describe('CheckoutFormSchema', () => {
  it('parses valid form data', () => {
    const result = CheckoutFormSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      address: '123 Main St',
    })
    expect(result.success).toBe(true)
  })

  it('fails when name is empty', () => {
    const result = CheckoutFormSchema.safeParse({
      name: '',
      email: 'john@example.com',
      address: '123 Main St',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const nameError = result.error.issues.find((i) => i.path[0] === 'name')
      expect(nameError?.message).toBe('Name is required')
    }
  })

  it('fails when email is invalid', () => {
    const result = CheckoutFormSchema.safeParse({
      name: 'John',
      email: 'bad-email',
      address: '123 Main St',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const emailError = result.error.issues.find((i) => i.path[0] === 'email')
      expect(emailError?.message).toBe('Invalid email address')
    }
  })

  it('fails when address is empty', () => {
    const result = CheckoutFormSchema.safeParse({
      name: 'John',
      email: 'john@example.com',
      address: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const addrError = result.error.issues.find((i) => i.path[0] === 'address')
      expect(addrError?.message).toBe('Address is required')
    }
  })

  it('fails when all fields are empty', () => {
    const result = CheckoutFormSchema.safeParse({
      name: '',
      email: '',
      address: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThanOrEqual(3)
    }
  })
})
