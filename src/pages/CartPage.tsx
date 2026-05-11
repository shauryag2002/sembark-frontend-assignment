import { Link } from 'react-router-dom'

export function CartPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cart</h1>
      
      <div className="border border-gray-300 p-6 max-w-2xl">
        <p className="text-gray-600">Your cart is empty</p>
        <p className="text-sm text-gray-500 mt-2">Cart state will be added next</p>
      </div>

      <Link
        to="/"
        className="inline-block bg-blue-600 text-white px-4 py-2 text-sm font-medium mt-4"
      >
        Continue shopping
      </Link>
    </div>
  )
}