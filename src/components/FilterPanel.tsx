import { RangeSlider } from './RangeSlider'
import type { Category, SortOption } from '../types'

interface FilterPanelProps {
  categories: Category[] | null
  categoryIds: number[]
  onToggleCategory: (categoryId: number) => void
  onClearFilters: () => void
  loading: boolean
  priceMin?: number
  priceMax?: number
  onPriceChange: (min?: number, max?: number) => void
  sort?: SortOption
  onSortChange: (sort: SortOption | undefined) => void
}

const MIN_PRICE = 0
const MAX_PRICE = 1000

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'title_asc', label: 'Name: A to Z' },
  { value: 'title_desc', label: 'Name: Z to A' },
]

export function FilterPanel({
  categories,
  categoryIds,
  onToggleCategory,
  onClearFilters,
  loading,
  priceMin,
  priceMax,
  onPriceChange,
  sort,
  onSortChange,
}: FilterPanelProps) {
  const hasActiveFilters = categoryIds.length > 0 || priceMin || priceMax || sort

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm h-fit lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
          Filters & Sort
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-600 underline decoration-gray-300 underline-offset-4 transition hover:text-gray-900"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Sorting Section */}
        <div>
          <label
            htmlFor="product-sort"
            className="mb-3 block text-xs font-semibold uppercase tracking-wide text-gray-600"
          >
            Sort By
          </label>
          <select
            id="product-sort"
            value={sort || ''}
            onChange={(e) => onSortChange(e.target.value ? (e.target.value as SortOption) : undefined)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          >
            <option value="">Default</option>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Categories Section */}
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
            Categories
          </h4>
          {loading ? (
            <p className="text-sm text-gray-500">Loading categories...</p>
          ) : categories && categories.length > 0 ? (
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={categoryIds.includes(category.id)}
                    onChange={() => onToggleCategory(category.id)}
                    className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No categories available</p>
          )}
        </div>

        {/* Price Range Section */}
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
            Price Range
          </h4>
          <RangeSlider
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={10}
            minValue={priceMin || MIN_PRICE}
            maxValue={priceMax || MAX_PRICE}
            onMinChange={(min) => onPriceChange(min, priceMax)}
            onMaxChange={(max) => onPriceChange(priceMin, max)}
          />
        </div>
      </div>
    </div>
  )
}
