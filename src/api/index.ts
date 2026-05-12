import { apiClient } from './client'
import type { Category, Product, FilterParams } from '../types'
import { cacheManager } from '../utils/cache'

const CATEGORIES_CACHE_KEY = 'categories'
const PRODUCT_CACHE_KEY = 'product_'
const PRODUCTS_CACHE_KEY = 'products_'

function buildProductsCacheKey(filters?: FilterParams): string {
  if (!filters) return `${PRODUCTS_CACHE_KEY}default`

  const normalized = {
    ...filters,
    categoryIds: filters.categoryIds ? [...filters.categoryIds].sort((a, b) => a - b) : undefined,
  }

  return `${PRODUCTS_CACHE_KEY}${JSON.stringify(normalized)}`
}

function applySorting(products: Product[], sort?: string): Product[] {
  if (!sort) return products

  const sorted = [...products]

  switch (sort) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'newest':
      return sorted.sort((a, b) => new Date(b.creationAt).getTime() - new Date(a.creationAt).getTime())
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.creationAt).getTime() - new Date(b.creationAt).getTime())
    case 'title_asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'title_desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title))
    default:
      return sorted
  }
}

export const productApi = {
  async getProducts(filters?: FilterParams): Promise<Product[]> {
    const cacheKey = buildProductsCacheKey(filters)
    const cached = cacheManager.get<Product[]>(cacheKey)
    if (cached) return cached

    const params: Record<string, string | number | boolean> = {
      limit: filters?.limit || 12,
      offset: filters?.offset || 0,
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

    // If multiple categories, fetch each one separately and merge
    if (filters?.categoryIds && filters.categoryIds.length > 0) {
      const allProducts: Product[] = []
      const productIds = new Set<number>()

      // Fetch products for each category in parallel
      const requests = filters.categoryIds.map((categoryId) =>
        apiClient.get<Product[]>('/products', { ...params, categoryId })
      )

      const results = await Promise.all(requests)

      // Merge results, removing duplicates by product ID
      for (const products of results) {
        for (const product of products) {
          if (!productIds.has(product.id)) {
            productIds.add(product.id)
            allProducts.push(product)
          }
        }
      }

      const sortedProducts = applySorting(allProducts, filters?.sort)
      cacheManager.set(cacheKey, sortedProducts)
      return sortedProducts
    }

    // No category filter, fetch all products with pagination
    const products = await apiClient.get<Product[]>('/products', params)
    const sortedProducts = applySorting(products, filters?.sort)
    cacheManager.set(cacheKey, sortedProducts)
    return sortedProducts
  },

  async getProduct(id: string | number): Promise<Product> {
    const cacheKey = `${PRODUCT_CACHE_KEY}${id}`
    const cached = cacheManager.get<Product>(cacheKey)
    if (cached) return cached

    const product = await apiClient.get<Product>(`/products/${id}`)
    cacheManager.set(cacheKey, product)
    return product
  },

  async getCategories(): Promise<Category[]> {
    const cached = cacheManager.get<Category[]>(CATEGORIES_CACHE_KEY)
    if (cached) return cached

    const categories = await apiClient.get<Category[]>('/categories')
    cacheManager.set(CATEGORIES_CACHE_KEY, categories, 60 * 60 * 1000) // 1 hour
    return categories
  },
}
