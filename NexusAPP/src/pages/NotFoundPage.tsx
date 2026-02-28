import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon } from '@mui/icons-material';
import { ROUTE_PATHS } from '../routes/routePaths';

export const NotFoundPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

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
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Typography variant="h1" fontWeight={700} color="primary" sx={{ fontSize: '8rem', mb: 2 }}>
          404
        </Typography>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          onClick={() => navigate(ROUTE_PATHS.DASHBOARD)}
        >
          Go to Dashboard
        </Button>
      </Container>
    </Box>
  );
};
