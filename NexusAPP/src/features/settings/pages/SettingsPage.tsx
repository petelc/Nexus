import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@app/hooks';
import { updateUser } from '@features/auth/authSlice';
import {
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useUpdatePreferencesMutation,
  useChangePasswordMutation,
  useSetup2FAMutation,
  useVerify2FAMutation,
  useDisable2FAMutation,
} from '@features/auth/authApi';

// ── Tab panel helper ─────────────────────────────────────────────────────────

function TabPanel({ value, index, children }: { value: number; index: number; children: React.ReactNode }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

// ── Profile tab ──────────────────────────────────────────────────────────────

function ProfileTab() {
  const dispatch = useAppDispatch();
  const { data: user, isLoading } = useGetCurrentUserQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    avatarUrl: '',
    bio: '',
    title: '',
    department: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        avatarUrl: user.avatarUrl ?? '',
        bio: user.bio ?? '',
        title: user.title ?? '',
        department: user.department ?? '',
      });
    }
  }, [user]);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const updated = await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        avatarUrl: form.avatarUrl || undefined,
        bio: form.bio || undefined,
        title: form.title || undefined,
        department: form.department || undefined,
      }).unwrap();
      dispatch(updateUser(updated));
      setSuccess(true);
    } catch (err: any) {
      setError(err?.data?.error ?? 'Failed to update profile.');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3} maxWidth={560}>
        <Stack direction="row" spacing={2}>
          <TextField
            label="First name"
            value={form.firstName}
            onChange={handleChange('firstName')}
            required
            fullWidth
          />
          <TextField
            label="Last name"
            value={form.lastName}
            onChange={handleChange('lastName')}
            required
            fullWidth
          />
        </Stack>
        <TextField
          label="Avatar URL"
          value={form.avatarUrl}
          onChange={handleChange('avatarUrl')}
          placeholder="https://…"
          fullWidth
        />
        <TextField
          label="Bio"
          value={form.bio}
          onChange={handleChange('bio')}
          multiline
          minRows={3}
          fullWidth
          placeholder="A short bio about yourself"
        />
        <Stack direction="row" spacing={2}>
          <TextField
            label="Title"
            value={form.title}
            onChange={handleChange('title')}
            fullWidth
            placeholder="e.g. Senior Engineer"
          />
          <TextField
            label="Department"
            value={form.department}
            onChange={handleChange('department')}
            fullWidth
            placeholder="e.g. Engineering"
          />
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}

        <Box>
          <Button type="submit" variant="contained" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save profile'}
          </Button>
        </Box>
      </Stack>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Profile updated.
        </Alert>
      </Snackbar>
    </Box>
  );
}

// ── Preferences tab ──────────────────────────────────────────────────────────

function PreferencesTab() {
  const dispatch = useAppDispatch();
  const { data: user, isLoading } = useGetCurrentUserQuery();
  const [updatePreferences, { isLoading: isSaving }] = useUpdatePreferencesMutation();

  const [form, setForm] = useState({
    theme: 'Auto',
    language: 'en',
    notificationsEnabled: true,
    emailDigest: 'Weekly',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        theme: user.theme ?? 'Auto',
        language: user.language ?? 'en',
        notificationsEnabled: user.notificationsEnabled ?? true,
        emailDigest: user.emailDigest ?? 'Weekly',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const updated = await updatePreferences(form).unwrap();
      dispatch(updateUser(updated));
      setSuccess(true);
    } catch (err: any) {
      setError(err?.data?.error ?? 'Failed to save preferences.');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3} maxWidth={480}>
        <Box>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Theme
          </Typography>
          <Select
            value={form.theme}
            onChange={(e) => setForm((p) => ({ ...p, theme: e.target.value }))}
            size="small"
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="Light">Light</MenuItem>
            <MenuItem value="Dark">Dark</MenuItem>
            <MenuItem value="Auto">Auto (system)</MenuItem>
          </Select>
        </Box>

        <TextField
          label="Language"
          value={form.language}
          onChange={(e) => setForm((p) => ({ ...p, language: e.target.value }))}
          size="small"
          sx={{ maxWidth: 180 }}
          placeholder="en"
        />

        <FormControlLabel
          control={
            <Switch
              checked={form.notificationsEnabled}
              onChange={(e) => setForm((p) => ({ ...p, notificationsEnabled: e.target.checked }))}
            />
          }
          label="Enable notifications"
        />

        <Box>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Email digest
          </Typography>
          <Select
            value={form.emailDigest}
            onChange={(e) => setForm((p) => ({ ...p, emailDigest: e.target.value }))}
            size="small"
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="Daily">Daily</MenuItem>
            <MenuItem value="Weekly">Weekly</MenuItem>
            <MenuItem value="None">None</MenuItem>
          </Select>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <Box>
          <Button type="submit" variant="contained" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save preferences'}
          </Button>
        </Box>
      </Stack>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Preferences saved.
        </Alert>
      </Snackbar>
    </Box>
  );
}

// ── Security tab ─────────────────────────────────────────────────────────────

