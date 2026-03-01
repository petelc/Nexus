import { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  FolderOpen as FolderOpenIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import {
  setViewMode,
  setShowCreateDialog,
  setSelectedWorkspaceId,
  setSearchTerm,
} from '../collectionsSlice';
import {
  useGetRootCollectionsQuery,
  useDeleteCollectionMutation,
} from '@api/collectionsApi';
import { useGetMyWorkspacesQuery } from '@api/workspacesApi';
import { CollectionCard } from '../components/CollectionCard';
import { CreateCollectionDialog } from '../components/CreateCollectionDialog';

export const CollectionsPage = () => {
  const dispatch = useAppDispatch();
  const { viewMode, selectedWorkspaceId, searchTerm } = useAppSelector(
    (state) => state.collections,
  );

  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentWorkspaceId = useAppSelector((state) => state.workspaces.currentWorkspaceId);
  const { data: workspaces = [] } = useGetMyWorkspacesQuery({});

  const workspaceId = selectedWorkspaceId ?? currentWorkspaceId ?? workspaces[0]?.workspaceId ?? '';

  // Set default workspace when workspaces load
  useEffect(() => {
    if (!selectedWorkspaceId && workspaces.length > 0) {
      const defaultId = currentWorkspaceId ?? workspaces[0].workspaceId;
      dispatch(setSelectedWorkspaceId(defaultId));
    }
  }, [workspaces, selectedWorkspaceId, currentWorkspaceId, dispatch]);

  const {
    data: collections = [],
    isLoading,
    isError,
    error,
  } = useGetRootCollectionsQuery(workspaceId, { skip: !workspaceId });

  const [deleteCollection] = useDeleteCollectionMutation();

  const filteredCollections = searchTerm
    ? collections.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : collections;

  const handleSearchChange = (value: string) => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      dispatch(setSearchTerm(value));
    }, 300);
  };

  const handleDelete = async (collectionId: string) => {
    if (!window.confirm('Delete this collection? All items will be removed.')) return;
    await deleteCollection(collectionId);
  };

  // Only use workspaceId as Select value once options have loaded to avoid MUI out-of-range warning
  const selectValue = workspaces.length > 0 ? workspaceId : '';

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Collections
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Organise your documents, snippets, and diagrams into collections
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => dispatch(setShowCreateDialog(true))}
          disabled={!workspaceId}
        >
          New Collection
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Filters toolbar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Workspace selector */}
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Workspace</InputLabel>
          <Select
            value={selectValue}
            label="Workspace"
            onChange={(e) => dispatch(setSelectedWorkspaceId(e.target.value))}
          >
            {workspaces.map((ws) => (
              <MenuItem key={ws.workspaceId} value={ws.workspaceId}>
                {ws.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Search */}
        <TextField
          size="small"
          placeholder="Search collections…"
          defaultValue={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ flexGrow: 1, maxWidth: 360 }}
        />

        {/* View toggle */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_e, val) => val && dispatch(setViewMode(val))}
          size="small"
        >
          <ToggleButton value="grid">
            <GridViewIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="list">
            <ViewListIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Content */}
      {!workspaceId ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <FolderOpenIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Select a workspace to view collections
          </Typography>
        </Box>
      ) : isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {(error as { data?: { message?: string } })?.data?.message ??
            'Failed to load collections.'}
        </Alert>
      ) : filteredCollections.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <FolderOpenIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm ? 'No collections match your search' : 'No collections yet'}
          </Typography>
          {!searchTerm && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => dispatch(setShowCreateDialog(true))}
              sx={{ mt: 1 }}
            >
              Create your first collection
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredCollections.map((collection) => (
            <Grid key={collection.collectionId} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <CollectionCard
                collection={collection}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <CreateCollectionDialog />
    </Box>
  );
};
