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
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  useGetDocumentsQuery,
  useDeleteDocumentMutation,
  usePublishDocumentMutation,
} from '@api/documentsApi';
import { DocumentCard } from '../components/DocumentCard';
import { VersionHistory } from '../components/VersionHistory';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import {
  setViewMode,
  setActiveTab,
  setSearchTerm,
  setPage,
  setSortBy,
  setShowVersionHistory,
  setSelectedDocument,
  type DocumentTabType,
} from '../documentsSlice';
import { ROUTE_PATHS } from '@routes/routePaths';
import type { DocumentDto } from '@/types/api.types';

export const DocumentsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const viewMode = useAppSelector((state) => state.documents.viewMode);
  const activeTab = useAppSelector((state) => state.documents.activeTab);
  const filters = useAppSelector((state) => state.documents.filters);
  const showVersionHistory = useAppSelector((state) => state.documents.showVersionHistory);
  const selectedDocumentId = useAppSelector((state) => state.documents.selectedDocumentId);

  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [searchInput, setSearchInput] = useState(filters.searchTerm || '');

  const { data: documentsData, isLoading, error } = useGetDocumentsQuery(filters);
  const [deleteDocument] = useDeleteDocumentMutation();
  const [publishDocument] = usePublishDocumentMutation();

  const handleTabChange = (_: React.SyntheticEvent, newValue: DocumentTabType) => {
    dispatch(setActiveTab(newValue));
  };

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

  const handleCreateDocument = () => {
    navigate(ROUTE_PATHS.DOCUMENT_CREATE);
  };

  const handleEdit = (document: DocumentDto) => {
    navigate(`/documents/${document.documentId}/edit`);
  };

  const handleDelete = async (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(documentId).unwrap();
      } catch (error) {
        console.error('Failed to delete document:', error);
      }
    }
  };

  const handlePublish = async (documentId: string) => {
    try {
      await publishDocument(documentId).unwrap();
    } catch (error) {
      console.error('Failed to publish document:', error);
    }
  };

  const handleViewHistory = (document: DocumentDto) => {
    dispatch(setSelectedDocument(document.documentId));
    dispatch(setShowVersionHistory(true));
  };

  const handleCloseHistory = () => {
    dispatch(setShowVersionHistory(false));
    dispatch(setSelectedDocument(null));
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Documents
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateDocument}
          >
            New Document
          </Button>
        </Box>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="All Documents" value="all" />
          <Tab label="Drafts" value="drafts" />
          <Tab label="Published" value="published" />
          <Tab label="Archived" value="archived" />
        </Tabs>

        {/* Filters and Controls */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search documents..."
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
              Recently Updated
            </MenuItem>
            <MenuItem onClick={() => handleSortSelect('createdAt', 'desc')}>
              Recently Created
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
          </Menu>

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
            Failed to load documents. Please try again.
          </Alert>
        )}

        {/* Content */}
        {!isLoading && !error && documentsData && (
          <>
            {documentsData.items.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No documents found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Create your first document to get started
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateDocument}
                >
                  Create Document
                </Button>
              </Box>
            ) : (
              <>
                <Grid container spacing={3}>
                  {documentsData.items.map((document) => (
                    <Grid
                      key={document.documentId}
                      size={{ xs: 12, sm: viewMode === 'grid' ? 6 : 12, md: viewMode === 'grid' ? 4 : 12, lg: viewMode === 'grid' ? 3 : 12 }}
                    >
                      <DocumentCard
                        document={document}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onPublish={handlePublish}
                        onViewHistory={handleViewHistory}
                      />
                    </Grid>
                  ))}
                </Grid>

                {documentsData.totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={documentsData.totalPages}
                      page={filters.pageNumber || 1}
                      onChange={handlePageChange}
                      color="primary"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Showing {documentsData.items.length} of {documentsData.totalCount} documents
                  </Typography>
                </Box>
              </>
            )}
          </>
        )}
      </Box>

      {/* Version History Sidebar */}
      {showVersionHistory && selectedDocumentId && (
        <Box
          sx={{
            width: 400,
            borderLeft: 1,
            borderColor: 'divider',
            overflow: 'auto',
            backgroundColor: 'background.paper',
          }}
        >
          <VersionHistory
            documentId={selectedDocumentId}
            onClose={handleCloseHistory}
          />
        </Box>
      )}
    </Box>
  );
};
