import { useQuery } from '@tanstack/react-query'
import { productKeys } from '@/lib/query-keys'
import { getProducts } from '@/api/services/products'

export const useProductsQuery = () => {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
