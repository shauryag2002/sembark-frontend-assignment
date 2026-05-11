import { createContext, useContext, useReducer, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Product } from '../types'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_FROM_STORAGE'; payload: CartState }

interface CartContextType {
  state: CartState
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = 'ecommerce_cart'

const initialState: CartState = {
  items: [],
  total: 0,
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.product.id
      )

      let newItems: CartItem[]
      if (existingItem) {
        newItems = state.items.map((item) =>
          item.product.id === action.payload.product.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
      } else {
        newItems = [...state.items, { product: action.payload.product, quantity: action.payload.quantity }]
      }

      return {
        items: newItems,
        total: calculateTotal(newItems),
      }
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter((item) => item.product.id !== action.payload.productId)
      return {
        items: newItems,
        total: calculateTotal(newItems),
      }
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map((item) =>
        item.product.id === action.payload.productId
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter((item) => item.quantity > 0)

      return {
        items: newItems,
        total: calculateTotal(newItems),
      }
    }

    case 'CLEAR_CART': {
      return initialState
    }

    case 'LOAD_FROM_STORAGE': {
      return action.payload
    }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const cartData = JSON.parse(stored) as CartState
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: cartData })
      } catch {
        // Ignore invalid stored data
      }
    }
  }, [])

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value: CartContextType = {
    state,
    addToCart: (product: Product, quantity: number) =>
      dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } }),
    removeFromCart: (productId: number) =>
      dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } }),
    updateQuantity: (productId: number, quantity: number) =>
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
