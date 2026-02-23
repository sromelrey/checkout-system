import { useQuery } from '@tanstack/react-query'
import { productKeys } from '@/lib/query-keys'
import { getCategories, getProducts } from '@/server/products'
import type { ProductSeach } from '@/api/schemas/product'

const ITEMS_PER_PAGE = 8

export const useProductsQuery = (params: ProductSeach) => {
  return useQuery({
    queryKey: [...productKeys.lists(), params],
    queryFn: () => getProducts(),
    staleTime: 1000 * 60 * 5, // 5 minutes

    select: (products) => {
      let filtered = [...products]
      // Filter by category
      if (params.category) {
        filtered = filtered.filter((p) => p.category === params.category)
      }
      // Search by title
      if (params.q) {
        const query = params.q.toLowerCase()
        filtered = filtered.filter((p) => p.title.toLowerCase().includes(query))
      }

      // Calculate pagination
      const start = (params.page - 1) * ITEMS_PER_PAGE
      const end = start + ITEMS_PER_PAGE

      return {
        items: filtered.slice(start, end),
        totalItems: filtered.length,
        totalPages: Math.ceil(filtered.length / ITEMS_PER_PAGE),
      }
    },
  })
}

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
