import type { Category } from '../types'

interface FilterPanelProps {
  categories: Category[] | null
  selectedCategoryId?: number
  onToggleCategory: (categoryId: number) => void
  onClearFilters: () => void
  loading: boolean
}

export function FilterPanel({
  categories,
  selectedCategoryId,
  onToggleCategory,
  onClearFilters,
  loading,
}: FilterPanelProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
          Filters
        </h3>
        {selectedCategoryId && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-600 underline decoration-gray-300 underline-offset-4 transition hover:text-gray-900"
          >
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading categories...</p>
      ) : categories && categories.length > 0 ? (
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedCategoryId === category.id}
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
  )
}
