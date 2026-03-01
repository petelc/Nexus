import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
  Chip,
  Autocomplete,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useGetSnippetByIdQuery,
  useCreateSnippetMutation,
  useUpdateSnippetMutation,
} from '@api/snippetsApi';
import { CodeEditor } from '../components/CodeEditor';
import { LanguageSelector } from '../components/LanguageSelector';
import { ROUTE_PATHS, buildRoute } from '@routes/routePaths';
import { useAppSelector } from '@app/hooks';

// Validation schema
const snippetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Language is required'),
  isPublic: z.boolean(),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed'),
});

type SnippetFormData = z.infer<typeof snippetSchema>;

export const CreateSnippetPage = () => {
  const { snippetId } = useParams<{ snippetId: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(snippetId);
  const currentWorkspaceId = useAppSelector((state) => state.workspaces.currentWorkspaceId);

  const { data: existingSnippet, isLoading: isLoadingSnippet } = useGetSnippetByIdQuery(snippetId!, {
    skip: !isEditMode,
  });
  const [createSnippet, { isLoading: isCreating, error: createError }] = useCreateSnippetMutation();
  const [updateSnippet, { isLoading: isUpdating, error: updateError }] = useUpdateSnippetMutation();

  const [tagInput, setTagInput] = useState('');

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SnippetFormData>({
    resolver: zodResolver(snippetSchema),
    defaultValues: {
      title: '',
      description: '',
      code: '',
      language: 'javascript',
      isPublic: false,
      tags: [],
    },
  });

  // Load existing snippet data in edit mode
  useEffect(() => {
    if (existingSnippet) {
      setValue('title', existingSnippet.title);
      setValue('description', existingSnippet.description || '');
      setValue('code', existingSnippet.code);
      setValue('language', existingSnippet.language);
      setValue('isPublic', existingSnippet.isPublic);
      setValue('tags', existingSnippet.tags.map((tag) => tag.name));
    }
  }, [existingSnippet, setValue]);

  const handleBack = () => {
    if (isEditMode && snippetId) {
      navigate(buildRoute.snippetDetail(snippetId));
    } else {
      navigate(ROUTE_PATHS.SNIPPETS);
    }
  };

  const onSubmit = async (data: SnippetFormData) => {
    try {
      if (isEditMode && snippetId) {
        // Update existing snippet
        await updateSnippet({
          id: snippetId,
          data: {
            title: data.title,
            description: data.description,
            code: data.code,
            language: data.language,
            isPublic: data.isPublic,
            tags: data.tags,
          },
        }).unwrap();
        navigate(buildRoute.snippetDetail(snippetId));
      } else {
        // Create new snippet
        if (!currentWorkspaceId) {
          alert('Please select a workspace first');
          return;
        }
        const newSnippet = await createSnippet({
          ...data,
          workspaceId: currentWorkspaceId,
        }).unwrap();
        navigate(buildRoute.snippetDetail(newSnippet.snippetId));
      }
    } catch (error) {
      console.error('Failed to save snippet:', error);
    }
  };

  const code = watch('code');

  const handleCodeChange = (newCode: string) => {
    setValue('code', newCode);
  };

  if (isLoadingSnippet) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const error = createError || updateError;
  const isSaving = isCreating || isUpdating;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to={ROUTE_PATHS.DASHBOARD} underline="hover" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to={ROUTE_PATHS.SNIPPETS} underline="hover" color="inherit">
          Snippets
        </Link>
        <Typography color="text.primary">
          {isEditMode ? 'Edit Snippet' : 'New Snippet'}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {isEditMode ? 'Edit Snippet' : 'Create New Snippet'}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to save snippet. Please try again.
        </Alert>
      )}

      {/* Form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                error={Boolean(errors.title)}
                helperText={errors.title?.message}
              />
            )}
          />

          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                multiline
                rows={2}
                fullWidth
                error={Boolean(errors.description)}
                helperText={errors.description?.message}
              />
            )}
          />

          {/* Language */}
          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <LanguageSelector
                value={field.value}
                onChange={field.onChange}
                label="Language"
                required
                error={Boolean(errors.language)}
                helperText={errors.language?.message}
              />
            )}
          />

          {/* Public Toggle */}
          <Controller
            name="isPublic"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch checked={field.value} onChange={field.onChange} />}
                label="Make this snippet public"
              />
            )}
          />

          {/* Tags */}
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <Autocomplete
                multiple
                freeSolo
                value={field.value}
                onChange={(_, newValue) => field.onChange(newValue)}
                inputValue={tagInput}
                onInputChange={(_, newInputValue) => setTagInput(newInputValue)}
                options={[]}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip {...getTagProps({ index })} key={option} label={option} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    placeholder="Add tags"
                    error={Boolean(errors.tags)}
                    helperText={errors.tags?.message || 'Press Enter to add tags'}
                  />
                )}
              />
            )}
          />
        </Box>
      </Paper>

      {/* Code Editor */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Code
        </Typography>
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <Box>
              <CodeEditor
                value={field.value}
                onChange={handleCodeChange}
                language={watch('language')}
                height="600px"
              />
              {errors.code && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                  {errors.code.message}
                </Typography>
              )}
            </Box>
          )}
        />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {code.split('\n').length} lines · {code.length} characters
          </Typography>
          <Tooltip title="Use Ctrl+S or Cmd+S to save">
            <Typography variant="caption" color="text.secondary">
              💡 Tip: Use keyboard shortcuts
            </Typography>
          </Tooltip>
        </Box>
      </Paper>
    </Container>
  );
};
