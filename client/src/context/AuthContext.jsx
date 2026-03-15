// client/src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../lib/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        setUser(decoded.user);
      } catch (err) {
        console.error('Failed to decode stored token');
        localStorage.removeItem('token');
      }
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    try {
      const decoded = jwtDecode(newToken);
      setUser(decoded.user);
    } catch (err) {
      console.error('Token decoding failed:', err);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    // Clear cookie (if we have access, otherwise server handles it on /logout if implemented)
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const contextValue = {
    token,
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUnitPreference: async (newUnits) => {
      if (isAuthenticated) {
        try {
          await api.patch('/api/user/preferences', { unitPreference: newUnits });
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