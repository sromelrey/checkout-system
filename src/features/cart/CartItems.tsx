import { createFileRoute, Link } from '@tanstack/react-router'
import { useCart } from '@/domains/cart/cart.context'
import { applyBestPromotion } from '@/domains/promotions/promotion.logic'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'

export function CartItems() {
  const { items, subtotal, dispatch } = useCart()
  const discount = applyBestPromotion(subtotal)
  const finalTotal = subtotal - discount.discountAmount

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShoppingBag className="w-20 h-20 text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex gap-4 bg-white border rounded-lg p-4 shadow-sm"
          >
            {/* Product Image */}
            <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-md overflow-hidden">
              <img
                src={item.product.image}
                alt={item.product.title}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>

            {/* Product Info */}
            <div className="grow flex flex-col justify-between">
              <div>
                <h3
                  className="font-medium text-gray-800 line-clamp-1"
                  title={item.product.title}
                >
                  {item.product.title}
                </h3>
                <p className="text-sm text-gray-500">
                  ${item.product.price.toFixed(2)} each
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  className="p-1 rounded border hover:bg-gray-100 transition-colors disabled:opacity-40 cursor-pointer"
                  disabled={item.quantity <= 1}
                  onClick={() =>
                    dispatch({
                      type: 'UPDATE_QUANTITY',
                      productId: item.product.id,
                      quantity: item.quantity - 1,
                    })
                  }
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">
                  {item.quantity}
                </span>
                <button
                  className="p-1 rounded border hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() =>
                    dispatch({
                      type: 'UPDATE_QUANTITY',
                      productId: item.product.id,
                      quantity: item.quantity + 1,
                    })
                  }
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Line Total & Remove */}
            <div className="flex flex-col items-end justify-between">
              <span className="font-bold text-gray-800">
                ${(item.product.price * item.quantity).toFixed(2)}
              </span>
              <button
                className="text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer"
                onClick={() =>
                  dispatch({
                    type: 'REMOVE_ITEM',
                    productId: item.product.id,
                  })
                }
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Clear Cart */}
        <button
          className="text-sm text-red-500 hover:text-red-700 transition-colors cursor-pointer"
          onClick={() => dispatch({ type: 'CLEAR_CART' })}
        >
          Clear Cart
        </button>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white border rounded-lg p-6 shadow-sm sticky top-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Order Summary
          </h2>

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

          <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-medium cursor-pointer">
            Checkout
          </button>

          <Link
            to="/"
            className="block text-center mt-3 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
