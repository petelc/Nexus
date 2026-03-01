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
import { useUpdateTeamMutation } from '@api/teamsApi';
import type { TeamDto } from '@/types/api.types';

const teamSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
});

type TeamFormData = z.infer<typeof teamSchema>;

interface EditTeamDialogProps {
  open: boolean;
  onClose: () => void;
  team: TeamDto | null;
}

export const EditTeamDialog = ({ open, onClose, team }: EditTeamDialogProps) => {
  const [updateTeam, { isLoading, error }] = useUpdateTeamMutation();

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

  useEffect(() => {
    if (team) {
      reset({
        name: team.name,
        description: team.description ?? '',
      });
    }
  }, [team, reset]);

  const handleClose = () => {
    onClose();
    reset();
  };

  const onSubmit = async (data: TeamFormData) => {
    if (!team) return;
    try {
      await updateTeam({
        id: team.id,
        data: {
          name: data.name,
          description: data.description || undefined,
        },
      }).unwrap();
      handleClose();
    } catch (err) {
      console.error('Failed to update team:', err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Team</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {error && (
            <Alert severity="error">
              Failed to update team. Please try again.
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
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
