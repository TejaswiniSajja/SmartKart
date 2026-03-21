import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem('smartkart_user')) || null,
  isAuthenticated: !!localStorage.getItem('smartkart_user'),
  loading: false,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, loading: false, user: action.payload, isAuthenticated: true, error: null };
    case 'AUTH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, error: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('smartkart_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('smartkart_user');
    }
  }, [state.user]);

  const login = (userData) => {
    dispatch({ type: 'AUTH_SUCCESS', payload: userData });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const setLoading = (val) => {
    dispatch({ type: val ? 'AUTH_START' : 'CLEAR_ERROR' });
  };

  const setError = (msg) => {
    dispatch({ type: 'AUTH_ERROR', payload: msg });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, setLoading, setError, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
