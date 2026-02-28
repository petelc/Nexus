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
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useForgotPasswordMutation } from '../authApi';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../validation';
import { ROUTE_PATHS } from '../../../routes/routePaths';

export const ForgotPasswordPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await forgotPassword(data).unwrap();
      setSuccessMessage(response.message || 'Password reset instructions sent to your email.');
    } catch (err) {
      console.error('Forgot password failed:', err);
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
              Reset your password
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
              {(error as any)?.data?.message || 'Failed to send reset email. Please try again.'}
            </Alert>
          )}

          {!successMessage && (
            <>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                Enter your email address and we'll send you instructions to reset your password.
              </Typography>

              {/* Forgot Password Form */}
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

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={isLoading}
                  sx={{ mt: 3, mb: 2 }}
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                </Button>
              </form>
            </>
          )}

          {/* Back to Login */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link
              href="#"
              variant="body2"
              sx={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
              onClick={(e) => {
                e.preventDefault();
                navigate(ROUTE_PATHS.LOGIN);
              }}
            >
              <ArrowBackIcon fontSize="small" />
              Back to Sign In
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
