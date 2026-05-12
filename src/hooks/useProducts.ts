import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
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
  const hasMoreRef = useRef(true)
  const isLoadingMoreRef = useRef(false)
  const categoryIdsKey = filters?.categoryIds?.join(',') ?? ''

  const normalizedFilters = useMemo<FilterParams>(
    () => ({
      categoryIds: categoryIdsKey ? categoryIdsKey.split(',').map(Number) : undefined,
      priceMin: filters?.priceMin,
      priceMax: filters?.priceMax,
      title: filters?.title,
      sort: filters?.sort,
    }),
    [categoryIdsKey, filters?.priceMin, filters?.priceMax, filters?.title, filters?.sort]
  )

  const loadMoreProducts = useCallback(async () => {
    if (isLoadingMoreRef.current || !hasMoreRef.current) return

    try {
      // Abort previous request if still pending.
      controllerRef.current?.abort()
      const controller = new AbortController()
      controllerRef.current = controller
      isLoadingMoreRef.current = true

      setState((prev) => ({ ...prev, isLoadingMore: true, error: null }))

      const newFilters: FilterParams = {
        ...normalizedFilters,
        limit: PAGE_SIZE,
        offset: offsetRef.current,
      }

      const newProducts = await productApi.getProducts(newFilters)

      if (!controller.signal.aborted) {
        const hasMore = newProducts.length >= PAGE_SIZE
        hasMoreRef.current = hasMore
        offsetRef.current += PAGE_SIZE
        isLoadingMoreRef.current = false

        setState((prev) => ({
          ...prev,
          products: [...prev.products, ...newProducts],
          loading: false,
          isLoadingMore: false,
          hasMore,
        }))
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        isLoadingMoreRef.current = false
        setState((prev) => ({
          ...prev,
          isLoadingMore: false,
          loading: false,
          error: error instanceof Error ? error : new Error('Failed to load products'),
        }))
      }
    }
  }, [normalizedFilters])

  // Reset pagination when filters/sort change
  useEffect(() => {
    controllerRef.current?.abort()
    offsetRef.current = 0
    hasMoreRef.current = true
    isLoadingMoreRef.current = false
    setState({
      products: [],
      loading: true,
      error: null,
      hasMore: true,
      isLoadingMore: false,
    })
    void loadMoreProducts()
  }, [loadMoreProducts])

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
