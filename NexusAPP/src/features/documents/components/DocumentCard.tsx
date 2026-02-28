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
  Publish as PublishIcon,
  Archive as ArchiveIcon,
  History as HistoryIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Schedule as DraftIcon,
  CheckCircle as PublishedIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { DocumentStatus } from '@/types/api.types';
import type { DocumentDto } from '@/types/api.types';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { toggleFavorite } from '../documentsSlice';
import { buildRoute } from '@routes/routePaths';

dayjs.extend(relativeTime);

interface DocumentCardProps {
  document: DocumentDto;
  onEdit?: (document: DocumentDto) => void;
  onDelete?: (documentId: string) => void;
  onPublish?: (documentId: string) => void;
  onArchive?: (documentId: string) => void;
  onViewHistory?: (document: DocumentDto) => void;
}

const getStatusIcon = (status: DocumentStatus) => {
  switch (status) {
    case DocumentStatus.Published:
      return <PublishedIcon fontSize="small" color="success" />;
    case DocumentStatus.Draft:
      return <DraftIcon fontSize="small" color="warning" />;
    case DocumentStatus.Archived:
      return <ArchiveIcon fontSize="small" color="action" />;
    default:
      return null;
  }
};

const getStatusColor = (status: DocumentStatus): 'success' | 'warning' | 'default' => {
  switch (status) {
    case DocumentStatus.Published:
      return 'success';
    case DocumentStatus.Draft:
      return 'warning';
    default:
      return 'default';
  }
};

export const DocumentCard = ({
  document,
  onEdit,
  onDelete,
  onPublish,
  onArchive,
  onViewHistory,
}: DocumentCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const favoriteIds = useAppSelector((state) => state.documents.favoriteDocumentIds);
  const currentUserId = useAppSelector((state) => state.auth.user?.userId);

  const isFavorite = favoriteIds.includes(document.documentId);
  const isOwner = document.createdBy?.userId === currentUserId;
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCardClick = () => {
    navigate(buildRoute.documentDetail(document.documentId));
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    if (onEdit) {
      onEdit(document);
    } else {
      navigate(`/documents/${document.documentId}/edit`);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    if (onDelete) {
      onDelete(document.documentId);
    }
  };

  const handlePublish = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    if (onPublish) {
      onPublish(document.documentId);
    }
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    if (onArchive) {
      onArchive(document.documentId);
    }
  };

  const handleViewHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    if (onViewHistory) {
      onViewHistory(document);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(document.documentId));
  };

  // Create excerpt from content (strip HTML/JSON if needed)
  const createExcerpt = (content: string | undefined | null, maxLength: number = 150) => {
    if (!content) return '';
    // Try to extract text from Lexical JSON format
    try {
      const parsed = JSON.parse(content);
      const extractText = (node: Record<string, unknown>): string => {
        if (node.text && typeof node.text === 'string') return node.text;
        if (Array.isArray(node.children)) {
          return node.children.map((child: Record<string, unknown>) => extractText(child)).join(' ');
        }
        return '';
      };
      const text = extractText(parsed.root || parsed).trim();
      return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    } catch {
      // Fallback: strip HTML tags
      const text = content.replace(/<[^>]*>/g, '').substring(0, maxLength);
      return text.length < content.length ? `${text}...` : text;
    }
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
              {document.title}
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

        {/* Status and Metadata */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip
            label={document.status}
            size="small"
            color={getStatusColor(document.status)}
            icon={getStatusIcon(document.status)}
          />
          {document.publishedAt && (
            <Typography variant="caption" color="text.secondary">
              Published {dayjs(document.publishedAt).fromNow()}
            </Typography>
          )}
        </Box>

        {/* Excerpt */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {createExcerpt(document.content)}
        </Typography>

        {/* Tags */}
        {document.tags && document.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {document.tags.slice(0, 3).map((tag) => (
              <Chip key={tag.tagId} label={tag.name} size="small" variant="outlined" />
            ))}
            {document.tags.length > 3 && (
              <Chip label={`+${document.tags.length - 3}`} size="small" variant="outlined" />
            )}
          </Box>
        )}

        {/* Footer Metadata */}
        <Box sx={{ display: 'flex', gap: 2, mt: 'auto', alignItems: 'center' }}>
          <Tooltip title="Views">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ViewIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {document.viewCount}
              </Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Word count">
            <Typography variant="caption" color="text.secondary">
              {document.wordCount} words
            </Typography>
          </Tooltip>
          <Tooltip title="Reading time">
            <Typography variant="caption" color="text.secondary">
              {document.readingTimeMinutes} min read
            </Typography>
          </Tooltip>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
            {dayjs(document.updatedAt).fromNow()}
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
        {isOwner && onEdit && (
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}
        {isOwner && document.status === DocumentStatus.Draft && onPublish && (
          <MenuItem onClick={handlePublish}>
            <ListItemIcon>
              <PublishIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Publish</ListItemText>
          </MenuItem>
        )}
        {isOwner && document.status !== DocumentStatus.Archived && onArchive && (
          <MenuItem onClick={handleArchive}>
            <ListItemIcon>
              <ArchiveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Archive</ListItemText>
          </MenuItem>
        )}
        {onViewHistory && document.versions && document.versions.length > 0 && (
          <MenuItem onClick={handleViewHistory}>
            <ListItemIcon>
              <HistoryIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Version History</ListItemText>
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
