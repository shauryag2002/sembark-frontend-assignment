import { useState, useEffect, useRef } from 'react'
import { productApi } from '../api'
import type { Product, Category, FilterParams } from '../types'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface InfiniteState {
  products: Product[]
  loading: boolean
  error: Error | null
  hasMore: boolean
  isLoadingMore: boolean
}

const PAGE_SIZE = 12

export function useProducts(filters?: FilterParams) {
  const [state, setState] = useState<InfiniteState>({
    products: [],
    loading: true,
    error: null,
    hasMore: true,
    isLoadingMore: false,
  })

  const controllerRef = useRef<AbortController | null>(null)
  const offsetRef = useRef(0)

  // Reset pagination when filters change
  useEffect(() => {
    offsetRef.current = 0
    setState({
      products: [],
      loading: true,
      error: null,
      hasMore: true,
      isLoadingMore: false,
    })
  }, [filters?.categoryIds?.join(','), filters?.priceMin, filters?.priceMax])

  // Initial load
  useEffect(() => {
    if (offsetRef.current === 0) {
      loadMoreProducts()
    }
  }, [filters])

  const loadMoreProducts = async () => {
    if (state.isLoadingMore || !state.hasMore) return

    try {
      // Abort previous request if still pending
      controllerRef.current?.abort()
      controllerRef.current = new AbortController()

      setState((prev) => ({ ...prev, isLoadingMore: true, error: null }))

      const newFilters: FilterParams = {
        ...filters,
        limit: PAGE_SIZE,
        offset: offsetRef.current,
      }

      const newProducts = await productApi.getProducts(newFilters)

      // Check if request was aborted
      if (!controllerRef.current.signal.aborted) {
        const hasMore = newProducts.length === PAGE_SIZE
        offsetRef.current += PAGE_SIZE

        setState((prev) => ({
          ...prev,
          products: [...prev.products, ...newProducts],
          loading: false,
          isLoadingMore: false,
          hasMore,
        }))
      }
    } catch (error) {
      if (!controllerRef.current?.signal.aborted) {
        setState((prev) => ({
          ...prev,
          isLoadingMore: false,
          loading: false,
          error: error instanceof Error ? error : new Error('Failed to load products'),
        }))
      }
    }
  }

  useEffect(() => {
    return () => {
      controllerRef.current?.abort()
    }
  }, [])

  return {
    ...state,
    loadMore: loadMoreProducts,
  }
}

export function useProduct(id: string | number) {
  const [state, setState] = useState<UseApiState<Product>>({
    data: null,
    loading: true,
    error: null,
  })

  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    controllerRef.current?.abort()
    controllerRef.current = new AbortController()

    const fetchProduct = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))
        const data = await productApi.getProduct(id)

        if (!controllerRef.current?.signal.aborted) {
          setState({ data, loading: false, error: null })
        }
      } catch (error) {
        if (!controllerRef.current?.signal.aborted) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error : new Error('Unknown error'),
          })
        }
      }
    }

    fetchProduct()

    return () => {
      controllerRef.current?.abort()
    }
  }, [id])

  return state
}

export function useCategories() {
  const [state, setState] = useState<UseApiState<Category[]>>({
    data: null,
    loading: true,
    error: null,
  })

  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    controllerRef.current?.abort()
    controllerRef.current = new AbortController()

    const fetchCategories = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))
        const data = await productApi.getCategories()

        if (!controllerRef.current?.signal.aborted) {
          setState({ data, loading: false, error: null })
        }
      } catch (error) {
        if (!controllerRef.current?.signal.aborted) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error : new Error('Unknown error'),
          })
        }
      }
    }

    fetchCategories()

    return () => {
      controllerRef.current?.abort()
    }
  }, [])

  return state
}
