/**
 * Authentication Context
 * Global auth state management with JWT persistence
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

// ── State ─────────────────────────────────────────────────────────────────────
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

// ── Reducer ───────────────────────────────────────────────────────────────────
function authReducer(state, action) {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ── Initialize auth from localStorage ────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('sage_token');
    const storedUser = localStorage.getItem('sage_user');

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'SET_AUTH', payload: { user, token } });
        // Re-validate token with server
        authService.getMe()
          .then((res) => {
            dispatch({ type: 'UPDATE_USER', payload: res.data.user });
          })
          .catch(() => {
            // Token invalid, log out
            logout();
          });
      } catch {
        logout();
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authService.login({ email, password });
    const { token, user } = res.data;

    localStorage.setItem('sage_token', token);
    localStorage.setItem('sage_user', JSON.stringify(user));
    dispatch({ type: 'SET_AUTH', payload: { token, user } });
    return user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await authService.register({ name, email, password });
    const { token, user } = res.data;

    localStorage.setItem('sage_token', token);
    localStorage.setItem('sage_user', JSON.stringify(user));
    dispatch({ type: 'SET_AUTH', payload: { token, user } });
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sage_token');
    localStorage.removeItem('sage_user');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const updateUser = useCallback((updates) => {
    dispatch({ type: 'UPDATE_USER', payload: updates });
    const user = { ...state.user, ...updates };
    localStorage.setItem('sage_user', JSON.stringify(user));
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
