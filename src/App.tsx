import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CartPage } from './pages/CartPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProductDetailPage } from './pages/ProductDetailPage'

function RootLayout() {
  return <Layout />
}

function AppRoot() {
  return <Outlet />
}

export const router = createBrowserRouter([
  {
    element: <AppRoot />,
    children: [
      {
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'product/:id',
            element: <ProductDetailPage />,
          },
          {
            path: 'cart',
            element: <CartPage />,
          },
        ],
      },
      {
        path: '404',
        element: <NotFoundPage />,
      },
      {
        path: '*',
        element: <Navigate to="/404" replace />,
      },
    ],
  },
])
