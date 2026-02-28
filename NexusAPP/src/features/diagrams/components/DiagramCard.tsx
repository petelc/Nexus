import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  AccountTree as DiagramIcon,
  Cable as ConnectionIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { DiagramListItemDto, DiagramType } from '@/types/api.types';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { toggleFavorite } from '../diagramsSlice';
import { buildRoute } from '@routes/routePaths';

dayjs.extend(relativeTime);

const DIAGRAM_TYPE_COLORS: Record<DiagramType, 'primary' | 'secondary' | 'success' | 'warning' | 'info'> = {
  Flowchart: 'primary',
  NetworkDiagram: 'success',
  UmlDiagram: 'secondary',
  ErDiagram: 'warning',
  Custom: 'info',
};

const DIAGRAM_TYPE_LABELS: Record<DiagramType, string> = {
  Flowchart: 'Flowchart',
  NetworkDiagram: 'Network Diagram',
  UmlDiagram: 'UML Diagram',
  ErDiagram: 'ER Diagram',
  Custom: 'Custom',
};

interface DiagramCardProps {
  diagram: DiagramListItemDto;
  onDelete?: (diagramId: string) => void;
}

export const DiagramCard = ({ diagram, onDelete }: DiagramCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const favoriteDiagramIds = useAppSelector((state) => state.diagrams.favoriteDiagramIds);
  const currentUserId = useAppSelector((state) => state.auth.user?.userId);

  const isFavorite = favoriteDiagramIds.includes(diagram.diagramId);
  const isOwner = diagram.createdBy.userId === currentUserId;
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCardClick = () => {
    navigate(buildRoute.diagramDetail(diagram.diagramId));
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    navigate(buildRoute.diagramEditor(diagram.diagramId));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    if (onDelete) {
      onDelete(diagram.diagramId);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(diagram.diagramId));
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h6" component="h3" gutterBottom noWrap>
              {diagram.title}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
            <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
              <IconButton size="small" onClick={handleToggleFavorite}>
                {isFavorite ? <StarIcon fontSize="small" color="warning" /> : <StarBorderIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Diagram Type */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={DIAGRAM_TYPE_LABELS[diagram.diagramType as DiagramType] ?? diagram.diagramType}
            size="small"
            color={DIAGRAM_TYPE_COLORS[diagram.diagramType as DiagramType] ?? 'default'}
            variant="outlined"
          />
        </Box>

        {/* Canvas Preview Placeholder */}
        <Box
          sx={{
            backgroundColor: 'background.default',
            borderRadius: 1,
            height: 100,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed',
            borderColor: 'divider',
          }}
        >
          <DiagramIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
        </Box>

        {/* Element and Connection counts */}
        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <Tooltip title="Elements">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <DiagramIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {diagram.elementCount} elements
              </Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Connections">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ConnectionIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {diagram.connectionCount} connections
              </Typography>
            </Box>
          </Tooltip>
        </Box>

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Typography variant="caption" color="text.secondary">
            {diagram.createdBy.username}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {dayjs(diagram.updatedAt).fromNow()}
          </Typography>
        </Box>
      </CardContent>

      {/* Menu */}
      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
        <MenuItem onClick={() => { handleMenuClose(); handleCardClick(); }}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        {isOwner && (
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}
        {isOwner && onDelete && (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};
