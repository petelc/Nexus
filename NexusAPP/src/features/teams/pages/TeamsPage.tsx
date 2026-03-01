import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
} from '@mui/icons-material';
import {
  useGetMyTeamsQuery,
  useDeleteTeamMutation,
  useSearchTeamsQuery,
} from '@api/teamsApi';
import { TeamCard } from '../components/TeamCard';
import { CreateTeamDialog } from '../components/CreateTeamDialog';
import { TeamMembersDialog } from '../components/TeamMembersDialog';
import { EditTeamDialog } from '../components/EditTeamDialog';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import {
  setViewMode,
  setShowCreateDialog,
  openTeamMembers,
} from '../teamsSlice';
import type { TeamDto } from '@/types/api.types';

export const TeamsPage = () => {
  const dispatch = useAppDispatch();

  const viewMode = useAppSelector((state) => state.teams.viewMode);

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [editingTeam, setEditingTeam] = useState<TeamDto | null>(null);

  const { data: myTeams, isLoading: myTeamsLoading, error: myTeamsError } = useGetMyTeamsQuery(undefined, {
    skip: debouncedSearch.length > 0,
  });
  const { data: searchResult, isLoading: searchLoading, error: searchError } = useSearchTeamsQuery(
    { keyword: debouncedSearch },
    { skip: debouncedSearch.length === 0 }
  );
  const [deleteTeam] = useDeleteTeamMutation();

  const isLoading = debouncedSearch ? searchLoading : myTeamsLoading;
  const error = debouncedSearch ? searchError : myTeamsError;
  const teams = debouncedSearch ? (searchResult?.items ?? []) : (myTeams ?? []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    const t = setTimeout(() => setDebouncedSearch(value), 300);
    setSearchTimeout(t);
  };

  const handleViewModeToggle = () => {
    dispatch(setViewMode(viewMode === 'grid' ? 'list' : 'grid'));
  };

  const handleCreateTeam = () => {
    dispatch(setShowCreateDialog(true));
  };

  const handleEdit = (team: TeamDto) => {
    setEditingTeam(team);
  };

  const handleDelete = async (teamId: string) => {
    if (window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      try {
        await deleteTeam(teamId).unwrap();
      } catch (err) {
        console.error('Failed to delete team:', err);
      }
    }
  };

  const handleManageMembers = (team: TeamDto) => {
    dispatch(openTeamMembers(team.id));
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Teams
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateTeam}
        >
          New Team
        </Button>
      </Box>

      {/* Filters and Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search teams..."
          value={searchInput}
          onChange={handleSearchChange}
          size="small"
          sx={{ flexGrow: 1, minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Tooltip title={viewMode === 'grid' ? 'List View' : 'Grid View'}>
          <IconButton onClick={handleViewModeToggle}>
            {viewMode === 'grid' ? <ListViewIcon /> : <GridViewIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load teams. Please try again.
        </Alert>
      )}

      {/* Content */}
      {!isLoading && !error && (
        <>
          {teams.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {debouncedSearch ? 'No teams found matching your search' : 'No teams found'}
              </Typography>
              {!debouncedSearch && (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Create your first team to get started
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateTeam}
                  >
                    Create Team
                  </Button>
                </>
              )}
            </Box>
          ) : (
            <Grid container spacing={3}>
              {teams.map((team) => (
                <Grid
                  key={team.id}
                  size={{
                    xs: 12,
                    sm: viewMode === 'grid' ? 6 : 12,
                    md: viewMode === 'grid' ? 4 : 12,
                    lg: viewMode === 'grid' ? 3 : 12,
                  }}
                >
                  <TeamCard
                    team={team}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onManageMembers={handleManageMembers}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Dialogs */}
      <CreateTeamDialog />
      <TeamMembersDialog />
      <EditTeamDialog
        open={Boolean(editingTeam)}
        team={editingTeam}
        onClose={() => setEditingTeam(null)}
      />
    </Box>
  );
};
