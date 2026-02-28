import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Grid,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  Pagination,
  Select,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  useGetSnippetsQuery,
  useGetPublicSnippetsQuery,
  useDeleteSnippetMutation,
  useForkSnippetMutation,
} from '@api/snippetsApi';
import { SnippetCard } from '../components/SnippetCard';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import {
  setViewMode,
  setActiveTab,
  setSearchTerm,
  setLanguageFilter,
  setPage,
  setSortBy,
  type SnippetTabType,
} from '../snippetsSlice';
import { ROUTE_PATHS, buildRoute } from '@routes/routePaths';
import { PROGRAMMING_LANGUAGES } from '../components/LanguageSelector';
import type { CodeSnippetDto } from '@types/api.types';

export const SnippetsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const viewMode = useAppSelector((state) => state.snippets.viewMode);
  const activeTab = useAppSelector((state) => state.snippets.activeTab);
  const filters = useAppSelector((state) => state.snippets.filters);
  const favoriteIds = useAppSelector((state) => state.snippets.favoriteSnippetIds);

  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [searchInput, setSearchInput] = useState(filters.searchTerm || '');

  // Fetch data based on active tab
  const {
    data: mySnippetsData,
    isLoading: isLoadingMy,
    error: myError,
  } = useGetSnippetsQuery(filters, { skip: activeTab !== 'my-snippets' });

  const {
    data: publicSnippetsData,
    isLoading: isLoadingPublic,
    error: publicError,
  } = useGetPublicSnippetsQuery(filters, { skip: activeTab !== 'public' });

  const [deleteSnippet] = useDeleteSnippetMutation();
  const [forkSnippet] = useForkSnippetMutation();

  // Determine which data to display
  let snippetsData;
  let isLoading;
  let error;

  if (activeTab === 'my-snippets') {
    snippetsData = mySnippetsData;
    isLoading = isLoadingMy;
    error = myError;
  } else if (activeTab === 'public') {
    snippetsData = publicSnippetsData;
    isLoading = isLoadingPublic;
    error = publicError;
  } else {
    // Favorites tab - filter from my snippets
    if (mySnippetsData) {
      const favoriteSnippets = mySnippetsData.items.filter((snippet) =>
        favoriteIds.includes(snippet.snippetId)
      );
      snippetsData = {
        ...mySnippetsData,
        items: favoriteSnippets,
        totalCount: favoriteSnippets.length,
      };
    }
    isLoading = isLoadingMy;
    error = myError;
  }

  const handleTabChange = (_: React.SyntheticEvent, newValue: SnippetTabType) => {
    dispatch(setActiveTab(newValue));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(value);
    // Debounce search
    setTimeout(() => {
      dispatch(setSearchTerm(value));
    }, 300);
  };

  const handleLanguageFilterChange = (event: any) => {
    const value = event.target.value;
    dispatch(setLanguageFilter(value === 'all' ? undefined : value));
  };

  const handleViewModeToggle = () => {
    dispatch(setViewMode(viewMode === 'grid' ? 'list' : 'grid'));
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortSelect = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    dispatch(setSortBy({ sortBy, sortOrder }));
    handleSortClose();
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setPage(page));
  };

  const handleCreateSnippet = () => {
    navigate(ROUTE_PATHS.SNIPPET_CREATE);
  };

  const handleEdit = (snippet: CodeSnippetDto) => {
    navigate(buildRoute.snippetEdit(snippet.snippetId));
  };

  const handleDelete = async (snippetId: string) => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      try {
        await deleteSnippet(snippetId).unwrap();
      } catch (error) {
        console.error('Failed to delete snippet:', error);
      }
    }
  };

  const handleFork = async (snippetId: string) => {
    try {
      const forkedSnippet = await forkSnippet(snippetId).unwrap();
      navigate(buildRoute.snippetDetail(forkedSnippet.snippetId));
    } catch (error) {
      console.error('Failed to fork snippet:', error);
    }
  };

  const handleShare = (snippet: CodeSnippetDto) => {
    const url = `${window.location.origin}${buildRoute.snippetDetail(snippet.snippetId)}`;
    navigator.clipboard.writeText(url);
    // TODO: Show toast notification
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Code Snippets
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateSnippet}
        >
          New Snippet
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="My Snippets" value="my-snippets" />
        <Tab label="Public" value="public" />
        <Tab
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Favorites
              {favoriteIds.length > 0 && (
                <Chip label={favoriteIds.length} size="small" color="primary" />
              )}
            </Box>
          }
          value="favorites"
        />
      </Tabs>

      {/* Filters and Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {/* Search */}
        <TextField
          placeholder="Search snippets..."
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

        {/* Language Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Language</InputLabel>
          <Select
            value={filters.language || 'all'}
            onChange={handleLanguageFilterChange}
            label="Language"
          >
            <MenuItem value="all">All Languages</MenuItem>
            {PROGRAMMING_LANGUAGES.map((lang) => (
              <MenuItem key={lang.value} value={lang.value}>
                {lang.icon} {lang.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort */}
        <Tooltip title="Sort">
          <IconButton onClick={handleSortClick}>
            <SortIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={handleSortClose}
        >
          <MenuItem onClick={() => handleSortSelect('updatedAt', 'desc')}>
            Newest First
          </MenuItem>
          <MenuItem onClick={() => handleSortSelect('updatedAt', 'asc')}>
            Oldest First
          </MenuItem>
          <MenuItem onClick={() => handleSortSelect('title', 'asc')}>
            Title (A-Z)
          </MenuItem>
          <MenuItem onClick={() => handleSortSelect('title', 'desc')}>
            Title (Z-A)
          </MenuItem>
          <MenuItem onClick={() => handleSortSelect('viewCount', 'desc')}>
            Most Viewed
          </MenuItem>
          <MenuItem onClick={() => handleSortSelect('forkCount', 'desc')}>
            Most Forked
          </MenuItem>
        </Menu>

        {/* View Mode Toggle */}
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
          Failed to load snippets. Please try again.
        </Alert>
      )}

      {/* Content */}
      {!isLoading && !error && snippetsData && (
        <>
          {snippetsData.items.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No snippets found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {activeTab === 'favorites'
                  ? 'You haven\'t favorited any snippets yet'
                  : 'Create your first snippet to get started'}
              </Typography>
              {activeTab !== 'public' && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateSnippet}
                >
                  Create Snippet
                </Button>
              )}
            </Box>
          ) : (
            <>
              {/* Grid/List View */}
              <Grid container spacing={3}>
                {snippetsData.items.map((snippet) => (
                  <Grid
                    key={snippet.snippetId}
                    size={{ xs: 12, sm: viewMode === 'grid' ? 6 : 12, md: viewMode === 'grid' ? 4 : 12, lg: viewMode === 'grid' ? 3 : 12 }}
                  >
                    <SnippetCard
                      snippet={snippet}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onFork={handleFork}
                      onShare={handleShare}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {snippetsData.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={snippetsData.totalPages}
                    page={filters.pageNumber || 1}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}

              {/* Results Count */}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Showing {snippetsData.items.length} of {snippetsData.totalCount} snippets
                </Typography>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
};
