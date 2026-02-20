import { createFileRoute } from '@tanstack/react-router'
import { ProductList } from '../features/products/ProductList'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="p-4 container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Featured Products
      </h1>

      {/* The ProductList component handles loading/error states internaly */}
      <ProductList />
    </div>
  )
}
