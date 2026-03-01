import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { useGetMyTeamsQuery } from '@api/teamsApi';

interface TeamSelectorProps {
  value: string;
  onChange: (teamId: string) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  label?: string;
}

export const TeamSelector = ({
  value,
  onChange,
  error,
  helperText,
  required = true,
  label = 'Team',
}: TeamSelectorProps) => {
  const { data: teams, isLoading, error: fetchError } = useGetMyTeamsQuery();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (fetchError || !teams) {
    return (
      <FormControl fullWidth error>
        <FormHelperText>Failed to load teams. Please try again.</FormHelperText>
      </FormControl>
    );
  }

  if (teams.length === 0) {
    return (
      <FormControl fullWidth>
        <Typography variant="body2" color="text.secondary">
          No teams available. Create a team first to create a workspace.
        </Typography>
      </FormControl>
    );
  }

  return (
    <FormControl fullWidth required={required} error={error}>
      <InputLabel id="team-select-label">{label}</InputLabel>
      <Select
        labelId="team-select-label"
        id="team-select"
        value={value || ''}
        label={label}
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="">
          <em>Select a team</em>
        </MenuItem>
        {teams.map((team) => (
          <MenuItem key={team.id} value={team.id}>
            {team.name}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
