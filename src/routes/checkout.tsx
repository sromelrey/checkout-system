import { createFileRoute } from '@tanstack/react-router'
import { CheckoutForm } from '@/features/checkout/CheckoutForm'

export const Route = createFileRoute('/checkout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>
      <CheckoutForm />
    </div>
  )
}
