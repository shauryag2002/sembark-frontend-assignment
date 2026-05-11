import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useProduct } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  
  const productId = id ? parseInt(id, 10) : 0
  const { data: product, loading, error } = useProduct(productId)
  const { addToCart } = useCart()

  useEffect(() => {
    if (addedToCart) {
      const timer = setTimeout(() => setAddedToCart(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [addedToCart])

  if (loading) {
    return (
      <div>
        <Link to="/" className="text-gray-600 text-sm mb-4 inline-block hover:text-gray-900">
          ← Back
        </Link>

        <div className="grid gap-6 lg:grid-cols-2 animate-pulse">
          <div className="bg-gray-200 aspect-square rounded-lg" />
          <div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="space-y-2 mb-6">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Link to="/" className="text-gray-600 text-sm mb-4 inline-block hover:text-gray-900">
          ← Back
        </Link>

        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <p className="text-red-700 font-medium">Error loading product</p>
          <p className="text-red-600 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div>
        <Link to="/" className="text-gray-600 text-sm mb-4 inline-block hover:text-gray-900">
          ← Back
        </Link>

        <div className="rounded-lg border border-gray-300 bg-gray-50 p-6">
          <p className="text-gray-700 text-center">Product not found</p>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAddedToCart(true)
  }

  return (
    <div>
      <Link to="/" className="text-gray-600 text-sm mb-6 inline-block hover:text-gray-900">
        ← Back to Products
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div>
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-auto bg-gray-100 rounded-lg object-cover aspect-square"
            />
          ) : (
            <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No image</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
            {product.category?.name || 'Uncategorized'}
          </p>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.title}
          </h1>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-3xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <p className="text-gray-600 text-base leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 font-medium"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center py-2 border-l border-r border-gray-300 font-medium"
                min="1"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 font-medium"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="space-y-3 mb-8">
            <button
              onClick={handleAddToCart}
              className="w-full bg-gray-900 text-white py-3 font-medium rounded-lg hover:bg-gray-800 transition"
            >
              {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
            </button>

            {addedToCart && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/cart')}
                  className="flex-1 border border-gray-900 text-gray-900 py-3 font-medium rounded-lg hover:bg-gray-900 hover:text-white transition"
                >
                  View Cart
                </button>
              </div>
            )}
          </div>

          {/* Product Meta */}
          <div className="border-t border-gray-200 pt-6 space-y-2 text-sm">
            <p className="text-gray-600">
              <span className="font-medium text-gray-900">SKU:</span> {product.id}
            </p>
            {product.category && (
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Category:</span> {product.category.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}