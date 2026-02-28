import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Folder as FolderIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { CollectionSummaryDto } from '@types/api.types';
import { buildRoute } from '@routes/routePaths';

dayjs.extend(relativeTime);

interface CollectionCardProps {
  collection: CollectionSummaryDto;
  onEdit?: (collection: CollectionSummaryDto) => void;
  onDelete?: (collectionId: string) => void;
}

export const CollectionCard = ({ collection, onEdit, onDelete }: CollectionCardProps) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const accentColor = collection.color ?? '#5D87FF';
  const hasActions = onEdit || onDelete;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleCardClick = () => {
    navigate(buildRoute.collectionDetail(collection.collectionId));
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    onEdit?.(collection);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    onDelete?.(collection.collectionId);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: 1,
        borderColor: 'divider',
        borderTop: `3px solid ${accentColor}`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, pr: 1 }}>
            <FolderIcon sx={{ color: accentColor, fontSize: 20, flexShrink: 0 }} />
            <Typography variant="h6" component="h3" noWrap>
              {collection.name}
            </Typography>
          </Box>
          {hasActions && (
            <>
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
                {onEdit && (
                  <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                  </MenuItem>
                )}
                {onDelete && (
                  <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                  </MenuItem>
                )}
              </Menu>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={`${collection.itemCount} item${collection.itemCount !== 1 ? 's' : ''}`}
            size="small"
            variant="outlined"
          />
          {collection.parentCollectionId && (
            <Tooltip title="Nested collection">
              <Chip
                icon={<ChevronRightIcon sx={{ fontSize: '14px !important' }} />}
                label={`Level ${collection.hierarchyLevel}`}
                size="small"
                variant="outlined"
              />
            </Tooltip>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Typography variant="caption" color="text.secondary">
          Updated {dayjs(collection.updatedAt).fromNow()}
        </Typography>
      </CardActions>
    </Card>
  );
};
