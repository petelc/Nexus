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
  useGetMyWorkspacesQuery,
  useDeleteWorkspaceMutation,
} from '@api/workspacesApi';
import { WorkspaceCard } from '../components/WorkspaceCard';
import { CreateWorkspaceDialog } from '../components/CreateWorkspaceDialog';
import { EditWorkspaceDialog } from '../components/EditWorkspaceDialog';
import { WorkspaceMembersDialog } from '../components/WorkspaceMembersDialog';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import {
  setViewMode,
  setSearchTerm,
  setShowCreateDialog,
} from '../workspacesSlice';
import type { WorkspaceDto } from '@/types/api.types';

export const WorkspacesPage = () => {
  const dispatch = useAppDispatch();

  const viewMode = useAppSelector((state) => state.workspaces.viewMode);
  const filters = useAppSelector((state) => state.workspaces.filters);

  const [searchInput, setSearchInput] = useState(filters.searchTerm || '');
  const [editingWorkspace, setEditingWorkspace] = useState<WorkspaceDto | null>(null);
  const [membersWorkspace, setMembersWorkspace] = useState<WorkspaceDto | null>(null);

  const { data: workspacesData, isLoading, error } = useGetMyWorkspacesQuery(filters);
  const [deleteWorkspace] = useDeleteWorkspaceMutation();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(value);
    setTimeout(() => {
      dispatch(setSearchTerm(value));
    }, 300);
  };

  const handleViewModeToggle = () => {
    dispatch(setViewMode(viewMode === 'grid' ? 'list' : 'grid'));
  };

  const handleCreateWorkspace = () => {
    dispatch(setShowCreateDialog(true));
  };

  const handleEdit = (workspace: WorkspaceDto) => {
    setEditingWorkspace(workspace);
  };

  const handleDelete = async (workspaceId: string) => {
    if (window.confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
      try {
        await deleteWorkspace(workspaceId).unwrap();
      } catch (err) {
        console.error('Failed to delete workspace:', err);
      }
    }
  };

  const handleSettings = (workspace: WorkspaceDto) => {
    setMembersWorkspace(workspace);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Workspaces
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateWorkspace}
        >
          New Workspace
        </Button>
      </Box>

      {/* Filters and Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search workspaces..."
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
          Failed to load workspaces. Please try again.
        </Alert>
      )}

      {/* Content */}
      {!isLoading && !error && workspacesData && (
        <>
          {workspacesData.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {filters.searchTerm ? 'No workspaces found matching your search' : 'No workspaces found'}
              </Typography>
              {!filters.searchTerm && (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Create your first workspace to get started
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateWorkspace}
                  >
                    Create Workspace
                  </Button>
                </>
              )}
            </Box>
          ) : (
            <Grid container spacing={3}>
              {workspacesData.map((workspace) => (
                <Grid
                  key={workspace.workspaceId}
                  size={{
                    xs: 12,
                    sm: viewMode === 'grid' ? 6 : 12,
                    md: viewMode === 'grid' ? 4 : 12,
                    lg: viewMode === 'grid' ? 3 : 12,
                  }}
                >
                  <WorkspaceCard
                    workspace={workspace}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSettings={handleSettings}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Dialogs */}
      <CreateWorkspaceDialog />
      <EditWorkspaceDialog
        open={Boolean(editingWorkspace)}
        workspace={editingWorkspace}
        onClose={() => setEditingWorkspace(null)}
      />
      <WorkspaceMembersDialog
        open={Boolean(membersWorkspace)}
        workspace={membersWorkspace}
        onClose={() => setMembersWorkspace(null)}
      />
    </Box>
  );
};