function SecurityTab() {
  const { data: user } = useGetCurrentUserQuery();
  const [changePassword, { isLoading: isChanging }] = useChangePasswordMutation();
  const [setup2FA, { isLoading: isSettingUp2FA }] = useSetup2FAMutation();
  const [verify2FA, { isLoading: isVerifying }] = useVerify2FAMutation();
  const [disable2FA, { isLoading: isDisabling }] = useDisable2FAMutation();

  // Change password form
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  // 2FA state
  const [twoFaStep, setTwoFaStep] = useState<'idle' | 'setup' | 'verify' | 'disable'>('idle');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [twoFaCode, setTwoFaCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const [twoFaError, setTwoFaError] = useState<string | null>(null);
  const [twoFaSuccess, setTwoFaSuccess] = useState<string | null>(null);

  const handlePwSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    if (pwForm.newPassword !== pwForm.confirmNewPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    try {
      await changePassword(pwForm).unwrap();
      setPwForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setPwSuccess(true);
    } catch (err: any) {
      setPwError(err?.data?.error ?? 'Failed to change password.');
    }
  };

  const handleSetup2FA = async () => {
    setTwoFaError(null);
    try {
      const result = await setup2FA().unwrap();
      setQrCodeUrl(result.qrCodeUrl);
      setTwoFaStep('setup');
    } catch (err: any) {
      setTwoFaError(err?.data?.error ?? 'Failed to start 2FA setup.');
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFaError(null);
    try {
      await verify2FA({ code: twoFaCode }).unwrap();
      setTwoFaStep('idle');
      setTwoFaCode('');
      setTwoFaSuccess('Two-factor authentication enabled.');
    } catch (err: any) {
      setTwoFaError(err?.data?.error ?? 'Invalid code. Please try again.');
    }
  };

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFaError(null);
    try {
      await disable2FA({ password: disablePassword }).unwrap();
      setTwoFaStep('idle');
      setDisablePassword('');
      setTwoFaSuccess('Two-factor authentication disabled.');
    } catch (err: any) {
      setTwoFaError(err?.data?.error ?? 'Failed to disable 2FA. Check your password.');
    }
  };

  return (
    <Stack spacing={4} maxWidth={560}>
      {/* Change password */}
      <Box>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Change password
        </Typography>
        <Box component="form" onSubmit={handlePwSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Current password"
              type="password"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="New password"
              type="password"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
              required
              fullWidth
              helperText="Minimum 8 characters"
            />
            <TextField
              label="Confirm new password"
              type="password"
              value={pwForm.confirmNewPassword}
              onChange={(e) => setPwForm((p) => ({ ...p, confirmNewPassword: e.target.value }))}
              required
              fullWidth
            />
            {pwError && <Alert severity="error">{pwError}</Alert>}
            <Box>
              <Button type="submit" variant="contained" disabled={isChanging}>
                {isChanging ? 'Updating…' : 'Update password'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>

      <Divider />

      {/* Two-factor authentication */}
      <Box>
        <Typography variant="h6" fontWeight={600} mb={0.5}>
          Two-factor authentication
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {user?.twoFactorEnabled
            ? 'Two-factor authentication is currently enabled.'
            : 'Add an extra layer of security to your account.'}
        </Typography>

        {twoFaError && <Alert severity="error" sx={{ mb: 2 }}>{twoFaError}</Alert>}
        {twoFaSuccess && <Alert severity="success" sx={{ mb: 2 }}>{twoFaSuccess}</Alert>}

        {/* Idle: show enable/disable button */}
        {twoFaStep === 'idle' && (
          <>
            {!user?.twoFactorEnabled ? (
              <Button variant="outlined" onClick={handleSetup2FA} disabled={isSettingUp2FA}>
                {isSettingUp2FA ? 'Setting up…' : 'Enable 2FA'}
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="error"
                onClick={() => { setTwoFaStep('disable'); setTwoFaError(null); }}
              >
                Disable 2FA
              </Button>
            )}
          </>
        )}

        {/* Setup: show QR code + code entry */}
        {twoFaStep === 'setup' && (
          <Stack spacing={2}>
            <Typography variant="body2">
              Scan this QR code with your authenticator app (e.g. Google Authenticator):
            </Typography>
            {qrCodeUrl && (
              <Box
                component="img"
                src={qrCodeUrl}
                alt="2FA QR Code"
                sx={{ width: 180, height: 180, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
              />
            )}
            <Box component="form" onSubmit={handleVerify2FA}>
              <Stack spacing={2} maxWidth={280}>
                <TextField
                  label="Verification code"
                  value={twoFaCode}
                  onChange={(e) => setTwoFaCode(e.target.value)}
                  required
                  size="small"
                  inputProps={{ maxLength: 6 }}
                  placeholder="000000"
                />
                <Stack direction="row" spacing={1}>
                  <Button type="submit" variant="contained" disabled={isVerifying}>
                    {isVerifying ? 'Verifying…' : 'Verify & enable'}
                  </Button>
                  <Button variant="text" onClick={() => setTwoFaStep('idle')}>
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        )}

        {/* Disable: confirm with password */}
        {twoFaStep === 'disable' && (
          <Box component="form" onSubmit={handleDisable2FA}>
            <Stack spacing={2} maxWidth={320}>
              <Typography variant="body2" color="text.secondary">
                Enter your password to confirm disabling two-factor authentication.
              </Typography>
              <TextField
                label="Password"
                type="password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                required
                size="small"
                fullWidth
              />
              <Stack direction="row" spacing={1}>
                <Button type="submit" variant="contained" color="error" disabled={isDisabling}>
                  {isDisabling ? 'Disabling…' : 'Confirm disable'}
                </Button>
                <Button variant="text" onClick={() => setTwoFaStep('idle')}>
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </Box>

      <Snackbar
        open={pwSuccess}
        autoHideDuration={3000}
        onClose={() => setPwSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setPwSuccess(false)}>
          Password changed successfully.
        </Alert>
      </Snackbar>
    </Stack>
  );
}

// ── Main settings page ───────────────────────────────────────────────────────

export const SettingsPage = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Settings
      </Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Profile" />
        <Tab label="Preferences" />
        <Tab label="Security" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <ProfileTab />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <PreferencesTab />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <SecurityTab />
      </TabPanel>
    </Box>
  );
};
