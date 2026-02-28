import { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { createAppTheme } from '@theme';
import { createAppRouter } from './routes';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { loadCurrentWorkspace } from '@features/workspaces/workspacesSlice';
import { useGetCurrentUserQuery } from '@features/auth/authApi';
import { updateUser } from '@features/auth/authSlice';

function App() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);

  // Fetch current user when tokens exist but user data is missing (e.g. after page refresh)
  const { data: currentUser } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated || !!user,
  });

  useEffect(() => {
    if (currentUser) {
      dispatch(updateUser(currentUser));
    }
  }, [currentUser, dispatch]);

  // Load theme preference from localStorage
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as 'light' | 'dark') || 'dark';
  });

  // Load current workspace from localStorage on app init
  useEffect(() => {
    dispatch(loadCurrentWorkspace());
  }, [dispatch]);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const router = useMemo(() => createAppRouter({ onThemeToggle: toggleTheme }), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
