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
  ArrowBack as ArrowBackIcon,
  History as HistoryIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Publish as PublishIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  useGetDocumentByIdQuery,
  useDeleteDocumentMutation,
  usePublishDocumentMutation,
} from '@api/documentsApi';
import { VersionHistory } from '../components/VersionHistory';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { toggleFavorite, toggleVersionHistory } from '../documentsSlice';
import { ROUTE_PATHS } from '@routes/routePaths';
import { DocumentStatus } from '@/types/api.types';
import { RichTextEditor } from '../components/RichTextEditor';

export const DocumentDetailPage = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: document, isLoading, error } = useGetDocumentByIdQuery(documentId!);
  const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();
  const [publishDocument, { isLoading: isPublishing }] = usePublishDocumentMutation();

  const currentUserId = useAppSelector((state) => state.auth.user?.userId);
  const favoriteIds = useAppSelector((state) => state.documents.favoriteDocumentIds);
  const showVersionHistory = useAppSelector((state) => state.documents.showVersionHistory);

  const isFavorite = document && favoriteIds.includes(document.documentId);
  const isOwner = document && document.createdBy?.userId === currentUserId;

  const handleBack = () => {
    navigate(ROUTE_PATHS.DOCUMENTS);
  };

  const handleEdit = () => {
    if (document) {
      navigate(`/documents/${document.documentId}/edit`);
    }
  };

  const handleDelete = async () => {
    if (document && window.confirm(`Are you sure you want to delete "${document.title}"?`)) {
      try {
        await deleteDocument(document.documentId).unwrap();
        navigate(ROUTE_PATHS.DOCUMENTS);
      } catch (error) {
        console.error('Failed to delete document:', error);
      }
    }
  };

  const handlePublish = async () => {
    if (document) {
      try {
        await publishDocument(document.documentId).unwrap();
      } catch (error) {
        console.error('Failed to publish document:', error);
      }
    }
  };

  const handleToggleFavorite = () => {
    if (document) {
      dispatch(toggleFavorite(document.documentId));
    }
  };

  const handleToggleHistory = () => {
    dispatch(toggleVersionHistory());
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !document) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error ? 'Failed to load document' : 'Document not found'}
        </Alert>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Back to Documents
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link component={RouterLink} to={ROUTE_PATHS.DASHBOARD} underline="hover" color="inherit">
              Home
            </Link>
            <Link component={RouterLink} to={ROUTE_PATHS.DOCUMENTS} underline="hover" color="inherit">
              Documents
            </Link>
            <Typography color="text.primary">{document.title}</Typography>
          </Breadcrumbs>

          <Paper sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <IconButton onClick={handleBack} size="small">
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography variant="h3" component="h1">
                    {document.title}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 6 }}>
                  <Chip label={document.status} color={document.status === DocumentStatus.Published ? 'success' : 'warning'} size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {document.wordCount} words · {document.readingTimeMinutes} min read
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {document.viewCount} views
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Version History">
                  <IconButton onClick={handleToggleHistory}>
                    <HistoryIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                  <IconButton onClick={handleToggleFavorite}>
                    {isFavorite ? <StarIcon color="warning" /> : <StarBorderIcon />}
                  </IconButton>
                </Tooltip>
                {isOwner && (
                  <>
                    {document.status === DocumentStatus.Draft && (
                      <Tooltip title="Publish">
                        <IconButton onClick={handlePublish} disabled={isPublishing}>
                          <PublishIcon />
                        </IconButton>
                      </Tooltip>
                    )}
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
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {document.tags && document.tags.length > 0 && (
              <Box sx={{ mb: 3 }}>
                {document.tags.map((tag) => (
                  <Chip key={tag.tagId} label={tag.name} size="small" variant="outlined" sx={{ mr: 1 }} />
                ))}
              </Box>
            )}

            <RichTextEditor
              initialContent={document.content}
              readOnly
            />

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Created {dayjs(document.createdAt).format('MMMM D, YYYY')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last updated {dayjs(document.updatedAt).fromNow()}
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>

      {showVersionHistory && (
        <Box
          sx={{
            width: 400,
            borderLeft: 1,
            borderColor: 'divider',
            overflow: 'auto',
            backgroundColor: 'background.paper',
          }}
        >
          <VersionHistory documentId={document.documentId} onClose={handleToggleHistory} />
        </Box>
      )}
    </Box>
  );
};
