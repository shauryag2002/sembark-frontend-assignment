import { apiClient } from './client'
import type { Category, Product, FilterParams } from '../types'

export const productApi = {
  async getProducts(filters?: FilterParams): Promise<Product[]> {
    const params: Record<string, any> = {
      limit: filters?.limit || 12,
      offset: filters?.offset || 0,
    }

    if (filters?.categoryId) {
      params.categoryId = filters.categoryId
    }
    if (filters?.priceMin) {
      params.price_min = filters.priceMin
    }
    if (filters?.priceMax) {
      params.price_max = filters.priceMax
    }
    if (filters?.title) {
      params.title = filters.title
    }

    return apiClient.get<Product[]>('/products', params)
  },

  async getProduct(id: string | number): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`)
  },

  async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>('/categories')
  },
}
