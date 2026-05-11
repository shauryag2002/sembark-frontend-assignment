export function ProductSkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="mb-4 h-44 rounded-xl bg-gray-100" />
          <div className="h-3 w-24 rounded bg-gray-100" />
          <div className="mt-3 h-5 w-4/5 rounded bg-gray-100" />
          <div className="mt-2 h-4 w-full rounded bg-gray-100" />
          <div className="mt-2 h-4 w-5/6 rounded bg-gray-100" />
          <div className="mt-4 flex items-center justify-between">
            <div className="h-5 w-16 rounded bg-gray-100" />
            <div className="h-9 w-16 rounded-full bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  )
}