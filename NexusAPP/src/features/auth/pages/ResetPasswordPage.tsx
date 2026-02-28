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
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useResetPasswordMutation } from '../authApi';
import { resetPasswordSchema, ResetPasswordFormData } from '../validation';
import { ROUTE_PATHS } from '../../../routes/routePaths';

export const ResetPasswordPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      return;
    }

    try {
      const response = await resetPassword({
        token,
        ...data,
      }).unwrap();

      setSuccessMessage(response.message || 'Password reset successfully! Redirecting to login...');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate(ROUTE_PATHS.LOGIN);
      }, 2000);
    } catch (err) {
      console.error('Reset password failed:', err);
    }
  };

  if (!token) {
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
            <Alert severity="error">
              Invalid reset token. Please request a new password reset link.
            </Alert>
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Link
                href="#"
                variant="body2"
                sx={{ textDecoration: 'none' }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(ROUTE_PATHS.FORGOT_PASSWORD);
                }}
              >
                Request New Reset Link
              </Link>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

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
              Create a new password
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
              {(error as any)?.data?.message || 'Failed to reset password. Please try again.'}
            </Alert>
          )}

          {!successMessage && (
            <>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                Enter your new password below.
              </Typography>

              {/* Reset Password Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="New Password"
                      type="password"
                      margin="normal"
                      autoFocus
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
                      label="Confirm New Password"
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
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              </form>
            </>
          )}

          {/* Back to Login */}
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
              Back to Sign In
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
