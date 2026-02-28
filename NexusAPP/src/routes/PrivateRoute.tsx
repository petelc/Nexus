import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@app/hooks';
import { ROUTE_PATHS } from './routePaths';

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * PrivateRoute component to protect routes that require authentication
 * Redirects to login page if user is not authenticated
 */
export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    // Redirect to login page, preserving the attempted URL
    return <Navigate to={ROUTE_PATHS.LOGIN} replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};
