import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Typography,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { logout } from '@features/auth/authSlice';
import { ROUTE_PATHS } from '../../routes/routePaths';
import { WorkspaceSelector } from '@features/workspaces/components/WorkspaceSelector';

const SIDEBAR_WIDTH = 270;

interface HeaderProps {
  onThemeToggle: () => void;
}

export const Header = ({ onThemeToggle }: HeaderProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate(ROUTE_PATHS.LOGIN);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    const firstInitial = user.firstName?.charAt(0) || '';
    const lastInitial = user.lastName?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase() || user.username?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        ml: `${SIDEBAR_WIDTH}px`,
        backgroundColor: theme.palette.background.paper,
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ minHeight: '64px !important' }}>
        {/* Search Bar */}
        <Box
          sx={{
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: alpha(theme.palette.mode === 'dark' ? '#fff' : '#000', 0.05),
            '&:hover': {
              backgroundColor: alpha(theme.palette.mode === 'dark' ? '#fff' : '#000', 0.08),
            },
            marginRight: 2,
            width: '100%',
            maxWidth: 400,
            transition: 'all 150ms ease-in-out',
          }}
        >
          <Box
            sx={{
              padding: theme.spacing(0, 2),
              height: '100%',
              position: 'absolute',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SearchIcon sx={{ color: theme.palette.text.secondary }} />
          </Box>
          <InputBase
            placeholder="Search documents, snippets, diagrams..."
            sx={{
              color: 'inherit',
              width: '100%',
              '& .MuiInputBase-input': {
                padding: theme.spacing(1.25, 1, 1.25, 0),
                paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                fontSize: '0.9rem',
              },
            }}
          />
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Workspace Selector */}
        <WorkspaceSelector />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2 }}>
          {/* Theme Toggle */}
          <Tooltip title={theme.palette.mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
            <IconButton onClick={onThemeToggle} color="inherit" sx={{ color: theme.palette.text.secondary }}>
              {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit" sx={{ color: theme.palette.text.secondary }}>
              <NotificationsIcon />
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Tooltip title="Account">
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{ ml: 1 }}
              aria-controls={menuOpen ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? 'true' : undefined}
            >
              <Avatar
                src={user?.avatarUrl}
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: theme.palette.primary.main,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                {getUserInitials()}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* User Menu Dropdown */}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={menuOpen}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                mt: 1.5,
                minWidth: 200,
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1.5,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email || 'user@example.com'}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
