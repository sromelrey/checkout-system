import { useProductsQuery } from './hooks'
import { ProductCard } from './ProductCard'

export function ProductList() {
  const { data: products, isLoading, error, isError } = useProductsQuery()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-[350px] bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg">
        <p className="font-medium">Error loading products</p>
        <p className="text-sm mt-1">{(error).message}</p>
      </div>
    )
  }

  if (!products?.length) {
    return <p className="text-center text-gray-500 mt-8">No products found.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
