import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Wraps any route that requires authentication.
 * Saves the attempted URL so the user is redirected back after login.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-60px)] flex items-center justify-center">
        <div className="skeleton rounded-full" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
