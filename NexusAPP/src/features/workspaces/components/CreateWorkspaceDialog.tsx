import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  Autocomplete,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateWorkspaceMutation } from '@api/workspacesApi';
import { useGetMyTeamsQuery } from '@api/teamsApi';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { setShowCreateDialog, setCurrentWorkspace } from '../workspacesSlice';

const workspaceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  teamId: z.string().min(1, 'Team ID is required'),
});

type WorkspaceFormData = z.infer<typeof workspaceSchema>;

export const CreateWorkspaceDialog = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.workspaces.showCreateDialog);

  const [createWorkspace, { isLoading, error }] = useCreateWorkspaceMutation();
  const { data: teams, isLoading: teamsLoading } = useGetMyTeamsQuery();

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
      teamId: '',
    },
  });

  const handleClose = () => {
    dispatch(setShowCreateDialog(false));
    reset();
  };

  const onSubmit = async (data: WorkspaceFormData) => {
    try {
      const newWorkspace = await createWorkspace({
        name: data.name,
        description: data.description || undefined,
        teamId: data.teamId,
      }).unwrap();

      // Set the new workspace as current
      dispatch(setCurrentWorkspace(newWorkspace.workspaceId));
      handleClose();
    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Workspace</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {error && (
            <Alert severity="error">
              Failed to create workspace. Please try again.
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

          <Controller
            name="teamId"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={teams || []}
                value={teams?.find(t => t.id === field.value) || null}
                onChange={(event, newValue) => {
                  field.onChange(newValue?.id || '');
                }}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                loading={teamsLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Team"
                    required
                    error={Boolean(errors.teamId)}
                    helperText={errors.teamId?.message}
                  />
                )}
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
          {isLoading ? 'Creating...' : 'Create Workspace'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
