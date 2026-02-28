import { useState, useEffect } from 'react';
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
import { useUpdateCollectionMutation } from '@api/collectionsApi';
import type { CollectionDto } from '@types/api.types';

interface EditCollectionDialogProps {
  open: boolean;
  collection: CollectionDto | null;
  onClose: () => void;
}

export const EditCollectionDialog = ({ open, collection, onClose }: EditCollectionDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const [updateCollection, { isLoading }] = useUpdateCollectionMutation();

  useEffect(() => {
    if (collection) {
      setName(collection.name);
      setDescription(collection.description ?? '');
      setError('');
    }
  }, [collection]);

  const handleClose = () => {
    setError('');
    onClose();
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!collection) return;
    setError('');

    try {
      await updateCollection({
        id: collection.collectionId,
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
        },
      }).unwrap();
      handleClose();
    } catch {
      setError('Failed to update collection. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Collection</DialogTitle>
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
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
