import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const TOKEN_KEY = 'nexgen_admin_token';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setIsLoading(false);
  }, []);

  // Session restoration on mount or when token changes
  const restoreSession = useCallback(async () => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await authService.getCurrentAdmin();
      if (res && res.success && res.data && res.data.admin) {
        setUser(res.data.admin);
        setToken(storedToken);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Session restoration failed:', error?.response?.data?.message || error.message);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Listen for 401 unauthorized events emitted from Axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('nexgen_auth_unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('nexgen_auth_unauthorized', handleUnauthorized);
    };
  }, [logout]);

  // Admin login handler
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await authService.loginAdmin(email, password);
      if (res && res.success && res.data && res.data.token) {
        const newToken = res.data.token;
        const adminUser = res.data.admin;
        localStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);
        setUser(adminUser);
        setIsLoading(false);
        return { success: true, user: adminUser };
      } else {
        setIsLoading(false);
        return { success: false, message: res.message || 'Login failed' };
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage =
        error.response?.data?.message ||
        (error.request ? 'Unable to connect to the server. Please try again.' : 'An error occurred during login.');
      return { success: false, message: errorMessage };
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
