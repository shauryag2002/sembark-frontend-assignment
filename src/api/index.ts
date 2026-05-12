import { apiClient } from './client'
import type { Category, Product, FilterParams } from '../types'
import { cacheManager } from '../utils/cache'

const CATEGORIES_CACHE_KEY = 'categories'
const PRODUCT_CACHE_KEY = 'product_'
const PRODUCTS_CACHE_KEY = 'products_'
const DEFAULT_PAGE_SIZE = 12

type ProductQueryParams = Record<string, string | number | boolean>

function buildProductsCacheKey(filters?: FilterParams): string {
  if (!filters) return `${PRODUCTS_CACHE_KEY}default`

  const normalized = {
    ...filters,
    categoryIds: filters.categoryIds ? [...filters.categoryIds].sort((a, b) => a - b) : undefined,
  }

  return `${PRODUCTS_CACHE_KEY}${JSON.stringify(normalized)}`
}

function buildBaseProductQueryParams(filters?: FilterParams): ProductQueryParams {
  const queryParams: ProductQueryParams = {
    limit: filters?.limit || DEFAULT_PAGE_SIZE,
    offset: filters?.offset || 0,
  }

  if (filters?.priceMin) queryParams.price_min = filters.priceMin
  if (filters?.priceMax) queryParams.price_max = filters.priceMax
  if (filters?.title) queryParams.title = filters.title

  return queryParams
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

function mergeUniqueProducts(productGroups: Product[][]): Product[] {
  const uniqueProducts: Product[] = []
  const seenProductIds = new Set<number>()

  for (const products of productGroups) {
    for (const product of products) {
      if (!seenProductIds.has(product.id)) {
        seenProductIds.add(product.id)
        uniqueProducts.push(product)
      }
    }
  }

  return uniqueProducts
}

async function fetchProductsByCategories(
  categoryIds: number[],
  baseQueryParams: ProductQueryParams
): Promise<Product[]> {
  const categoryRequests = categoryIds.map((categoryId) =>
    apiClient.get<Product[]>('/products', { ...baseQueryParams, categoryId })
  )

  const productsByCategory = await Promise.all(categoryRequests)
  return mergeUniqueProducts(productsByCategory)
}

function getCachedProducts(filters?: FilterParams): Product[] | null {
  return cacheManager.get<Product[]>(buildProductsCacheKey(filters))
}

function cacheProducts(filters: FilterParams | undefined, products: Product[]): void {
  cacheManager.set(buildProductsCacheKey(filters), products)
}

export const productApi = {
  async getProducts(filters?: FilterParams): Promise<Product[]> {
    const cachedProducts = getCachedProducts(filters)
    if (cachedProducts) return cachedProducts

    const baseQueryParams = buildBaseProductQueryParams(filters)
    const selectedCategoryIds = filters?.categoryIds

    const fetchedProducts =
      selectedCategoryIds && selectedCategoryIds.length > 0
        ? await fetchProductsByCategories(selectedCategoryIds, baseQueryParams)
        : await apiClient.get<Product[]>('/products', baseQueryParams)

    const sortedProducts = applySorting(fetchedProducts, filters?.sort)
    cacheProducts(filters, sortedProducts)
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
