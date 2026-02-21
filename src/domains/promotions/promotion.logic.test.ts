import { describe, it, expect } from 'vitest'
import { applyBestPromotion, promotionRules } from './promotion.logic'

describe('applyBestPromotion', () => {
  it('returns no discount for subtotal $0', () => {
    const result = applyBestPromotion(0)
    expect(result.applicable).toBe(false)
    expect(result.discountAmount).toBe(0)
    expect(result.label).toBe('No discount')
  })

  it('returns no discount for subtotal ≤ $20', () => {
    const result = applyBestPromotion(20)
    expect(result.applicable).toBe(false)
    expect(result.discountAmount).toBe(0)
  })

  it('applies 10% OFF for subtotal > $20 and ≤ $50', () => {
    const result = applyBestPromotion(25)
    expect(result.applicable).toBe(true)
    expect(result.label).toBe('10% OFF')
    expect(result.discountAmount).toBeCloseTo(2.5)
  })

  it('applies 15% OFF for subtotal > $50 and ≤ $100', () => {
    const result = applyBestPromotion(55)
    expect(result.applicable).toBe(true)
    expect(result.label).toBe('15% OFF')
    expect(result.discountAmount).toBeCloseTo(8.25)
  })

  it('applies 20% OFF for subtotal > $100', () => {
    const result = applyBestPromotion(120)
    expect(result.applicable).toBe(true)
    expect(result.label).toBe('20% OFF')
    expect(result.discountAmount).toBeCloseTo(24)
  })

  it('picks the first applicable rule (highest discount) since rules are sorted', () => {
    // $200 qualifies for all rules — should pick 20% OFF (first in array)
    const result = applyBestPromotion(200)
    expect(result.label).toBe('20% OFF')
    expect(result.discountAmount).toBeCloseTo(40)
  })

  it('accepts a custom rules array', () => {
    const customRules = [
      {
        name: 'CUSTOM',
        description: 'Custom 50% off over $10',
        evaluate: (subtotal: number) => ({
          applicable: subtotal > 10,
          discountAmount: subtotal * 0.5,
          label: '50% OFF',
        }),
      },
    ]
    const result = applyBestPromotion(15, customRules)
    expect(result.applicable).toBe(true)
    expect(result.label).toBe('50% OFF')
    expect(result.discountAmount).toBeCloseTo(7.5)
  })

  it('returns no discount when custom rules array is empty', () => {
    const result = applyBestPromotion(100, [])
    expect(result.applicable).toBe(false)
    expect(result.discountAmount).toBe(0)
  })
})

describe('promotionRules', () => {
  it('has 3 rules defined', () => {
    expect(promotionRules).toHaveLength(3)
  })

  it('rules are ordered by discount amount descending', () => {
    const names = promotionRules.map((r) => r.name)
    expect(names).toEqual(['20_OFF', '15_OFF', '10_OFF'])
  })
})
