import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
} from '@mui/material';
import { useCreateCollectionMutation } from '@api/collectionsApi';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { setShowCreateDialog } from '../collectionsSlice';

export const CreateCollectionDialog = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.collections.showCreateDialog);
  const selectedWorkspaceId = useAppSelector((state) => state.collections.selectedWorkspaceId);
  const currentWorkspaceId = useAppSelector((state) => state.workspaces.currentWorkspaceId);

  const workspaceId = selectedWorkspaceId ?? currentWorkspaceId ?? '';

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const [createCollection, { isLoading }] = useCreateCollectionMutation();

  const handleClose = () => {
    dispatch(setShowCreateDialog(false));
    setName('');
    setDescription('');
    setError('');
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!workspaceId) {
      setError('Please select a workspace first.');
      return;
    }
    setError('');

    try {
      await createCollection({
        name: name.trim(),
        description: description.trim() || undefined,
        workspaceId,
      }).unwrap();
      handleClose();
    } catch {
      setError('Failed to create collection. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>New Collection</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            autoFocus
            required
            inputProps={{ maxLength: 200 }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            placeholder="Optional description..."
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading || !name.trim()}>
          {isLoading ? 'Creating...' : 'Create Collection'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
