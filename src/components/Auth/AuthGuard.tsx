import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingScreen } from '../LoadingScreen';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component that protects routes requiring authentication
 * Redirects unauthenticated users to the register page
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading, session, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if not loading and not authenticated
    if (!loading && !isAuthenticated) {
      // Store the attempted route for redirect after login
      const currentPath = location.pathname + location.search;
      if (currentPath !== '/register') {
        sessionStorage.setItem('authRedirect', currentPath);
      }
      navigate('/register', { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  // Additional check for broken auth state
  useEffect(() => {
    // If we have a user but no session, or vice versa, something is wrong
    if (!loading && ((user && !session) || (!user && session))) {
      console.warn('Detected broken auth state - user and session mismatch');
      // Force redirect to register to reset auth state
      navigate('/register', { replace: true });
    }
  }, [user, session, loading, navigate]);

  // Show loading while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // Don't render protected content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

/**
 * PublicGuard component for routes that should be accessible to all users
 * Since there are no authenticated routes yet, this just shows the content
 */
export function PublicGuard({ children }: AuthGuardProps) {
  const { loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // Render content for all users (no redirect logic since there are no authenticated routes)
  return <>{children}</>;
}
