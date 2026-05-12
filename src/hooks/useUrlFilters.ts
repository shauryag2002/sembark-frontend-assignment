import { useSearchParams } from 'react-router-dom'
import type { FilterParams, SortOption } from '../types'

export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Parse comma-separated categoryIds from URL
  const categoryIdsParam = searchParams.get('categoryIds')
  const categoryIds = categoryIdsParam ? categoryIdsParam.split(',').map(Number) : []

  const filters: FilterParams = {
    categoryIds,
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
    sort: (searchParams.get('sort') as SortOption) || undefined,
    limit: 12,
    offset: 0,
  }

  const updateFilters = (newFilters: Partial<FilterParams>) => {
    const params = new URLSearchParams(searchParams)
    
    if (newFilters.categoryIds && newFilters.categoryIds.length > 0) {
      params.set('categoryIds', newFilters.categoryIds.join(','))
    } else {
      params.delete('categoryIds')
    }
    
    if (newFilters.priceMin !== undefined && newFilters.priceMin > 0) {
      params.set('priceMin', String(newFilters.priceMin))
    } else {
      params.delete('priceMin')
    }
    
    if (newFilters.priceMax !== undefined && newFilters.priceMax > 0) {
      params.set('priceMax', String(newFilters.priceMax))
    } else {
      params.delete('priceMax')
    }

    if (newFilters.sort) {
      params.set('sort', newFilters.sort)
    } else {
      params.delete('sort')
    }

    setSearchParams(params)
  }

  const toggleCategory = (categoryId: number) => {
    const newCategoryIds = categoryIds.includes(categoryId)
      ? categoryIds.filter((id) => id !== categoryId)
      : [...categoryIds, categoryId]

    updateFilters({ categoryIds: newCategoryIds })
  }

  const updatePriceRange = (priceMin?: number, priceMax?: number) => {
    updateFilters({ categoryIds, priceMin, priceMax, sort: filters.sort })
  }

  const updateSort = (sort: SortOption | undefined) => {
    updateFilters({ categoryIds, priceMin: filters.priceMin, priceMax: filters.priceMax, sort })
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  const hasActiveFilters = categoryIds.length > 0 || filters.priceMin || filters.priceMax || filters.sort

  return {
    filters,
    updateFilters,
    toggleCategory,
    updatePriceRange,
    updateSort,
    clearFilters,
    categoryIds,
    hasActiveFilters,
  }
}


