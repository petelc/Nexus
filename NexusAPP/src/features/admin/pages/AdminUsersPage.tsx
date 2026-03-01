import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  Pagination,
  Snackbar,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  ManageAccounts as ManageAccountsIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import {
  useGetUsersQuery,
  useUpdateUserRolesMutation,
  useUpdateUserStatusMutation,
} from '@api/adminApi';
import { AdminUserDto } from '@/types';

// ── Available roles ───────────────────────────────────────────────────────────

const ALL_ROLES = ['Viewer', 'Editor', 'Admin', 'Guest'] as const;

const ROLE_COLORS: Record<string, 'default' | 'primary' | 'error' | 'warning'> = {
  Admin: 'error',
  Editor: 'primary',
  Viewer: 'default',
  Guest: 'warning',
};

// ── Role assignment dialog ────────────────────────────────────────────────────

function EditRolesDialog({
  user,
  open,
  onClose,
}: {
  user: AdminUserDto;
  open: boolean;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<string[]>(user.roles);
  const [updateRoles, { isLoading }] = useUpdateUserRolesMutation();
  const [error, setError] = useState<string | null>(null);

  const handleToggle = (role: string) => {
    setSelected((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const handleSave = async () => {
    setError(null);
    try {
      await updateRoles({ userId: user.userId, body: { roles: selected } }).unwrap();
      onClose();
    } catch (err: any) {
      setError(err?.data?.error ?? 'Failed to update roles.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        Edit roles — {user.firstName} {user.lastName}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {user.email}
        </Typography>
        <FormGroup>
          {ALL_ROLES.map((role) => (
            <FormControlLabel
              key={role}
              control={
                <Checkbox
                  checked={selected.includes(role)}
                  onChange={() => handleToggle(role)}
                />
              }
              label={role}
            />
          ))}
        </FormGroup>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={isLoading}>
          {isLoading ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export const AdminUsersPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [editUser, setEditUser] = useState<AdminUserDto | null>(null);
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);

  const { data, isLoading, isFetching, isError } = useGetUsersQuery({ page, pageSize: 20, search: search || undefined });
  const [updateStatus] = useUpdateUserStatusMutation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleToggleStatus = async (user: AdminUserDto) => {
    try {
      await updateStatus({ userId: user.userId, body: { isActive: !user.isActive } }).unwrap();
      setStatusSuccess(`${user.username} ${!user.isActive ? 'activated' : 'deactivated'}.`);
    } catch {
      // error visible in row — could add inline error handling here
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>
        User Management
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Manage user accounts, roles, and status. Admin only.
      </Typography>

      {/* Search */}
      <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 3, maxWidth: 420 }}>
        <TextField
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name, email or username…"
          size="small"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Loading */}
      {(isLoading || isFetching) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error */}
      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load users. Make sure the API is running and you have Admin role.
        </Alert>
      )}

      {/* Table */}
      {data && !isLoading && (
        <>
          <Typography variant="body2" color="text.secondary" mb={1}>
            {data.totalCount} user{data.totalCount !== 1 ? 's' : ''}
          </Typography>

          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Roles</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.items.map((user) => (
                  <TableRow key={user.userId} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar
                          src={user.avatarUrl}
                          sx={{ width: 32, height: 32, fontSize: '0.8rem' }}
                        >
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            @{user.username}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                        {user.roles.length === 0 ? (
                          <Typography variant="caption" color="text.disabled">None</Typography>
                        ) : (
                          user.roles.map((role) => (
                            <Chip
                              key={role}
                              label={role}
                              size="small"
                              color={ROLE_COLORS[role] ?? 'default'}
                              variant="outlined"
                            />
                          ))
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={user.isActive}
                        onChange={() => handleToggleStatus(user)}
                        size="small"
                        color="success"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit roles">
                        <IconButton size="small" onClick={() => setEditUser(user)}>
                          <ManageAccountsIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={data.totalPages}
                page={page}
                onChange={(_, v) => setPage(v)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}

      {/* Role edit dialog */}
      {editUser && (
        <EditRolesDialog
          user={editUser}
          open={Boolean(editUser)}
          onClose={() => setEditUser(null)}
        />
      )}

      {/* Status change snackbar */}
      <Snackbar
        open={Boolean(statusSuccess)}
        autoHideDuration={3000}
        onClose={() => setStatusSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setStatusSuccess(null)}>
          {statusSuccess}
        </Alert>
      </Snackbar>
    </Box>
  );
};
