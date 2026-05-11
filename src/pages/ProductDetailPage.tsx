import { Link, useParams } from 'react-router-dom'

export function ProductDetailPage() {
  const { id } = useParams()

  return (
    <div>
      <Link to="/" className="text-blue-600 text-sm mb-4 inline-block">
        ← Back
      </Link>

      <div className="border border-gray-300 p-6 max-w-2xl">
        <p className="text-sm text-gray-500">Product</p>
        <h1 className="text-2xl font-bold mt-2">Product #{id}</h1>
        <p className="text-gray-600 mt-4">
          Product details will load here from the API.
        </p>

        <div className="mt-6 space-y-2">
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 text-sm font-medium block"
          >
            Add to Cart
          </button>
          <p className="text-xs text-gray-500">Route: /product/{id}</p>
        </div>
      </div>
    </div>
  )
}