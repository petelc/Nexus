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
  useGetTeamWithMembersQuery,
  useAddTeamMemberMutation,
  useRemoveTeamMemberMutation,
  useUpdateTeamMemberRoleMutation,
} from '@api/teamsApi';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { closeTeamMembers } from '../teamsSlice';
import { TeamRole } from '@types/api.types';

function getInitials(username?: string): string {
  if (!username) return '?';
  const parts = username.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const TeamMembersDialog = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.teams.showMembersDialog);
  const selectedTeamId = useAppSelector((state) => state.teams.selectedTeamId);
  const currentUserId = useAppSelector((state) => state.auth.user?.userId);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamRole>(TeamRole.Member);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const { data: team, isLoading, error } = useGetTeamWithMembersQuery(selectedTeamId!, {
    skip: !selectedTeamId,
  });

  const [addMember, { isLoading: isInviting }] = useAddTeamMemberMutation();
  const [removeMember] = useRemoveTeamMemberMutation();
  const [updateRole] = useUpdateTeamMemberRoleMutation();

  const handleClose = () => {
    dispatch(closeTeamMembers());
    setInviteEmail('');
    setInviteRole(TeamRole.Member);
    setInviteSuccess(false);
    setInviteError(null);
  };

  const handleInvite = async () => {
    if (!selectedTeamId || !inviteEmail.trim()) return;
    setInviteSuccess(false);
    setInviteError(null);
    try {
      await addMember({
        id: selectedTeamId,
        data: { email: inviteEmail.trim(), role: inviteRole },
      }).unwrap();
      setInviteEmail('');
      setInviteRole(TeamRole.Member);
      setInviteSuccess(true);
    } catch (err) {
      setInviteError('Failed to invite member. Check the email and try again.');
    }
  };

  const handleRemove = async (userId: string) => {
    if (!selectedTeamId) return;
    try {
      await removeMember({ id: selectedTeamId, userId }).unwrap();
    } catch (err) {
      console.error('Failed to remove member:', err);
    }
  };

  const handleRoleChange = async (userId: string, newRole: TeamRole) => {
    if (!selectedTeamId) return;
    try {
      await updateRole({ id: selectedTeamId, userId, data: { role: newRole } }).unwrap();
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const isOwnerOrAdmin = team?.members?.some(
    (m) => m.userId === currentUserId && (m.role === TeamRole.Owner || m.role === TeamRole.Admin)
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Team Members{team ? ` — ${team.name}` : ''}
      </DialogTitle>
      <DialogContent>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load team details. Please try again.
          </Alert>
        )}

        {team && (
          <Box>
            {/* Member List */}
            {team.members && team.members.length > 0 ? (
              <List disablePadding>
                {team.members.map((member, index) => (
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
                        {isOwnerOrAdmin && member.role !== TeamRole.Owner ? (
                          <Select
                            size="small"
                            value={member.role}
                            onChange={(e) => handleRoleChange(member.userId, e.target.value as TeamRole)}
                            sx={{ minWidth: 110 }}
                          >
                            <MenuItem value={TeamRole.Admin}>Admin</MenuItem>
                            <MenuItem value={TeamRole.Member}>Member</MenuItem>
                          </Select>
                        ) : (
                          <Chip
                            label={member.role}
                            size="small"
                            color={member.role === TeamRole.Owner ? 'primary' : 'default'}
                            variant={member.role === TeamRole.Owner ? 'filled' : 'outlined'}
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
                      onChange={(e) => setInviteRole(e.target.value as TeamRole)}
                    >
                      <MenuItem value={TeamRole.Admin}>Admin</MenuItem>
                      <MenuItem value={TeamRole.Member}>Member</MenuItem>
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
