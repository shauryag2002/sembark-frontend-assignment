import { useEffect, useRef } from 'react'
import type { Product } from '../types'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  hasMore: boolean
  isLoadingMore: boolean
  onLoadMore: () => void
}

export function ProductGrid({ products, hasMore, isLoadingMore, onLoadMore }: ProductGridProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasMore || isLoadingMore) return

    // Use Intersection Observer for infinite scroll
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore()
        }
      },
      { threshold: 0.1, rootMargin: '200px 0px' }
    )

    const element = loadMoreRef.current
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) observer.unobserve(element)
      observer.disconnect()
    }
  }, [hasMore, isLoadingMore, onLoadMore])

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Sentinel element for infinite scroll */}
      <div
        ref={loadMoreRef}
        className="mt-8 flex justify-center py-8"
        aria-hidden="true"
      >
        {hasMore && isLoadingMore && (
          <div className="space-y-2 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
            <p className="text-sm text-gray-600">Loading more products...</p>
          </div>
        )}
      </div>

      {products.length === 0 && !hasMore && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
          <p className="text-gray-600">No products found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  )
}
