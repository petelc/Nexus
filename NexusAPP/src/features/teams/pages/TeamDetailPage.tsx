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
  People as PeopleIcon,
  WorkOutline as WorkspaceIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  useGetTeamWithMembersQuery,
  useDeleteTeamMutation,
} from '@api/teamsApi';
import { useGetTeamWorkspacesQuery } from '@api/workspacesApi';
import { WorkspaceCard } from '@features/workspaces/components/WorkspaceCard';
import { EditTeamDialog } from '../components/EditTeamDialog';
import { useAppSelector } from '@app/hooks';
import { ROUTE_PATHS } from '@routes/routePaths';
import { TeamRole } from '@/types/api.types';

dayjs.extend(relativeTime);

function getInitials(username?: string): string {
  if (!username) return '?';
  const parts = username.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const TeamDetailPage = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const currentUserId = useAppSelector((state) => state.auth.user?.userId);

  const [editOpen, setEditOpen] = useState(false);

  const { data: team, isLoading, error } = useGetTeamWithMembersQuery(teamId!, {
    skip: !teamId,
  });
  const { data: workspaces, isLoading: workspacesLoading } = useGetTeamWorkspacesQuery(teamId!, {
    skip: !teamId,
  });
  const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation();

  const isOwner = team?.createdBy === currentUserId;

  const handleDelete = async () => {
    if (!team) return;
    if (window.confirm(`Are you sure you want to delete "${team.name}"? This action cannot be undone.`)) {
      try {
        await deleteTeam(team.id).unwrap();
        navigate(ROUTE_PATHS.TEAMS);
      } catch (err) {
        console.error('Failed to delete team:', err);
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

  if (error || !team) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error ? 'Failed to load team' : 'Team not found'}
        </Alert>
        <Button onClick={() => navigate(ROUTE_PATHS.TEAMS)} sx={{ mt: 2 }}>
          Back to Teams
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to={ROUTE_PATHS.DASHBOARD} underline="hover" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to={ROUTE_PATHS.TEAMS} underline="hover" color="inherit">
          Teams
        </Link>
        <Typography color="text.primary">{team.name}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <IconButton onClick={() => navigate(ROUTE_PATHS.TEAMS)} size="small">
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="h4" component="h1">
                  {team.name}
                </Typography>
                {isOwner && <Chip label="Owner" color="primary" size="small" />}
              </Box>
              {team.description && (
                <Typography variant="body1" color="text.secondary">
                  {team.description}
                </Typography>
              )}
            </Box>
          </Box>

          {isOwner && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Edit Team">
                <IconButton onClick={() => setEditOpen(true)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Team">
                <IconButton onClick={handleDelete} disabled={isDeleting} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PeopleIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {team.memberCount} {team.memberCount === 1 ? 'member' : 'members'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <WorkspaceIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {team.workspaceCount} {team.workspaceCount === 1 ? 'workspace' : 'workspaces'}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Created {dayjs(team.createdAt).fromNow()}
          </Typography>
        </Box>
      </Paper>

      {/* Members Section */}
      {team.members && team.members.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Members
          </Typography>
          <Grid container spacing={2}>
            {team.members.map((member) => (
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
                      color={member.role === TeamRole.Owner ? 'primary' : 'default'}
                      variant={member.role === TeamRole.Owner ? 'filled' : 'outlined'}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Workspaces Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Workspaces
        </Typography>
        {workspacesLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : workspaces && workspaces.length > 0 ? (
          <Grid container spacing={2}>
            {workspaces.map((workspace) => (
              <Grid key={workspace.workspaceId} size={{ xs: 12, sm: 6, md: 4 }}>
                <WorkspaceCard workspace={workspace} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No workspaces in this team yet.
          </Typography>
        )}
      </Paper>

      {/* Edit Dialog */}
      <EditTeamDialog
        open={editOpen}
        team={team}
        onClose={() => setEditOpen(false)}
      />
    </Container>
  );
};
