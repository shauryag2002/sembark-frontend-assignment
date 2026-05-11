import { Link } from 'react-router-dom'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      {product.images && product.images.length > 0 ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-gray-100 text-sm text-gray-400">
          No image
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs text-gray-500">
          <span className="rounded-full bg-gray-100 px-2.5 py-1">{product.category.name}</span>
          <span>#{product.id}</span>
        </div>

        <h3 className="text-base font-semibold leading-6 text-gray-900 line-clamp-2">
          {product.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="text-lg font-semibold text-gray-900">${product.price}</span>
          <Link
            to={`/product/${product.id}`}
            className="inline-flex items-center rounded-full border border-gray-900 px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-900 hover:text-white"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  )
}