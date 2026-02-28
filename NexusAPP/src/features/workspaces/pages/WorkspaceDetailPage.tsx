import {
  Box,
  Container,
  Paper,
  Typography,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Description as DocumentIcon,
  Code as CodeIcon,
  AccountTree as DiagramIcon,
  Group as TeamIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  useGetWorkspaceWithMembersQuery,
  useDeleteWorkspaceMutation,
  WorkspaceRole,
} from '@api/workspacesApi';
import { EditWorkspaceDialog } from '../components/EditWorkspaceDialog';
import { WorkspaceMembersDialog } from '../components/WorkspaceMembersDialog';
import { useAppSelector } from '@app/hooks';
import { ROUTE_PATHS, buildRoute } from '@routes/routePaths';

dayjs.extend(relativeTime);

function getInitials(username?: string): string {
  if (!username) return '?';
  const parts = username.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const ROLE_COLORS: Record<WorkspaceRole, 'primary' | 'warning' | 'info' | 'default'> = {
  [WorkspaceRole.Owner]: 'primary',
  [WorkspaceRole.Admin]: 'warning',
  [WorkspaceRole.Editor]: 'info',
  [WorkspaceRole.Viewer]: 'default',
};

export const WorkspaceDetailPage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const currentUserId = useAppSelector((state) => state.auth.user?.userId);

  const [editOpen, setEditOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);

  const { data: workspace, isLoading, error } = useGetWorkspaceWithMembersQuery(workspaceId!, {
    skip: !workspaceId,
  });
  const [deleteWorkspace, { isLoading: isDeleting }] = useDeleteWorkspaceMutation();

  const isOwner = workspace?.createdBy === currentUserId;

  const handleDelete = async () => {
    if (!workspace) return;
    if (window.confirm(`Are you sure you want to delete "${workspace.name}"? This action cannot be undone.`)) {
      try {
        await deleteWorkspace(workspace.workspaceId).unwrap();
        navigate(ROUTE_PATHS.WORKSPACES);
      } catch (err) {
        console.error('Failed to delete workspace:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !workspace) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error ? 'Failed to load workspace' : 'Workspace not found'}
        </Alert>
        <Button onClick={() => navigate(ROUTE_PATHS.WORKSPACES)} sx={{ mt: 2 }}>
          Back to Workspaces
        </Button>
      </Container>
    );
  }

  const members = workspace.members ?? [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to={ROUTE_PATHS.DASHBOARD} underline="hover" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to={ROUTE_PATHS.WORKSPACES} underline="hover" color="inherit">
          Workspaces
        </Link>
        <Typography color="text.primary">{workspace.name}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <IconButton onClick={() => navigate(ROUTE_PATHS.WORKSPACES)} size="small">
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom={false}>
                {workspace.name}
              </Typography>
              {workspace.description && (
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                  {workspace.description}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Manage Members">
              <IconButton onClick={() => setMembersOpen(true)}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            {isOwner && (
              <>
                <Tooltip title="Edit Workspace">
                  <IconButton onClick={() => setEditOpen(true)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Workspace">
                  <IconButton onClick={handleDelete} disabled={isDeleting} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Stats + Team */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
          <Tooltip title="Documents">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <DocumentIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {workspace.documentCount} {workspace.documentCount === 1 ? 'document' : 'documents'}
              </Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Snippets">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CodeIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {workspace.snippetCount} {workspace.snippetCount === 1 ? 'snippet' : 'snippets'}
              </Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Diagrams">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <DiagramIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {workspace.diagramCount} {workspace.diagramCount === 1 ? 'diagram' : 'diagrams'}
              </Typography>
            </Box>
          </Tooltip>
          <Chip
            icon={<TeamIcon />}
            label="View Team"
            size="small"
            variant="outlined"
            clickable
            onClick={() => navigate(buildRoute.teamDetail(workspace.teamId))}
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            Created {dayjs(workspace.createdAt).fromNow()}
          </Typography>
        </Box>
      </Paper>

      {/* Members Section */}
      {members.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Members
          </Typography>
          <Grid container spacing={2}>
            {members.map((member) => (
              <Grid key={member.userId} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card variant="outlined">
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Avatar sx={{ width: 40, height: 40 }}>
                      {getInitials(member.user?.username ?? member.userId)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={500} noWrap>
                        {member.user?.username ?? member.userId}
                      </Typography>
                      {member.user?.email && (
                        <Typography variant="caption" color="text.secondary" noWrap display="block">
                          {member.user.email}
                        </Typography>
                      )}
                    </Box>
                    <Chip
                      label={member.role}
                      size="small"
                      color={ROLE_COLORS[member.role]}
                      variant={member.role === WorkspaceRole.Owner ? 'filled' : 'outlined'}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Dialogs */}
      <EditWorkspaceDialog
        open={editOpen}
        workspace={workspace}
        onClose={() => setEditOpen(false)}
      />
      <WorkspaceMembersDialog
        open={membersOpen}
        workspace={workspace}
        onClose={() => setMembersOpen(false)}
      />
    </Container>
  );
};
