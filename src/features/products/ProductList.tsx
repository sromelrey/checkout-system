import type { ProductSeach } from '@/api/schemas/product'
import { useProductsQuery } from './hooks'
import { FilterSection } from './FilterSection' // [1] Add imports
import { Pagination } from './Pagination' // [2] Add imports
import { ProductCard } from './ProductCard'

export function ProductList({ searchParams }: { searchParams: ProductSeach }) {
  const { data, isLoading, error, isError } = useProductsQuery(searchParams)

  if (isError) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg">
        <p className="font-medium">Error loading products</p>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
    )
  }

  return (
    <>
      <FilterSection searchParams={searchParams} />
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-[350px] bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : !data?.items.length ? (
        <div className="py-20 text-center">
          <p className="text-gray-500 text-lg">
            No products match your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      {data && (
        <Pagination
          currentPage={searchParams.page}
          totalPages={data.totalPages}
        />
      )}
    </>
  )
}
