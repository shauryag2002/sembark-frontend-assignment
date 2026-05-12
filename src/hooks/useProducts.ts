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
function createInitialInfiniteState(): InfiniteState {
  return {
    products: [],
    loading: true,
    error: null,
    hasMore: true,
    isLoadingMore: false,
  }
}

const INITIAL_INFINITE_STATE = createInitialInfiniteState()

export function useProducts(filters?: FilterParams) {
  const [state, setState] = useState<InfiniteState>(INITIAL_INFINITE_STATE)

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

  const resetPaginationRefs = useCallback(() => {
    controllerRef.current?.abort()
    offsetRef.current = 0
    hasMoreRef.current = true
    isLoadingMoreRef.current = false
  }, [])

  const startNextRequest = useCallback(() => {
    // We cancel the previous request so stale responses cannot overwrite fresh data.
    controllerRef.current?.abort()
    const requestController = new AbortController()
    controllerRef.current = requestController
    isLoadingMoreRef.current = true
    const isFirstPageRequest = offsetRef.current === 0

    setState((currentState) =>
      isFirstPageRequest
        ? { ...createInitialInfiniteState(), isLoadingMore: true }
        : { ...currentState, isLoadingMore: true, error: null }
    )
    return requestController
  }, [])

  const buildNextRequestFilters = useCallback(
    (): FilterParams => ({
      ...normalizedFilters,
      limit: PAGE_SIZE,
      offset: offsetRef.current,
    }),
    [normalizedFilters]
  )

  const appendProducts = useCallback((nextProducts: Product[]) => {
    const hasMoreProducts = nextProducts.length >= PAGE_SIZE
    hasMoreRef.current = hasMoreProducts
    offsetRef.current += PAGE_SIZE
    isLoadingMoreRef.current = false

    setState((currentState) => ({
      ...currentState,
      products: [...currentState.products, ...nextProducts],
      loading: false,
      isLoadingMore: false,
      hasMore: hasMoreProducts,
    }))
  }, [])

  const handleLoadMoreError = useCallback((error: unknown) => {
    isLoadingMoreRef.current = false
    setState((currentState) => ({
      ...currentState,
      isLoadingMore: false,
      loading: false,
      error: error instanceof Error ? error : new Error('Failed to load products'),
    }))
  }, [])

  const loadMoreProducts = useCallback(async () => {
    if (isLoadingMoreRef.current || !hasMoreRef.current) return

    try {
      const requestController = startNextRequest()
      const requestFilters = buildNextRequestFilters()
      const nextProducts = await productApi.getProducts(requestFilters)

      if (!requestController.signal.aborted) {
        appendProducts(nextProducts)
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        handleLoadMoreError(error)
      }
    }
  }, [appendProducts, buildNextRequestFilters, handleLoadMoreError, startNextRequest])

  // Filter/sort updates should start fresh from page 1.
  useEffect(() => {
    resetPaginationRefs()
    const loadTimer = window.setTimeout(() => {
      void loadMoreProducts()
    }, 0)

    return () => {
      window.clearTimeout(loadTimer)
    }
  }, [loadMoreProducts, resetPaginationRefs])

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
