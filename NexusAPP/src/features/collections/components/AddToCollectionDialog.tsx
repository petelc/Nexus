import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Folder as FolderIcon } from '@mui/icons-material';
import { useGetMyWorkspacesQuery } from '@api/workspacesApi';
import { useGetRootCollectionsQuery, useAddItemToCollectionMutation } from '@api/collectionsApi';

export type CollectionItemType = 'Document' | 'Diagram' | 'Snippet';

interface AddToCollectionDialogProps {
  open: boolean;
  onClose: () => void;
  itemId: string;
  itemType: CollectionItemType;
  itemTitle?: string;
}

export const AddToCollectionDialog = ({
  open,
  onClose,
  itemId,
  itemType,
  itemTitle,
}: AddToCollectionDialogProps) => {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [error, setError] = useState('');

  const { data: workspaces = [] } = useGetMyWorkspacesQuery({});

  const { data: collections = [], isFetching: collectionsLoading } = useGetRootCollectionsQuery(
    selectedWorkspaceId,
    { skip: !selectedWorkspaceId },
  );

  const [addItem, { isLoading }] = useAddItemToCollectionMutation();

  // Set default workspace on open
  useEffect(() => {
    if (open && workspaces.length > 0 && !selectedWorkspaceId) {
      setSelectedWorkspaceId(workspaces[0].workspaceId);
    }
  }, [open, workspaces, selectedWorkspaceId]);

  // Reset collection selection when workspace changes
  useEffect(() => {
    setSelectedCollectionId('');
  }, [selectedWorkspaceId]);

  const handleClose = () => {
    setSelectedCollectionId('');
    setError('');
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedCollectionId) {
      setError('Please select a collection.');
      return;
    }
    setError('');

    try {
      await addItem({
        collectionId: selectedCollectionId,
        data: { itemType, itemReferenceId: itemId, itemTitle },
      }).unwrap();
      handleClose();
    } catch (err: unknown) {
      const msg = (err as { data?: { error?: string } })?.data?.error;
      setError(msg ?? 'Failed to add to collection. It may already be in this collection.');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add to Collection</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {itemTitle && (
            <Typography variant="body2" color="text.secondary" noWrap>
              Adding: <strong>{itemTitle}</strong>
            </Typography>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          <FormControl size="small" fullWidth>
            <InputLabel>Workspace</InputLabel>
            <Select
              value={workspaces.length > 0 ? selectedWorkspaceId : ''}
              label="Workspace"
              onChange={(e) => setSelectedWorkspaceId(e.target.value)}
            >
              {workspaces.map((ws) => (
                <MenuItem key={ws.workspaceId} value={ws.workspaceId}>
                  {ws.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth disabled={!selectedWorkspaceId || collectionsLoading}>
            <InputLabel>Collection</InputLabel>
            <Select
              value={collections.length > 0 ? selectedCollectionId : ''}
              label="Collection"
              onChange={(e) => setSelectedCollectionId(e.target.value)}
              startAdornment={collectionsLoading ? <CircularProgress size={16} sx={{ mr: 1 }} /> : undefined}
            >
              {collections.map((col) => (
                <MenuItem key={col.collectionId} value={col.collectionId}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <FolderIcon sx={{ fontSize: 16, color: col.color ?? '#5D87FF' }} />
                    {col.name}
                  </Stack>
                </MenuItem>
              ))}
              {!collectionsLoading && collections.length === 0 && selectedWorkspaceId && (
                <MenuItem disabled>No collections in this workspace</MenuItem>
              )}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading || !selectedCollectionId}
        >
          {isLoading ? 'Adding…' : 'Add to Collection'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
