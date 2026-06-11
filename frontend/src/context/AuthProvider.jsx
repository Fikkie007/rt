import { useState, useEffect, useCallback, useRef } from 'react';
import { AuthContext } from './authContext';
import api, { fetchCsrfToken } from '../lib/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const mountedRef = useRef(false);

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get('/api/user');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      fetchUser();
    }
  }, [fetchUser]);

  const login = async (email, password) => {
    try {
      await fetchCsrfToken();
      await api.post('/login', { email, password });
      await fetchUser();
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message;
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    await fetchCsrfToken();
    await api.post('/logout');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}