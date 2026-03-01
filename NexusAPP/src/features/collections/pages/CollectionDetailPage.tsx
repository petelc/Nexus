import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Folder as FolderIcon,
  Description as DocumentIcon,
  Code as CodeIcon,
  AccountTree as DiagramIcon,
  ChevronRight as ChevronRightIcon,
  RemoveCircleOutline as RemoveIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  useGetCollectionByIdQuery,
  useGetChildCollectionsQuery,
  useGetCollectionBreadcrumbQuery,
  useDeleteCollectionMutation,
  useRemoveItemFromCollectionMutation,
} from '@api/collectionsApi';
import { CollectionCard } from '../components/CollectionCard';
import { EditCollectionDialog } from '../components/EditCollectionDialog';
import { ConfirmDialog } from '@components/common/ConfirmDialog';
import { useAppSelector } from '@app/hooks';
import { ROUTE_PATHS, buildRoute } from '@routes/routePaths';
import type { CollectionSummaryDto, CollectionItemDto } from '@/types/api.types';

dayjs.extend(relativeTime);

const ITEM_TYPE_ICONS: Record<string, React.ReactNode> = {
  Document: <DocumentIcon fontSize="small" />,
  Snippet: <CodeIcon fontSize="small" />,
  Diagram: <DiagramIcon fontSize="small" />,
};

function getItemRoute(item: CollectionItemDto): string {
  switch (item.itemType) {
    case 'Document':
      return buildRoute.documentDetail(item.itemReferenceId);
    case 'Snippet':
      return buildRoute.snippetDetail(item.itemReferenceId);
    case 'Diagram':
      return buildRoute.diagramDetail(item.itemReferenceId);
    default:
      return '#';
  }
}

export const CollectionDetailPage = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const currentUserId = useAppSelector((state) => state.auth.user?.userId);

  const [editOpen, setEditOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
  }>({ open: false, title: '', message: '', onConfirm: async () => {} });
  const [confirmLoading, setConfirmLoading] = useState(false);

  const {
    data: collection,
    isLoading,
    error,
  } = useGetCollectionByIdQuery(collectionId!, { skip: !collectionId });

  const { data: children = [] } = useGetChildCollectionsQuery(collectionId!, {
    skip: !collectionId,
  });

  const { data: breadcrumb = [] } = useGetCollectionBreadcrumbQuery(collectionId!, {
    skip: !collectionId,
  });

  const [deleteCollection, { isLoading: isDeleting }] = useDeleteCollectionMutation();
  const [removeItem] = useRemoveItemFromCollectionMutation();

  const isOwner = collection?.createdBy === currentUserId;

  const accentColor = collection?.color ?? '#5D87FF';

  const openConfirm = (title: string, message: string, onConfirm: () => Promise<void>) => {
    setConfirmDialog({ open: true, title, message, onConfirm });
  };

  const closeConfirm = () => setConfirmDialog((d) => ({ ...d, open: false }));

  const handleConfirm = async () => {
    setConfirmLoading(true);
    try {
      await confirmDialog.onConfirm();
    } finally {
      setConfirmLoading(false);
      closeConfirm();
    }
  };

  const handleRemoveItem = (itemReferenceId: string, itemTitle?: string) => {
    if (!collectionId) return;
    openConfirm(
      'Remove item',
      `Remove "${itemTitle ?? 'this item'}" from the collection?`,
      async () => { await removeItem({ collectionId, itemReferenceId }); },
    );
  };

  const handleDelete = () => {
    if (!collection) return;
    openConfirm(
      'Delete collection',
      `Delete "${collection.name}"? All sub-collections and items will be removed.`,
      async () => {
        await deleteCollection(collection.collectionId).unwrap();
        navigate(ROUTE_PATHS.COLLECTIONS);
      },
    );
  };

  const handleChildEdit = (child: CollectionSummaryDto) => {
    navigate(buildRoute.collectionDetail(child.collectionId));
  };

  const handleChildDelete = (childId: string) => {
    openConfirm(
      'Delete sub-collection',
      'Delete this sub-collection? All its items will be removed.',
      async () => { await deleteCollection(childId); },
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !collection) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error ? 'Failed to load collection' : 'Collection not found'}
        </Alert>
        <Button onClick={() => navigate(ROUTE_PATHS.COLLECTIONS)} sx={{ mt: 2 }}>
          Back to Collections
        </Button>
      </Container>
    );
  }

  const items = collection.items ?? [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to={ROUTE_PATHS.DASHBOARD} underline="hover" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to={ROUTE_PATHS.COLLECTIONS} underline="hover" color="inherit">
          Collections
        </Link>
        {breadcrumb.slice(0, -1).map((crumb) => (
          <Link
            key={crumb.collectionId}
            component={RouterLink}
            to={buildRoute.collectionDetail(crumb.collectionId)}
            underline="hover"
            color="inherit"
          >
            {crumb.name}
          </Link>
        ))}
        <Typography color="text.primary">{collection.name}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderTop: `4px solid ${accentColor}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <IconButton onClick={() => navigate(ROUTE_PATHS.COLLECTIONS)} size="small">
              <ArrowBackIcon />
            </IconButton>
            <FolderIcon sx={{ color: accentColor, fontSize: 32 }} />
            <Box>
              <Typography variant="h4" component="h1">
                {collection.name}
              </Typography>
              {collection.description && (
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                  {collection.description}
                </Typography>
              )}
            </Box>
          </Box>

          {isOwner && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Edit Collection">
                <IconButton onClick={() => setEditOpen(true)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Collection">
                <IconButton onClick={handleDelete} disabled={isDeleting} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Chip
            label={`${collection.itemCount} item${collection.itemCount !== 1 ? 's' : ''}`}
            size="small"
            variant="outlined"
          />
          {collection.parentCollectionId && (
            <Chip
              icon={<ChevronRightIcon sx={{ fontSize: '14px !important' }} />}
              label={`Level ${collection.hierarchyLevel}`}
              size="small"
              variant="outlined"
            />
          )}
          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            Updated {dayjs(collection.updatedAt).fromNow()}
          </Typography>
        </Box>
      </Paper>

      {/* Sub-collections */}
      {children.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Sub-collections
          </Typography>
          <Grid container spacing={2}>
            {children.map((child) => (
              <Grid key={child.collectionId} size={{ xs: 12, sm: 6, md: 4 }}>
                <CollectionCard
                  collection={child}
                  onEdit={handleChildEdit}
                  onDelete={handleChildDelete}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Items */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Items
        </Typography>
        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            No items in this collection yet.
          </Typography>
        ) : (
          <List disablePadding>
            {items.map((item, index) => (
              <ListItem
                key={item.collectionItemId}
                divider={index < items.length - 1}
                disablePadding
                secondaryAction={
                  <Tooltip title="Remove from collection">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveItem(item.itemReferenceId, item.itemTitle ?? undefined)}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemButton
                  component={RouterLink}
                  to={getItemRoute(item)}
                  sx={{ borderRadius: 1 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {ITEM_TYPE_ICONS[item.itemType] ?? <DocumentIcon fontSize="small" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.itemTitle ?? item.itemReferenceId}
                    secondary={`${item.itemType} · Added ${dayjs(item.addedAt).fromNow()}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Edit dialog */}
      <EditCollectionDialog
        open={editOpen}
        collection={collection}
        onClose={() => setEditOpen(false)}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        loading={confirmLoading}
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />
    </Container>
  );
};
