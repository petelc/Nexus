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
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useRegisterMutation } from '../authApi';
import { registerSchema, RegisterFormData } from '../validation';
import { ROUTE_PATHS } from '../../../routes/routePaths';

export const RegisterPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [register, { isLoading, error }] = useRegisterMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data).unwrap();
      setSuccessMessage('Account created successfully! Redirecting to login...');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate(ROUTE_PATHS.LOGIN);
      }, 2000);
    } catch (err) {
      // Error is handled by RTK Query
      console.error('Registration failed:', err);
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
        py: 4,
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
              Create your account
            </Typography>
          </Box>

          {/* Success Alert */}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {(error as any)?.data?.message || 'Registration failed. Please try again.'}
            </Alert>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="First Name"
                    margin="normal"
                    autoFocus
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    disabled={isLoading}
                  />
                )}
              />
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Last Name"
                    margin="normal"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    disabled={isLoading}
                  />
                )}
              />
            </Box>

            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Username"
                  margin="normal"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  disabled={isLoading}
                />
              )}
            />

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

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  margin="normal"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  disabled={isLoading}
                />
              )}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link
                href="#"
                variant="body2"
                sx={{ textDecoration: 'none' }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(ROUTE_PATHS.LOGIN);
                }}
              >
                Already have an account? Sign In
              </Link>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};
