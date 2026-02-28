import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Link,
  useTheme,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useLoginMutation } from '../authApi';
import { loginSchema, LoginFormData } from '../validation';
import { useAppDispatch } from '@app/hooks';
import { setCredentials } from '../authSlice';
import { ROUTE_PATHS } from '../../../routes/routePaths';

export const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [login, { isLoading, error }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data).unwrap();
      dispatch(setCredentials(response));

      // Redirect to the page they tried to access or dashboard
      const from = (location.state as any)?.from || ROUTE_PATHS.DASHBOARD;
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by RTK Query
      console.error('Login failed:', err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: theme.shape.borderRadius,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              NEXUS
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Where Knowledge Connects
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {(error as any)?.data?.message || 'Invalid email or password. Please try again.'}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email"
                  type="email"
                  margin="normal"
                  autoFocus
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isLoading}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={isLoading}
                />
              )}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} color="primary" />}
                    label="Remember me"
                    disabled={isLoading}
                  />
                )}
              />

              <Link
                href="#"
                variant="body2"
                sx={{ textDecoration: 'none' }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(ROUTE_PATHS.FORGOT_PASSWORD);
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link
                href="#"
                variant="body2"
                sx={{ textDecoration: 'none' }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(ROUTE_PATHS.REGISTER);
                }}
              >
                Don't have an account? Sign Up
              </Link>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};
