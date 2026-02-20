import { useNavigate } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'
import { useCategoriesQuery } from './hooks'
import type { ProductSeach } from '@/api/schemas/product'
import { useEffect, useState } from 'react'

export function FilterSection({
  searchParams,
}: {
  searchParams: ProductSeach
}) {
  const navigate = useNavigate({ from: '/' })
  const { data: categories } = useCategoriesQuery()

  const [localSearch, setLocalSearch] = useState(searchParams.q)

  // Sync local search if the URL changes from outside (e.g. clicking Home)
  useEffect(() => {
    setLocalSearch(searchParams.q)
  }, [searchParams.q])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchParams.q) {
        navigate({
          search: (prev) => ({ ...prev, q: localSearch, page: 1 }),
        })
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [localSearch, navigate, searchParams.q])

  // Update URL on category change
  const handleCategory = (category: string) => {
    navigate({
      search: (prev) => ({ ...prev, category, page: 1 }),
    })
  }

  // Helper to clear everything
  const clearFilters = () => {
    setLocalSearch('')
    navigate({
      search: () => ({ page: 1, q: '', category: '' }),
    })
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
      {/* Search Bar */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search products..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {localSearch && (
          <button
            onClick={() => setLocalSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        {/* Category Select */}
        <select
          value={searchParams.category}
          onChange={(e) => handleCategory(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px] capitalize"
        >
          <option value="">All Categories</option>
          {categories?.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Reset Button */}
        {(searchParams.q || searchParams.category) && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  )
}
