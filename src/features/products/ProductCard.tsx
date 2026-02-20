import type { Product } from '@/api/schemas/product'
import { useCart } from '@/domains/cart/cart.context'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart()

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full bg-white">
      <div className="relative aspect-square mb-4 overflow-hidden rounded-md bg-gray-100">
        <img
          src={product.image}
          alt={product.title}
          className="object-contain w-full h-full mix-blend-multiply"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col flex-grow">
        <h3
          className="font-medium text-lg leading-tight mb-1 line-clamp-2"
          title={product.title}
        >
          {product.title}
        </h3>

        <p className="text-sm text-gray-500 mb-2 capitalize">
          {product.category}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <span className="font-bold text-xl">${product.price.toFixed(2)}</span>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer active:scale-95"
            onClick={() => dispatch({ type: 'ADD_ITEM', product })}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
