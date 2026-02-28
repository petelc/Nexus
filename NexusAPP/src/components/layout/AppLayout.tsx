import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const HEADER_HEIGHT = 64;

interface AppLayoutProps {
  onThemeToggle: () => void;
}

export const AppLayout = ({ onThemeToggle }: AppLayoutProps) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
        }}
      >
        {/* Header */}
        <Header onThemeToggle={onThemeToggle} />

        {/* Page Content */}
        <Box
          sx={{
            mt: `${HEADER_HEIGHT}px`,
            px: 3,
            py: 3,
            maxWidth: '1400px',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
