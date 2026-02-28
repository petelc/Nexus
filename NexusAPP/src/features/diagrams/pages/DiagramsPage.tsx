import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { setViewMode, setSearchTerm, setDiagramTypeFilter, setPage } from '../diagramsSlice';
import { useGetDiagramsQuery, useDeleteDiagramMutation } from '@api/diagramsApi';
import { DiagramCard } from '../components/DiagramCard';
import type { DiagramType } from '@/types/api.types';
import { ROUTE_PATHS } from '@routes/routePaths';

const DIAGRAM_TYPES: { value: DiagramType; label: string }[] = [
  { value: 'Flowchart', label: 'Flowchart' },
  { value: 'NetworkDiagram', label: 'Network Diagram' },
  { value: 'UmlDiagram', label: 'UML Diagram' },
  { value: 'ErDiagram', label: 'ER Diagram' },
  { value: 'Custom', label: 'Custom' },
];

export const DiagramsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { viewMode, filters } = useAppSelector((state) => state.diagrams);

  const { data, isLoading, isError } = useGetDiagramsQuery(filters);
  const [deleteDiagram] = useDeleteDiagramMutation();

  const handleDelete = async (diagramId: string) => {
    if (window.confirm('Are you sure you want to delete this diagram?')) {
      await deleteDiagram(diagramId);
    }
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Diagrams
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(ROUTE_PATHS.DIAGRAM_CREATE)}
        >
          New Diagram
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search diagrams..."
          value={filters.searchTerm ?? ''}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          sx={{ minWidth: 200 }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            label="Type"
            value={filters.diagramType ?? ''}
            onChange={(e) =>
              dispatch(setDiagramTypeFilter(e.target.value ? (e.target.value as DiagramType) : undefined))
            }
          >
            <MenuItem value="">All Types</MenuItem>
            {DIAGRAM_TYPES.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ ml: 'auto' }}>
          <ToggleButtonGroup
            size="small"
            value={viewMode}
            exclusive
            onChange={(_, v) => v && dispatch(setViewMode(v))}
          >
            <ToggleButton value="grid">
              <GridViewIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="list">
              <ListViewIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Content */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load diagrams. Please try again.
        </Alert>
      )}

      {!isLoading && !isError && data && (
        <>
          {data.items.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No diagrams yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create your first diagram to get started
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => navigate(ROUTE_PATHS.DIAGRAM_CREATE)}
              >
                Create Diagram
              </Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={2}>
                {data.items.map((diagram) => (
                  <Grid
                    key={diagram.diagramId}
                    size={{ xs: 12, sm: viewMode === 'grid' ? 6 : 12, md: viewMode === 'grid' ? 4 : 12, lg: viewMode === 'grid' ? 3 : 12 }}
                  >
                    <DiagramCard diagram={diagram} onDelete={handleDelete} />
                  </Grid>
                ))}
              </Grid>

              {data.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={data.totalPages}
                    page={filters.page ?? 1}
                    onChange={(_, p) => dispatch(setPage(p))}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};
