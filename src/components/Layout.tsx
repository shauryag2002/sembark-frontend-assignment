import { NavLink, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-300 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <NavLink to="/" className="text-xl font-bold">
            Store
          </NavLink>

          <nav className="flex gap-4">
            <NavLink to="/" className={({ isActive }) => isActive ? 'font-bold text-gray-900' : 'text-gray-600'}>
              Home
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => isActive ? 'font-bold text-gray-900' : 'text-gray-600'}>
              Cart
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