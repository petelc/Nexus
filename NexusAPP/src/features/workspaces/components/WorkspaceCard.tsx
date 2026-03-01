import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Description as DocumentIcon,
  Code as CodeIcon,
  AccountTree as DiagramIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { WorkspaceDto } from '@/types/api.types';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { setCurrentWorkspace } from '../workspacesSlice';

dayjs.extend(relativeTime);

interface WorkspaceCardProps {
  workspace: WorkspaceDto;
  onEdit?: (workspace: WorkspaceDto) => void;
  onDelete?: (workspaceId: string) => void;
  onSettings?: (workspace: WorkspaceDto) => void;
}

export const WorkspaceCard = ({ workspace, onEdit, onDelete, onSettings }: WorkspaceCardProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentWorkspaceId = useAppSelector((state) => state.workspaces.currentWorkspaceId);
  const currentUserId = useAppSelector((state) => state.auth.user?.userId);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const isCurrentWorkspace = currentWorkspaceId === workspace.workspaceId;
  const isOwner = workspace.createdBy === currentUserId;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCardClick = () => {
    dispatch(setCurrentWorkspace(workspace.workspaceId));
    navigate('/dashboard');
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    onEdit?.(workspace);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    onDelete?.(workspace.workspaceId);
  };

  const handleSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    onSettings?.(workspace);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: isCurrentWorkspace ? 2 : 1,
        borderColor: isCurrentWorkspace ? 'primary.main' : 'divider',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flexGrow: 1, pr: 1 }}>
            <Typography variant="h6" component="h3" noWrap>
              {workspace.name}
            </Typography>
            {isCurrentWorkspace && (
              <Chip label="Current" color="primary" size="small" sx={{ mt: 0.5 }} />
            )}
          </Box>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
            {onSettings && (
              <MenuItem onClick={handleSettings}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>
            )}
            {onEdit && isOwner && (
              <MenuItem onClick={handleEdit}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit</ListItemText>
              </MenuItem>
            )}
            {onDelete && isOwner && (
              <MenuItem onClick={handleDelete}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            )}
          </Menu>
        </Box>

        {workspace.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {workspace.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Tooltip title="Documents">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <DocumentIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {workspace.documentCount}
              </Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Snippets">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CodeIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {workspace.snippetCount}
              </Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Diagrams">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <DiagramIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {workspace.diagramCount}
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Typography variant="caption" color="text.secondary">
          Created {dayjs(workspace.createdAt).fromNow()}
        </Typography>
      </CardActions>
    </Card>
  );
};
