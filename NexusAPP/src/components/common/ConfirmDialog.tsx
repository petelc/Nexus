import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: 'error' | 'primary' | 'warning';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmColor = 'error',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onCancel} disabled={loading}>
        {cancelLabel}
      </Button>
      <Button variant="contained" color={confirmColor} onClick={onConfirm} disabled={loading}>
        {loading ? 'Please wait…' : confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);
