import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
  items: JSON.parse(localStorage.getItem('smartkart_cart')) || [],
  wishlist: JSON.parse(localStorage.getItem('smartkart_wishlist')) || [],
  recentlyViewed: JSON.parse(localStorage.getItem('smartkart_recent')) || [],
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const exists = state.items.find(i => i.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
      };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id
            ? { ...i, quantity: Math.max(1, action.payload.quantity) }
            : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_WISHLIST': {
      const inWishlist = state.wishlist.find(i => i.id === action.payload.id);
      return {
        ...state,
        wishlist: inWishlist
          ? state.wishlist.filter(i => i.id !== action.payload.id)
          : [...state.wishlist, action.payload],
      };
    }
    case 'ADD_RECENTLY_VIEWED': {
      const filtered = state.recentlyViewed.filter(i => i.id !== action.payload.id);
      return {
        ...state,
        recentlyViewed: [action.payload, ...filtered].slice(0, 8),
      };
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    localStorage.setItem('smartkart_cart', JSON.stringify(state.items));
  }, [state.items]);

  useEffect(() => {
    localStorage.setItem('smartkart_wishlist', JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  useEffect(() => {
    localStorage.setItem('smartkart_recent', JSON.stringify(state.recentlyViewed));
  }, [state.recentlyViewed]);

  const addToCart = (product, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } });
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleWishlist = (product) => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
  };

  const addRecentlyViewed = (product) => {
    dispatch({ type: 'ADD_RECENTLY_VIEWED', payload: product });
  };

  const isInWishlist = (id) => state.wishlist.some(i => i.id === id);

  const cartTotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      ...state, addToCart, removeFromCart, updateQuantity, clearCart,
      toggleWishlist, addRecentlyViewed, isInWishlist, cartTotal, cartCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
