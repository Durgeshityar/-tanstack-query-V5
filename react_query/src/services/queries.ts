import {
  keepPreviousData,
  useInfiniteQuery,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  getProduct,
  getProducts,
  getProjects,
  getTodo,
  getTodosIds,
} from './api'
import { Products } from '../types/products'

export function useTodosIds() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: getTodosIds,
  })
}

// useQueries is used when there are multipple items and we dont know How many

export function useTodos(ids: (number | undefined)[] | undefined) {
  return useQueries({
    queries: (ids ?? []).map((id) => {
      return {
        queryKey: ['todo', { id }],
        queryFn: () => getTodo(id!),
      }
    }),
  })
}

//Pagination

export function useProjects(page: number) {
  return useQuery({
    queryKey: ['projects', { page }],
    queryFn: () => getProjects(page),
    placeholderData: keepPreviousData,
  })
}

//iNfinite scrooling

export function useProducts() {
  return useInfiniteQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined
      }
      return lastPageParam + 1
    },
    getPreviousPageParam: (_, __, firstPageParams) => {
      if (firstPageParams <= 1) {
        return undefined
      }
      return firstPageParams - 1
    },
  })
}

export function useProduct(id: number | null) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['product', { id }],
    queryFn: () => getProduct(id!),
    enabled: !!id,
    placeholderData: () => {
      const cachedProducts = (
        queryClient.getQueryData(['products']) as {
          pages: Products[] | undefined
        }
      )?.pages?.flat(2)

      if (cachedProducts) {
        return cachedProducts.find((item) => item.id === id)
      }
    },
  })
}
