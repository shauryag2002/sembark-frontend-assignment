import { useState, useEffect } from 'react'
import { productApi } from '../api'
import type { Product, Category, FilterParams } from '../types'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useProducts(filters?: FilterParams) {
  const [state, setState] = useState<UseApiState<Product[]>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let isMounted = true

    const fetchProducts = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))
        const data = await productApi.getProducts(filters)
        if (isMounted) {
          setState({ data, loading: false, error: null })
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error : new Error('Unknown error'),
          })
        }
      }
    }

    fetchProducts()

    return () => {
      isMounted = false
    }
  }, [filters])

  return state
}

export function useProduct(id: string | number) {
  const [state, setState] = useState<UseApiState<Product>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let isMounted = true

    const fetchProduct = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))
        const data = await productApi.getProduct(id)
        if (isMounted) {
          setState({ data, loading: false, error: null })
        }
      } catch (error) {
        if (isMounted) {
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
      isMounted = false
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

  useEffect(() => {
    let isMounted = true

    const fetchCategories = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))
        const data = await productApi.getCategories()
        if (isMounted) {
          setState({ data, loading: false, error: null })
        }
      } catch (error) {
        if (isMounted) {
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
      isMounted = false
    }
  }, [])

  return state
}
