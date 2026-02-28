import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { updateUser } from '@features/auth/authSlice';
import { useGetCurrentUserQuery } from '@features/auth/authApi';
import { ROUTE_PATHS } from './routePaths';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Rehydrate user from API after a page refresh:
  // token is in localStorage so isAuthenticated is true, but Redux user is null.
  const { data: currentUser, isLoading } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated || !!user,
  });

  useEffect(() => {
    if (currentUser) {
      dispatch(updateUser(currentUser));
    }
  }, [currentUser, dispatch]);

  if (!isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.LOGIN} replace state={{ from: location.pathname }} />;
  }

  // Show spinner while rehydrating user on first load after refresh
  if (!user && isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};
