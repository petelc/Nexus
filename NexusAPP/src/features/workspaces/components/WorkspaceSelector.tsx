import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  CircularProgress,
  alpha,
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  ViewModule as ViewModuleIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMyWorkspacesQuery } from '@api/workspacesApi';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { setCurrentWorkspace, setShowCreateDialog } from '../workspacesSlice';
import { ROUTE_PATHS } from '@routes/routePaths';

export const WorkspaceSelector = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentWorkspaceId = useAppSelector((state) => state.workspaces.currentWorkspaceId);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const { data: workspaces, isLoading } = useGetMyWorkspacesQuery({});

  const currentWorkspace = workspaces?.find((w) => w.workspaceId === currentWorkspaceId);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleWorkspaceSelect = (workspaceId: string) => {
    dispatch(setCurrentWorkspace(workspaceId));
    handleMenuClose();
  };

  const handleCreateNew = () => {
    handleMenuClose();
    dispatch(setShowCreateDialog(true));
  };

  const handleViewAll = () => {
    handleMenuClose();
    navigate(ROUTE_PATHS.WORKSPACES);
  };

  return (
    <>
      <Button
        onClick={handleMenuOpen}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          color: 'text.primary',
          textTransform: 'none',
          px: 2,
          py: 1,
          borderRadius: 2,
          '&:hover': {
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
          },
        }}
      >
        {isLoading ? (
          <CircularProgress size={16} />
        ) : currentWorkspace ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', lineHeight: 1 }}>
              Workspace
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
              {currentWorkspace.name}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2">Select Workspace</Typography>
        )}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 280,
            maxHeight: 400,
          },
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : workspaces && workspaces.length > 0 ? (
          [
            <Box key="header" sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                MY WORKSPACES
              </Typography>
            </Box>,
            ...workspaces.map((workspace) => (
              <MenuItem
                key={workspace.workspaceId}
                onClick={() => handleWorkspaceSelect(workspace.workspaceId)}
                selected={workspace.workspaceId === currentWorkspaceId}
              >
                <ListItemIcon>
                  {workspace.workspaceId === currentWorkspaceId ? (
                    <CheckCircleIcon fontSize="small" color="primary" />
                  ) : (
                    <Box sx={{ width: 20 }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={workspace.name}
                  secondary={workspace.description}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: workspace.workspaceId === currentWorkspaceId ? 600 : 400,
                  }}
                  secondaryTypographyProps={{
                    variant: 'caption',
                    noWrap: true,
                  }}
                />
              </MenuItem>
            )),
            <Divider key="divider" sx={{ my: 1 }} />,
          ]
        ) : (
          [
            <Box key="empty" sx={{ px: 2, py: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No workspaces yet
              </Typography>
            </Box>,
            <Divider key="divider" />,
          ]
        )}

        <MenuItem onClick={handleViewAll}>
          <ListItemIcon>
            <ViewModuleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="View All Workspaces" />
        </MenuItem>

        <MenuItem onClick={handleCreateNew}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Create Workspace" />
        </MenuItem>
      </Menu>
    </>
  );
};
