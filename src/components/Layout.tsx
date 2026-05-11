import { NavLink, Outlet } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export function Layout() {
  const { state } = useCart()
  const cartItemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-300 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <NavLink to="/" className="text-xl font-bold">
            Store
          </NavLink>

          <nav className="flex gap-4 items-center">
            <NavLink to="/" className={({ isActive }) => isActive ? 'font-bold text-gray-900' : 'text-gray-600'}>
              Home
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => 
              `relative inline-block ${isActive ? 'font-bold text-gray-900' : 'text-gray-600'}`
            }>
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}