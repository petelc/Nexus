import { Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, useTheme } from '@mui/material';
import { AdminPanelSettings as AdminIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@app/hooks';
import { navigationConfig } from '@utils/navigation';
import { ROUTE_PATHS } from '@routes/routePaths';

const SIDEBAR_WIDTH = 270;

export const Sidebar = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.roles?.includes('Admin') ?? false;

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Icon - Connection Node */}
        <Box
          sx={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Simple connection node representation */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="4" fill={theme.palette.primary.main} />
            <line x1="16" y1="4" x2="16" y2="12" stroke={theme.palette.primary.main} strokeWidth="2" />
            <line x1="28" y1="16" x2="20" y2="16" stroke={theme.palette.primary.main} strokeWidth="2" />
            <line x1="4" y1="16" x2="12" y2="16" stroke={theme.palette.primary.main} strokeWidth="2" />
            <line x1="16" y1="28" x2="16" y2="20" stroke={theme.palette.primary.main} strokeWidth="2" />
            <circle cx="16" cy="4" r="2" fill={theme.palette.primary.main} />
            <circle cx="28" cy="16" r="2" fill={theme.palette.primary.main} />
            <circle cx="4" cy="16" r="2" fill={theme.palette.primary.main} />
            <circle cx="16" cy="28" r="2" fill={theme.palette.primary.main} />
          </svg>
        </Box>

        {/* Logo Text */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: '0.5px',
              color: theme.palette.text.primary,
              lineHeight: 1,
            }}
          >
            NEXUS
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.65rem',
              color: theme.palette.text.secondary,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              lineHeight: 1,
              mt: 0.5,
              display: 'block',
            }}
          >
            Where Knowledge Connects
          </Typography>
        </Box>
      </Box>

      {/* Navigation Items */}
      <Box sx={{ overflow: 'auto', flex: 1, p: 2 }}>
        <List sx={{ p: 0 }}>
          {navigationConfig.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path || '');

            return (
              <ListItemButton
                key={item.id}
                onClick={() => item.path && navigate(item.path)}
                selected={active}
                sx={{
                  borderRadius: '8px',
                  mb: 0.5,
                  px: 2,
                  py: 1.25,
                  transition: 'all 150ms ease-in-out',
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(93, 135, 255, 0.15)'
                      : 'rgba(93, 135, 255, 0.08)',
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(93, 135, 255, 0.2)'
                        : 'rgba(93, 135, 255, 0.12)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                {Icon && (
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: active ? theme.palette.primary.main : theme.palette.text.secondary,
                    }}
                  >
                    <Icon fontSize="small" />
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9375rem',
                    fontWeight: active ? 600 : 500,
                  }}
                />
                {item.badge && (
                  <Box
                    sx={{
                      ml: 1,
                      px: 1,
                      py: 0.25,
                      borderRadius: '12px',
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {item.badge}
                  </Box>
                )}
              </ListItemButton>
            );
          })}
        </List>

        {/* Admin section — visible to Admin role only */}
        {isAdmin && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ px: 2, display: 'block', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              Admin
            </Typography>
            <List sx={{ p: 0 }}>
              <ListItemButton
                onClick={() => navigate(ROUTE_PATHS.ADMIN_USERS)}
                selected={isActive(ROUTE_PATHS.ADMIN_USERS)}
                sx={{
                  borderRadius: '8px',
                  mb: 0.5,
                  px: 2,
                  py: 1.25,
                  transition: 'all 150ms ease-in-out',
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(93, 135, 255, 0.15)'
                      : 'rgba(93, 135, 255, 0.08)',
                    color: theme.palette.primary.main,
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive(ROUTE_PATHS.ADMIN_USERS)
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  }}
                >
                  <AdminIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Users"
                  primaryTypographyProps={{
                    fontSize: '0.9375rem',
                    fontWeight: isActive(ROUTE_PATHS.ADMIN_USERS) ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </List>
          </>
        )}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          v{import.meta.env.VITE_APP_VERSION || '1.0.0'}
        </Typography>
      </Box>
    </Drawer>
  );
};
