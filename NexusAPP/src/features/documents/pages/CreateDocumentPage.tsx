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
  IconButton,
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
  useGetDocumentByIdQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
} from '@api/documentsApi';
import { RichTextEditor } from '../components/RichTextEditor';
import { ROUTE_PATHS, buildRoute } from '@routes/routePaths';
import { DocumentStatus } from '@/types/api.types';
import type { EditorState } from 'lexical';
import { useAppSelector } from '@app/hooks';

const documentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  status: z.nativeEnum(DocumentStatus),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed'),
});

type DocumentFormData = z.infer<typeof documentSchema>;

export const CreateDocumentPage = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(documentId);
  const currentWorkspaceId = useAppSelector((state) => state.workspaces.currentWorkspaceId);

  const { data: existingDocument, isLoading: isLoadingDocument } = useGetDocumentByIdQuery(documentId!, {
    skip: !isEditMode,
  });
  const [createDocument, { isLoading: isCreating, error: createError }] = useCreateDocumentMutation();
  const [updateDocument, { isLoading: isUpdating, error: updateError }] = useUpdateDocumentMutation();

  const [tagInput, setTagInput] = useState('');

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: '',
      content: '',
      status: DocumentStatus.Draft,
      tags: [],
    },
  });

  useEffect(() => {
    if (existingDocument) {
      setValue('title', existingDocument.title);
      setValue('content', existingDocument.content);
      setValue('status', existingDocument.status);
      setValue('tags', existingDocument.tags.map((tag) => tag.name));
    }
  }, [existingDocument, setValue]);

  const handleBack = () => {
    if (isEditMode && documentId) {
      navigate(buildRoute.documentDetail(documentId));
    } else {
      navigate(ROUTE_PATHS.DOCUMENTS);
    }
  };

  const onSubmit = async (data: DocumentFormData) => {
    try {
      if (isEditMode && documentId) {
        await updateDocument({
          id: documentId,
          data: {
            title: data.title,
            content: data.content,
            status: data.status,
            tags: data.tags,
          },
        }).unwrap();
        navigate(buildRoute.documentDetail(documentId));
      } else {
        if (!currentWorkspaceId) {
          alert('Please select a workspace first');
          return;
        }
        const newDocument = await createDocument({
          title: data.title,
          content: data.content,
          workspaceId: currentWorkspaceId,
          status: data.status,
          tags: data.tags,
        }).unwrap();
        navigate(buildRoute.documentDetail(newDocument.documentId));
      }
    } catch (error) {
      console.error('Failed to save document:', error);
    }
  };

  const handleContentChange = (content: string, _editorState: EditorState) => {
    setValue('content', content);
  };

  if (isLoadingDocument) {
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
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to={ROUTE_PATHS.DASHBOARD} underline="hover" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to={ROUTE_PATHS.DOCUMENTS} underline="hover" color="inherit">
          Documents
        </Link>
        <Typography color="text.primary">
          {isEditMode ? 'Edit Document' : 'New Document'}
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {isEditMode ? 'Edit Document' : 'Create New Document'}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={() => handleSubmit(onSubmit)()}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to save document. Please try again.
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                size="medium"
              />
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Status
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {Object.values(DocumentStatus).map((status) => (
                    <Chip
                      key={status}
                      label={status}
                      onClick={() => field.onChange(status)}
                      color={field.value === status ? 'primary' : 'default'}
                      variant={field.value === status ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Box>
            )}
          />

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

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Content
        </Typography>
        <RichTextEditor
          key={existingDocument?.documentId || 'new'}
          initialContent={existingDocument?.content}
          onChange={handleContentChange}
          placeholder="Start writing your document..."
          autoFocus
        />
      </Paper>
    </Container>
  );
};
