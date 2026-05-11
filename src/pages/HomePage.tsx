import { useState } from 'react'
import { FilterDrawer } from '../components/FilterDrawer'
import { FilterPanel } from '../components/FilterPanel'
import { ProductGrid } from '../components/ProductGrid'
import { ProductSkeletonGrid } from '../components/ProductSkeletonGrid'
import { useCategories, useProducts } from '../hooks/useProducts'
import { useUrlFilters } from '../hooks/useUrlFilters'

export function HomePage() {
  const { filters, toggleCategory, clearFilters, selectedCategoryId } = useUrlFilters()
  const { data: categories, loading: categoriesLoading } = useCategories()
  const { data: products, loading: productsLoading, error: productsError } = useProducts(filters)
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <div>
      {/* Mobile filter button */}
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <h1 className="text-lg font-semibold text-gray-900">Products</h1>
        <button
          onClick={() => setFiltersOpen(true)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Filters
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="hidden lg:block">
            <FilterPanel
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onToggleCategory={toggleCategory}
              onClearFilters={clearFilters}
              loading={categoriesLoading}
            />
          </div>

          <FilterDrawer
            open={filtersOpen}
            onClose={() => setFiltersOpen(false)}
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onToggleCategory={toggleCategory}
            onClearFilters={clearFilters}
            loading={categoriesLoading}
          />
        </aside>

        <main className="min-w-0">
          {productsError && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Error loading products: {productsError.message}
            </div>
          )}

          {productsLoading ? (
            <ProductSkeletonGrid />
          ) : products && products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center text-gray-600">
              No products found
            </div>
          )}
        </main>
      </div>
    </div>
  )
}