import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export function CartPage() {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart()

  if (state.items.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-gray-700 text-lg font-medium mb-2">Your cart is empty</p>
          <p className="text-gray-500 mb-6">Add some products to get started!</p>
          <Link
            to="/"
            className="inline-block rounded-lg bg-gray-900 px-6 py-2 text-white font-medium hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {state.items.map((item) => (
              <div
                key={item.product.id}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
                    {/* Product Image */}
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-20 sm:w-20">
                      {item.product.images && item.product.images.length > 0 && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 break-words">
                        {item.product.title}
                      </h3>
                      <p className="mb-2 text-sm text-gray-500">
                        {item.product.category?.name || 'Uncategorized'}
                      </p>
                      <p className="text-base font-semibold text-gray-900 sm:text-lg">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        ${item.product.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-start">
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="min-w-8 px-3 py-1 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6 lg:sticky lg:top-20">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${state.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">$0.00</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-semibold mb-6">
              <span>Total</span>
              <span>${state.total.toFixed(2)}</span>
            </div>

            <button
              className="w-full rounded-lg bg-gray-900 text-white py-2 font-medium hover:bg-gray-800 mb-3"
            >
              Checkout
            </button>

            <button
              onClick={() => clearCart()}
              className="w-full text-sm text-red-600 hover:text-red-700 font-medium py-2"
            >
              Clear Cart
            </button>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                to="/"
                className="block text-center text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
