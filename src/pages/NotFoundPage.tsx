import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="py-20">
      <h1 className="text-2xl font-bold">404</h1>
      <p className="text-gray-600 mt-2">Page not found</p>
      <Link to="/" className="text-blue-600 mt-4 inline-block">
        Go back home
      </Link>
    </div>
  )
}