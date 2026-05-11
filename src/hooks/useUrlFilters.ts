import { useSearchParams } from 'react-router-dom'
import type { FilterParams } from '../types'

export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: FilterParams = {
    categoryId: searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined,
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
    limit: 12,
    offset: 0,
  }

  const updateFilters = (newFilters: Partial<FilterParams>) => {
    const params = new URLSearchParams(searchParams)
    
    if (newFilters.categoryId) {
      params.set('categoryId', String(newFilters.categoryId))
    } else {
      params.delete('categoryId')
    }
    
    if (newFilters.priceMin) {
      params.set('priceMin', String(newFilters.priceMin))
    } else {
      params.delete('priceMin')
    }
    
    if (newFilters.priceMax) {
      params.set('priceMax', String(newFilters.priceMax))
    } else {
      params.delete('priceMax')
    }

    setSearchParams(params)
  }

  const toggleCategory = (categoryId: number) => {
    const currentId = filters.categoryId
    updateFilters({
      categoryId: currentId === categoryId ? undefined : categoryId,
    })
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  return {
    filters,
    updateFilters,
    toggleCategory,
    clearFilters,
    selectedCategoryId: filters.categoryId,
  }
}
