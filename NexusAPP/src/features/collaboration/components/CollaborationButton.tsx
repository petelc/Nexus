import { Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Group as CollabIcon } from '@mui/icons-material';
import { useState } from 'react';

interface CollaborationButtonProps {
  isInSession: boolean;
  isConnecting: boolean;
  panelOpen: boolean;
  onStart: () => Promise<void>;
  onTogglePanel: () => void;
}

export const CollaborationButton = ({
  isInSession,
  isConnecting,
  panelOpen,
  onStart,
  onTogglePanel,
}: CollaborationButtonProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    try {
      await onStart();
    } catch (err: any) {
      const msg = err?.message ?? 'Failed to connect to collaboration service.';
      setError(msg.includes('SignalR') || msg.includes('WebSocket') || msg.includes('connect')
        ? 'Could not connect to the collaboration service. Make sure the API is running.'
        : msg);
    }
  };

  if (isInSession) {
    return (
      <Button
        variant={panelOpen ? 'contained' : 'outlined'}
        startIcon={<CollabIcon />}
        onClick={onTogglePanel}
        size="small"
        color="primary"
      >
        Collaboration
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outlined"
        startIcon={isConnecting ? <CircularProgress size={16} /> : <CollabIcon />}
        onClick={handleStart}
        disabled={isConnecting}
        size="small"
      >
        {isConnecting ? 'Connecting…' : 'Collaborate'}
      </Button>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)} variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};
