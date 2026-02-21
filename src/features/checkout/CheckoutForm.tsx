import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useCart } from '@/domains/cart/cart.context'
import { useCheckoutMutation } from './hooks'
import { CheckoutFormSchema } from '@/domains/checkout/checkout.types'
import type { CheckoutFormData } from '@/domains/checkout/checkout.types'
import { applyBestPromotion } from '@/domains/promotions/promotion.logic'
import type { CheckoutRequest } from '@/api/schemas/checkout'
import { CheckCircle, Loader2 } from 'lucide-react'

export function CheckoutForm() {
  const { items, subtotal, dispatch } = useCart()
  const mutation = useCheckoutMutation()

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
    address: '',
  })
  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckoutFormData, string>>
  >({})

  const discount = applyBestPromotion(subtotal)
  const finalTotal = subtotal - discount.discountAmount

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate with Zod safeParse
    const result = CheckoutFormSchema.safeParse(formData)
    if (!result.success) {
      // Extract field errors from Zod
      const fieldErrors: typeof errors = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CheckoutFormData
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})

    // Assemble the full CheckoutRequest from form + cart data
    const request: CheckoutRequest = {
      customer: result.data,
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totals: {
        subtotal,
        discount: discount.discountAmount,
        total: finalTotal,
      },
    }

    mutation.mutate(request, {
      onSuccess: () => dispatch({ type: 'CLEAR_CART' }),
    })
  }

  if (items.length === 0 && !mutation.isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link
          to="/"
          search={(prev) => ({
            page: prev.page ?? 1,
            q: prev.q ?? '',
            category: prev.category ?? '',
          })}
          className="text-blue-600 hover:text-blue-800"
        >
          Go back to shopping
        </Link>
      </div>
    )
  }

  if (mutation.isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Order Confirmed!
        </h2>
        <p className="text-gray-500 mb-6">Thank you for your purchase.</p>
        <Link
          to="/"
          search={(prev) => ({
            page: prev.page ?? 1,
            q: prev.q ?? '',
            category: prev.category ?? '',
          })}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="text"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Address
          </label>
          <textarea
            id="address"
            value={formData.address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>
        {mutation.isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
            Something went wrong. Please try again.
          </div>
        )}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-medium cursor-pointer disabled:opacity-50"
        >
          {mutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Processing...
            </span>
          ) : (
            `Place Order — $${finalTotal.toFixed(2)}`
          )}
        </button>
      </form>
      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white border rounded-lg p-6 shadow-sm sticky top-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Order Summary
          </h2>

          {/* Item list */}
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between text-sm"
              >
                <span className="text-gray-600 line-clamp-1 flex-1 mr-2">
                  {item.product.title} × {item.quantity}
                </span>
                <span className="font-medium shrink-0">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <hr className="my-4" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {discount.applicable && (
              <div className="flex justify-between text-green-600">
                <span>{discount.label}</span>
                <span>-${discount.discountAmount.toFixed(2)}</span>
              </div>
            )}
          </div>

          <hr className="my-4" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
