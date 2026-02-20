import { createFileRoute } from '@tanstack/react-router'
import { ProductList } from '../features/products/ProductList'
import { productSearchSchema } from '@/api/schemas/product'

export const Route = createFileRoute('/')({
  validateSearch: (search) => productSearchSchema.parse(search),
  component: Home,
})

function Home() {
  const { page, q, category } = Route.useSearch()

  return (
    <div className="p-4 container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Featured Products
      </h1>

      {/* The ProductList component handles loading/error states internaly */}
      <ProductList searchParams={{ page, q, category }} />
    </div>
  )
}
