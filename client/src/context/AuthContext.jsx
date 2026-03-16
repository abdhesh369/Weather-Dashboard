import React, { createContext, useState, useEffect } from 'react';
import api, { initCsrf } from '../lib/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await initCsrf();
        const res = await api.get('/api/user/me');
        setUser(res.data);
        setIsAuthenticated(true);
      } catch {
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
    try { await api.post('/api/auth/logout'); } catch { /* silent */ }
    finally {
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
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {isLoading ? (
        <div
          className="min-h-screen flex flex-col items-center justify-center gap-4"
          style={{ background: 'var(--bg-default)' }}
        >
          {/* Animated logo */}
          <div
            className="w-14 h-14 rounded-[18px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', animation: 'skeleton-pulse 1.6s ease-in-out infinite' }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
            </svg>
          </div>
          <span className="text-[14px] font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Loading SkyCast…
          </span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
