import {
  Box,
  Typography,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
  FormHelperText,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateDiagramMutation } from '@api/diagramsApi';
import type { DiagramType } from '@/types/api.types';
import { ROUTE_PATHS, buildRoute } from '@routes/routePaths';
import { useAppSelector } from '@app/hooks';

const DIAGRAM_TYPES: { value: DiagramType; label: string }[] = [
  { value: 'Flowchart', label: 'Flowchart' },
  { value: 'NetworkDiagram', label: 'Network Diagram' },
  { value: 'UmlDiagram', label: 'UML Diagram' },
  { value: 'ErDiagram', label: 'ER Diagram' },
  { value: 'Custom', label: 'Custom' },
];

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be at most 200 characters'),
  diagramType: z.enum(['Flowchart', 'NetworkDiagram', 'UmlDiagram', 'ErDiagram', 'Custom']),
  width: z.number().min(400).max(10000).optional(),
  height: z.number().min(300).max(10000).optional(),
});

type FormValues = z.infer<typeof schema>;

export const CreateDiagramPage = () => {
  const navigate = useNavigate();
  const currentWorkspaceId = useAppSelector((state) => state.workspaces.currentWorkspaceId);
  const [createDiagram, { isLoading, isError }] = useCreateDiagramMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      diagramType: 'Flowchart' as DiagramType,
      width: 1920,
      height: 1080,
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!currentWorkspaceId) {
      return;
    }
    const result = await createDiagram({
      title: values.title,
      diagramType: values.diagramType,
      workspaceId: currentWorkspaceId,
      canvas: {
        width: values.width ?? 1920,
        height: values.height ?? 1080,
        backgroundColor: '#FFFFFF',
        gridSize: 20,
      },
    });

    if ('data' in result && result.data) {
      navigate(buildRoute.diagramEditor(result.data.diagramId));
    }
  };

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} to={ROUTE_PATHS.DASHBOARD} underline="hover" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to={ROUTE_PATHS.DIAGRAMS} underline="hover" color="inherit">
          Diagrams
        </Link>
        <Typography color="text.primary">New Diagram</Typography>
      </Breadcrumbs>

      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Create Diagram
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 600 }}>
        {!currentWorkspaceId && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Please select a workspace before creating a diagram.
          </Alert>
        )}
        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to create diagram. Please try again.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Title */}
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Title"
                required
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
                placeholder="My Diagram"
              />
            )}
          />

          {/* Diagram Type */}
          <Controller
            name="diagramType"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.diagramType}>
                <InputLabel>Diagram Type</InputLabel>
                <Select {...field} label="Diagram Type">
                  {DIAGRAM_TYPES.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.diagramType && (
                  <FormHelperText>{errors.diagramType.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          {/* Canvas dimensions */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Controller
              name="width"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Canvas Width (px)"
                  type="number"
                  fullWidth
                  error={!!errors.width}
                  helperText={errors.width?.message}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            <Controller
              name="height"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Canvas Height (px)"
                  type="number"
                  fullWidth
                  error={!!errors.height}
                  helperText={errors.height?.message}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(ROUTE_PATHS.DIAGRAMS)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !currentWorkspaceId}
              startIcon={isLoading ? <CircularProgress size={16} /> : undefined}
            >
              {isLoading ? 'Creating...' : 'Create & Open Editor'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
