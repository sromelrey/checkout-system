import { useMutation } from '@tanstack/react-query'
import { submitCheckout } from '@/server/checkout'
import type { CheckoutRequest } from '@/api/schemas/checkout'

export const useCheckoutMutation = () => {
  return useMutation({
    mutationFn: (data: CheckoutRequest) => submitCheckout({ data }),
  })
}
