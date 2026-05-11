import { FilterPanel } from './FilterPanel'
import type { Category } from '../types'

interface FilterDrawerProps {
  open: boolean
  onClose: () => void
  categories: Category[] | null
  selectedCategoryId?: number
  onToggleCategory: (categoryId: number) => void
  onClearFilters: () => void
  loading: boolean
}

export function FilterDrawer({
  open,
  onClose,
  categories,
  selectedCategoryId,
  onToggleCategory,
  onClearFilters,
  loading,
}: FilterDrawerProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        aria-label="Close filters"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      <div className="absolute left-0 top-0 h-full w-[86vw] max-w-sm overflow-y-auto bg-white p-4 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-600"
          >
            Close
          </button>
        </div>

        <FilterPanel
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onToggleCategory={onToggleCategory}
          onClearFilters={onClearFilters}
          loading={loading}
        />
      </div>
    </div>
  )
}