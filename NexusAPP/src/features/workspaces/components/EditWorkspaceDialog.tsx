import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useUpdateWorkspaceMutation } from '@api/workspacesApi';
import type { WorkspaceDto } from '@/types/api.types';

const workspaceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
});

type WorkspaceFormData = z.infer<typeof workspaceSchema>;

interface EditWorkspaceDialogProps {
  open: boolean;
  onClose: () => void;
  workspace: WorkspaceDto | null;
}

export const EditWorkspaceDialog = ({ open, onClose, workspace }: EditWorkspaceDialogProps) => {
  const [updateWorkspace, { isLoading, error }] = useUpdateWorkspaceMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkspaceFormData>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (workspace) {
      reset({
        name: workspace.name,
        description: workspace.description ?? '',
      });
    }
  }, [workspace, reset]);

  const handleClose = () => {
    onClose();
    reset();
  };

  const onSubmit = async (data: WorkspaceFormData) => {
    if (!workspace) return;
    try {
      await updateWorkspace({
        id: workspace.workspaceId,
        data: {
          name: data.name,
          description: data.description || undefined,
        },
      }).unwrap();
      handleClose();
    } catch (err) {
      console.error('Failed to update workspace:', err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Workspace</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {error && (
            <Alert severity="error">
              Failed to update workspace. Please try again.
            </Alert>
          )}

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Workspace Name"
                required
                fullWidth
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                autoFocus
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                multiline
                rows={3}
                error={Boolean(errors.description)}
                helperText={errors.description?.message}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
