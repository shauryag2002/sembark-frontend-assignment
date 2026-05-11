import { Link } from 'react-router-dom'

const sampleProducts = [
  { id: 1, title: 'Basic Tee', price: '$24', category: 'Clothing' },
  { id: 2, title: 'Canvas Backpack', price: '$48', category: 'Accessories' },
  { id: 3, title: 'Everyday Sneakers', price: '$72', category: 'Shoes' },
]

export function HomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Products</h1>
      <p className="text-gray-600 mb-6">Browse our collection</p>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sampleProducts.map((product) => (
          <div key={product.id} className="border border-gray-300 p-4">
            <p className="text-sm text-gray-500">{product.category}</p>
            <h2 className="text-lg font-bold mt-1">{product.title}</h2>
            <p className="text-gray-600 text-sm mt-2">Product description here</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="font-bold">{product.price}</span>
              <Link
                to={`/product/${product.id}`}
                className="bg-blue-600 text-white px-3 py-1 text-sm"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}