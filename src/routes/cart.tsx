import { createFileRoute } from '@tanstack/react-router'
import { CartItems } from '@/features/cart/CartItems'

export const Route = createFileRoute('/cart')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>
      <CartItems />
    </div>
  )
}
