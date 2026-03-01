import {
  Box,
  Container,
  Paper,
  Typography,
  Chip,
  IconButton,
  Button,
  Tooltip,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CallSplit as ForkIcon,
  ArrowBack as ArrowBackIcon,
  Public as PublicIcon,
  Lock as PrivateIcon,
  Visibility as ViewIcon,
  ContentCopy as CopyIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  PlaylistAdd as AddToCollectionIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { AddToCollectionDialog } from '@features/collections/components/AddToCollectionDialog';
import dayjs from 'dayjs';
import {
  useGetSnippetByIdQuery,
  useDeleteSnippetMutation,
  useForkSnippetMutation,
} from '@api/snippetsApi';
import { CodeEditor } from '../components/CodeEditor';
import { getLanguageIcon, getLanguageLabel } from '../components/LanguageSelector';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { toggleFavorite } from '../snippetsSlice';
import { ROUTE_PATHS, buildRoute } from '@routes/routePaths';

export const SnippetDetailPage = () => {
  const { snippetId } = useParams<{ snippetId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: snippet, isLoading, error } = useGetSnippetByIdQuery(snippetId!);
  const [deleteSnippet, { isLoading: isDeleting }] = useDeleteSnippetMutation();
  const [forkSnippet, { isLoading: isForking }] = useForkSnippetMutation();

  const currentUserId = useAppSelector((state) => state.auth.user?.userId);
  const favoriteIds = useAppSelector((state) => state.snippets.favoriteSnippetIds);

  const isFavorite = snippet && favoriteIds.includes(snippet.snippetId);
  const isOwner = snippet && snippet.createdBy === currentUserId;

  const handleBack = () => {
    navigate(ROUTE_PATHS.SNIPPETS);
  };

  const handleEdit = () => {
    if (snippet) {
      navigate(buildRoute.snippetEdit(snippet.snippetId));
    }
  };

  const handleDelete = async () => {
    if (snippet && window.confirm(`Are you sure you want to delete "${snippet.title}"?`)) {
      try {
        await deleteSnippet(snippet.snippetId).unwrap();
        navigate(ROUTE_PATHS.SNIPPETS);
      } catch (error) {
        console.error('Failed to delete snippet:', error);
      }
    }
  };

  const handleFork = async () => {
    if (snippet) {
      try {
        const forkedSnippet = await forkSnippet(snippet.snippetId).unwrap();
        navigate(buildRoute.snippetDetail(forkedSnippet.snippetId));
      } catch (error) {
        console.error('Failed to fork snippet:', error);
      }
    }
  };

  const handleCopyCode = () => {
    if (snippet) {
      navigator.clipboard.writeText(snippet.code);
    }
  };

  const handleToggleFavorite = () => {
    if (snippet) {
      dispatch(toggleFavorite(snippet.snippetId));
    }
  };

  const [addToCollectionOpen, setAddToCollectionOpen] = useState(false);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !snippet) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error ? 'Failed to load snippet' : 'Snippet not found'}
        </Alert>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Back to Snippets
        </Button>
      </Container>
    );
  }

  return (
    <>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to={ROUTE_PATHS.DASHBOARD} underline="hover" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to={ROUTE_PATHS.SNIPPETS} underline="hover" color="inherit">
          Snippets
        </Link>
        <Typography color="text.primary">{snippet.title}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <IconButton onClick={handleBack} size="small">
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h4" component="h1">
                {snippet.title}
              </Typography>
            </Box>
            {snippet.description && (
              <Typography variant="body1" color="text.secondary" sx={{ ml: 6 }}>
                {snippet.description}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
              <IconButton onClick={handleToggleFavorite}>
                {isFavorite ? <StarIcon color="warning" /> : <StarBorderIcon />}
              </IconButton>
            </Tooltip>
            {isOwner && (
              <>
                <Tooltip title="Edit">
                  <IconButton onClick={handleEdit}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={handleDelete} disabled={isDeleting} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            <Tooltip title="Fork">
              <IconButton onClick={handleFork} disabled={isForking}>
                <ForkIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copy code">
              <IconButton onClick={handleCopyCode}>
                <CopyIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              startIcon={<AddToCollectionIcon />}
              onClick={() => setAddToCollectionOpen(true)}
            >
              Add to Collection
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Metadata */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Chip
            label={getLanguageLabel(snippet.language)}
            size="medium"
            icon={<span style={{ fontSize: '1.2rem' }}>{getLanguageIcon(snippet.language)}</span>}
            color="primary"
          />
          <Chip
            label={snippet.isPublic ? 'Public' : 'Private'}
            size="medium"
            icon={snippet.isPublic ? <PublicIcon /> : <PrivateIcon />}
            variant="outlined"
          />
          {snippet.tags.map((tag) => (
            <Chip key={tag.tagId} label={tag.name} size="medium" variant="outlined" />
          ))}
          <Box sx={{ ml: 'auto', display: 'flex', gap: 3 }}>
            <Tooltip title="Views">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ViewIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {snippet.viewCount}
                </Typography>
              </Box>
            </Tooltip>
            <Tooltip title="Forks">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ForkIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {snippet.forkCount}
                </Typography>
              </Box>
            </Tooltip>
            <Typography variant="body2" color="text.secondary">
              Updated {dayjs(snippet.updatedAt).fromNow()}
            </Typography>
          </Box>
        </Box>

        {snippet.forkedFromId && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              <ForkIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
              Forked from another snippet
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Code Editor */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Code</Typography>
          <Typography variant="caption" color="text.secondary">
            {snippet.metadata?.lineCount ?? 0} lines · {snippet.metadata?.characterCount ?? 0} characters
          </Typography>
        </Box>
        <CodeEditor
          value={snippet.code ?? ''}
          language={snippet.language}
          readOnly
          height="600px"
        />
      </Paper>

      {/* Metadata Section */}
      {(snippet.metadata?.framework || snippet.metadata?.hasTests || snippet.metadata?.dependencies?.length) && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Metadata
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {snippet.metadata.framework && (
              <Chip label={`Framework: ${snippet.metadata.framework}`} variant="outlined" />
            )}
            {snippet.metadata.hasTests && (
              <Chip label="Has Tests" color="success" variant="outlined" />
            )}
            {snippet.metadata.dependencies && snippet.metadata.dependencies.length > 0 && (
              <Chip label={`${snippet.metadata.dependencies.length} Dependencies`} variant="outlined" />
            )}
          </Box>
        </Paper>
      )}
    </Container>

      {snippet && (
        <AddToCollectionDialog
          open={addToCollectionOpen}
          onClose={() => setAddToCollectionOpen(false)}
          itemId={snippet.snippetId}
          itemType="Snippet"
          itemTitle={snippet.title}
        />
      )}
    </>
  );
};
