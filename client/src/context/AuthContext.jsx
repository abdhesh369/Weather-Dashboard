// client/src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import api, { initCsrf } from '../lib/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check login status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await initCsrf();
        const res = await api.get('/api/user/me');
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        // Not logged in or token expired
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  };

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUnitPreference: async (newUnits) => {
      if (isAuthenticated) {
        try {
          await api.patch('/api/user/preferences', { unitPreference: newUnits });
          setUser(prev => ({ ...prev, unitPreference: newUnits }));
        } catch (err) {
          console.error('Failed to sync preferences:', err);
        }
      }
    }
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};