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
  People as PeopleIcon,
  WorkOutline as WorkspaceIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { TeamDto } from '@/types/api.types';
import { useAppSelector } from '@app/hooks';

dayjs.extend(relativeTime);

interface TeamCardProps {
  team: TeamDto;
  onEdit?: (team: TeamDto) => void;
  onDelete?: (teamId: string) => void;
  onManageMembers?: (team: TeamDto) => void;
}

export const TeamCard = ({ team, onEdit, onDelete, onManageMembers }: TeamCardProps) => {
  const currentUserId = useAppSelector((state) => state.auth.user?.userId);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const isOwner = team.createdBy === currentUserId;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    onEdit?.(team);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    onDelete?.(team.id);
  };

  const handleManageMembers = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    onManageMembers?.(team);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={() => onManageMembers?.(team)}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flexGrow: 1, pr: 1 }}>
            <Typography variant="h6" component="h3" noWrap>
              {team.name}
            </Typography>
            {isOwner && (
              <Chip label="Owner" color="primary" size="small" sx={{ mt: 0.5 }} />
            )}
          </Box>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
            {onManageMembers && (
              <MenuItem onClick={handleManageMembers}>
                <ListItemIcon>
                  <PeopleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Manage Members</ListItemText>
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

        {team.description && (
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
            {team.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
          <Tooltip title="Team Members">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PeopleIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {team.memberCount} {team.memberCount === 1 ? 'member' : 'members'}
              </Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Workspaces">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <WorkspaceIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {team.workspaceCount} {team.workspaceCount === 1 ? 'workspace' : 'workspaces'}
              </Typography>
            </Box>
          </Tooltip>
        </Box>

        {/* TODO: Show member avatars when team members endpoint is available */}
        {/* <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
          <Avatar sx={{ width: 24, height: 24 }} />
          <Avatar sx={{ width: 24, height: 24 }} />
          <Avatar sx={{ width: 24, height: 24 }} />
        </AvatarGroup> */}
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Typography variant="caption" color="text.secondary">
          Created {dayjs(team.createdAt).fromNow()}
        </Typography>
      </CardActions>
    </Card>
  );
};
