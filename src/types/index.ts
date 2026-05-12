export interface Category {
  id: number
  name: string
  image: string
  slug: string
  creationAt: string
  updatedAt: string
}

export interface Product {
  id: number
  title: string
  price: number
  description: string
  images: string[]
  category: Category
  slug: string
  creationAt: string
  updatedAt: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
}

export type SortOption = 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'title_asc' | 'title_desc'

export interface FilterParams {
  categoryIds?: number[]
  priceMin?: number
  priceMax?: number
  title?: string
  limit?: number
  offset?: number
  sort?: SortOption
}
