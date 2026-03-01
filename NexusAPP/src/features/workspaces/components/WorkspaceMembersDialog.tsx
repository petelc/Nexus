import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Select,
  MenuItem,
  IconButton,
  Divider,
  TextField,
  FormControl,
  InputLabel,
} from '@mui/material';
import { PersonRemove as RemoveIcon } from '@mui/icons-material';
import { useState } from 'react';
import {
  useGetWorkspaceWithMembersQuery,
  useAddWorkspaceMemberMutation,
  useRemoveWorkspaceMemberMutation,
  useUpdateWorkspaceMemberRoleMutation,
  WorkspaceRole,
} from '@api/workspacesApi';
import { useAppSelector } from '@app/hooks';
import type { WorkspaceDto } from '@/types/api.types';

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

interface WorkspaceMembersDialogProps {
  open: boolean;
  onClose: () => void;
  workspace: WorkspaceDto | null;
}

export const WorkspaceMembersDialog = ({ open, onClose, workspace }: WorkspaceMembersDialogProps) => {
  const currentUserId = useAppSelector((state) => state.auth.user?.userId);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<WorkspaceRole>(WorkspaceRole.Viewer);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const { data: workspaceWithMembers, isLoading, error } = useGetWorkspaceWithMembersQuery(
    workspace?.workspaceId ?? '',
    { skip: !workspace?.workspaceId || !open }
  );

  const [addMember, { isLoading: isInviting }] = useAddWorkspaceMemberMutation();
  const [removeMember] = useRemoveWorkspaceMemberMutation();
  const [updateRole] = useUpdateWorkspaceMemberRoleMutation();

  const handleClose = () => {
    onClose();
    setInviteEmail('');
    setInviteRole(WorkspaceRole.Viewer);
    setInviteSuccess(false);
    setInviteError(null);
  };

  const handleInvite = async () => {
    if (!workspace || !inviteEmail.trim()) return;
    setInviteSuccess(false);
    setInviteError(null);
    try {
      await addMember({
        id: workspace.workspaceId,
        data: { email: inviteEmail.trim(), role: inviteRole },
      }).unwrap();
      setInviteEmail('');
      setInviteRole(WorkspaceRole.Viewer);
      setInviteSuccess(true);
    } catch (err) {
      setInviteError('Failed to invite member. Check the email and try again.');
    }
  };

  const handleRemove = async (userId: string) => {
    if (!workspace) return;
    try {
      await removeMember({ id: workspace.workspaceId, userId }).unwrap();
    } catch (err) {
      console.error('Failed to remove member:', err);
    }
  };

  const handleRoleChange = async (userId: string, newRole: WorkspaceRole) => {
    if (!workspace) return;
    try {
      await updateRole({ id: workspace.workspaceId, userId, data: { role: newRole } }).unwrap();
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const members = workspaceWithMembers?.members ?? [];
  const currentMember = members.find((m) => m.userId === currentUserId);
  const isOwnerOrAdmin =
    currentMember?.role === WorkspaceRole.Owner || currentMember?.role === WorkspaceRole.Admin;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Members{workspace ? ` — ${workspace.name}` : ''}
      </DialogTitle>
      <DialogContent>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load workspace members. Please try again.
          </Alert>
        )}

        {workspaceWithMembers && (
          <Box>
            {/* Member List */}
            {members.length > 0 ? (
              <List disablePadding>
                {members.map((member, index) => (
                  <Box key={member.userId}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem
                      sx={{ px: 0, py: 1 }}
                      secondaryAction={
                        isOwnerOrAdmin && member.userId !== currentUserId ? (
                          <IconButton
                            edge="end"
                            size="small"
                            color="error"
                            onClick={() => handleRemove(member.userId)}
                            title="Remove member"
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                        ) : null
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ width: 36, height: 36, fontSize: '0.85rem' }}>
                          {getInitials(member.user?.username ?? member.userId)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={member.user?.username ?? member.userId}
                        secondary={member.user?.email}
                      />
                      <Box sx={{ mr: isOwnerOrAdmin && member.userId !== currentUserId ? 5 : 0 }}>
                        {isOwnerOrAdmin && member.role !== WorkspaceRole.Owner ? (
                          <Select
                            size="small"
                            value={member.role}
                            onChange={(e) => handleRoleChange(member.userId, e.target.value as WorkspaceRole)}
                            sx={{ minWidth: 110 }}
                          >
                            <MenuItem value={WorkspaceRole.Admin}>Admin</MenuItem>
                            <MenuItem value={WorkspaceRole.Editor}>Editor</MenuItem>
                            <MenuItem value={WorkspaceRole.Viewer}>Viewer</MenuItem>
                          </Select>
                        ) : (
                          <Chip
                            label={member.role}
                            size="small"
                            color={ROLE_COLORS[member.role]}
                            variant={member.role === WorkspaceRole.Owner ? 'filled' : 'outlined'}
                          />
                        )}
                      </Box>
                    </ListItem>
                  </Box>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                No members found.
              </Typography>
            )}

            {/* Invite Section */}
            {isOwnerOrAdmin && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Invite Member
                </Typography>

                {inviteSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }} onClose={() => setInviteSuccess(false)}>
                    Invitation sent successfully.
                  </Alert>
                )}
                {inviteError && (
                  <Alert severity="error" sx={{ mb: 2 }} onClose={() => setInviteError(null)}>
                    {inviteError}
                  </Alert>
                )}

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <TextField
                    label="Email address"
                    type="email"
                    size="small"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    sx={{ flexGrow: 1 }}
                    onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                  />
                  <FormControl size="small" sx={{ minWidth: 110 }}>
                    <InputLabel>Role</InputLabel>
                    <Select
                      label="Role"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as WorkspaceRole)}
                    >
                      <MenuItem value={WorkspaceRole.Admin}>Admin</MenuItem>
                      <MenuItem value={WorkspaceRole.Editor}>Editor</MenuItem>
                      <MenuItem value={WorkspaceRole.Viewer}>Viewer</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    onClick={handleInvite}
                    disabled={isInviting || !inviteEmail.trim()}
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    {isInviting ? 'Inviting...' : 'Invite'}
                  </Button>
                </Box>
              </>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
