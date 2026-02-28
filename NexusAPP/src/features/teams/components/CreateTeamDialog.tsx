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
import { useCreateTeamMutation } from '@api/teamsApi';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { setShowCreateDialog } from '../teamsSlice';

const teamSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
});

type TeamFormData = z.infer<typeof teamSchema>;

export const CreateTeamDialog = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.teams.showCreateDialog);

  const [createTeam, { isLoading, error }] = useCreateTeamMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const handleClose = () => {
    dispatch(setShowCreateDialog(false));
    reset();
  };

  const onSubmit = async (data: TeamFormData) => {
    try {
      await createTeam({
        name: data.name,
        description: data.description || undefined,
      }).unwrap();
      handleClose();
    } catch (error) {
      console.error('Failed to create team:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Team</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {error && (
            <Alert severity="error">
              Failed to create team. Please try again.
            </Alert>
          )}

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Team Name"
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
          {isLoading ? 'Creating...' : 'Create Team'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
