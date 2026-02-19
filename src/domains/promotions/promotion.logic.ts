import type { DiscountResult, PromotionRule } from './promotion.types'

export const promotionRules: PromotionRule[] = [
  {
    name: '20_OFF',
    description: '20% off',
    evaluate: (subtotal) => ({
      applicable: subtotal > 100,
      discountAmount: subtotal * 0.2,
      label: '20% OFF',
    }),
  },
  {
    name: '15_OFF',
    description: '15% off orders over $50',
    evaluate: (subtotal) => ({
      applicable: subtotal > 50,
      discountAmount: subtotal * 0.15,
      label: '15% OFF',
    }),
  },
  {
    name: '10_OFF',
    description: '10% off orders over $20',
    evaluate: (subtotal) => ({
      applicable: subtotal > 20,
      discountAmount: subtotal * 0.1,
      label: '10% OFF',
    }),
  },
]

// ? Returns the best applicable promotion (first match wins since rules are storted by discount amount)
export function applyBestPromotion(
  subtotal: number,
  rules: PromotionRule[] = promotionRules,
): DiscountResult {
  for (const rule of rules) {
    const result = rule.evaluate(subtotal)
    if (result.applicable) {
      return result
    }
  }
  return { applicable: false, discountAmount: 0, label: 'No discount' }
}
