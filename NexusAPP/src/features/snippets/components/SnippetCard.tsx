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
  Share as ShareIcon,
  CallSplit as ForkIcon,
  Public as PublicIcon,
  Lock as PrivateIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { CodeSnippetDto } from '@/types/api.types';
import { getLanguageIcon, getLanguageLabel } from './LanguageSelector';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { toggleFavorite } from '../snippetsSlice';

dayjs.extend(relativeTime);

interface SnippetCardProps {
  snippet: CodeSnippetDto;
  onEdit?: (snippet: CodeSnippetDto) => void;
  onDelete?: (snippetId: string) => void;
  onFork?: (snippetId: string) => void;
  onShare?: (snippet: CodeSnippetDto) => void;
}

export const SnippetCard = ({
  snippet,
  onEdit,
  onDelete,
  onFork,
  onShare,
}: SnippetCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const favoriteIds = useAppSelector((state) => state.snippets.favoriteSnippetIds);
  const currentUserId = useAppSelector((state) => state.auth.user?.userId);

  const isFavorite = favoriteIds.includes(snippet.snippetId);
  const isOwner = snippet.createdBy === currentUserId;
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCardClick = () => {
    navigate(`/snippets/${snippet.snippetId}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    if (onEdit) {
      onEdit(snippet);
    } else {
      navigate(`/snippets/${snippet.snippetId}/edit`);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    if (onDelete) {
      onDelete(snippet.snippetId);
    }
  };

  const handleFork = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    if (onFork) {
      onFork(snippet.snippetId);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    if (onShare) {
      onShare(snippet);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(snippet.snippetId));
  };

  // Truncate code for preview (guard against null/undefined code from API)
  const code = snippet.code ?? '';
  const codePreview = code.split('\n').slice(0, 5).join('\n');
  const hasMoreLines = code.split('\n').length > 5;

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
              {snippet.title}
            </Typography>
            {snippet.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {snippet.description}
              </Typography>
            )}
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

        {/* Language Badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip
            label={getLanguageLabel(snippet.language)}
            size="small"
            icon={<span style={{ fontSize: '1rem' }}>{getLanguageIcon(snippet.language)}</span>}
            color="primary"
            variant="outlined"
          />
          {snippet.isPublic ? (
            <Tooltip title="Public snippet">
              <PublicIcon fontSize="small" color="action" />
            </Tooltip>
          ) : (
            <Tooltip title="Private snippet">
              <PrivateIcon fontSize="small" color="action" />
            </Tooltip>
          )}
        </Box>

        {/* Code Preview */}
        <Box
          sx={{
            backgroundColor: 'background.default',
            borderRadius: 1,
            p: 1.5,
            mb: 2,
            fontFamily: 'Fira Code, Monaco, monospace',
            fontSize: '0.75rem',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <pre style={{ margin: 0, overflow: 'hidden', whiteSpace: 'pre-wrap' }}>
            <code>{codePreview}</code>
          </pre>
          {hasMoreLines && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}
            >
              ...
            </Typography>
          )}
        </Box>

        {/* Tags */}
        {snippet.tags && snippet.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {snippet.tags.slice(0, 3).map((tag) => (
              <Chip key={tag.tagId} label={tag.name} size="small" variant="outlined" />
            ))}
            {snippet.tags.length > 3 && (
              <Chip label={`+${snippet.tags.length - 3}`} size="small" variant="outlined" />
            )}
          </Box>
        )}

        {/* Metadata */}
        <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
          <Tooltip title="Views">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ViewIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {snippet.viewCount}
              </Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Forks">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ForkIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {snippet.forkCount}
              </Typography>
            </Box>
          </Tooltip>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
            {dayjs(snippet.updatedAt).fromNow()}
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
        {onFork && (
          <MenuItem onClick={handleFork}>
            <ListItemIcon>
              <ForkIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Fork</ListItemText>
          </MenuItem>
        )}
        {onShare && (
          <MenuItem onClick={handleShare}>
            <ListItemIcon>
              <ShareIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Share</ListItemText>
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
