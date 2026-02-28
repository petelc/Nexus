import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  Restore as RestoreIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useGetDocumentVersionsQuery, useRestoreDocumentVersionMutation } from '@api/documentsApi';

dayjs.extend(relativeTime);

interface VersionHistoryProps {
  documentId: string;
  onClose?: () => void;
}

export const VersionHistory = ({ documentId, onClose }: VersionHistoryProps) => {
  const { data: versions, isLoading, error } = useGetDocumentVersionsQuery(documentId);
  const [restoreVersion, { isLoading: isRestoring }] = useRestoreDocumentVersionMutation();

  const handleRestore = async (versionNumber: number) => {
    if (window.confirm(`Are you sure you want to restore to version ${versionNumber}? This will create a new version.`)) {
      try {
        await restoreVersion({ id: documentId, versionNumber }).unwrap();
        if (onClose) {
          onClose();
        }
      } catch (error) {
        console.error('Failed to restore version:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load version history
      </Alert>
    );
  }

  if (!versions || versions.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No version history available
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Version History</Typography>
        {onClose && (
          <Button onClick={onClose} size="small">
            Close
          </Button>
        )}
      </Box>
      <List>
        {versions.map((version) => (
          <ListItem
            key={version.versionId}
            secondaryAction={
              <Box>
                <Tooltip title="Restore this version">
                  <IconButton
                    edge="end"
                    onClick={() => handleRestore(version.versionNumber)}
                    disabled={isRestoring}
                    size="small"
                  >
                    <RestoreIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            }
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '&:last-child': {
                borderBottom: 0,
              },
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2">
                    Version {version.versionNumber}
                  </Typography>
                  {version.versionNumber === versions.length && (
                    <Chip label="Current" size="small" color="primary" />
                  )}
                </Box>
              }
              secondary={
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {dayjs(version.createdAt).format('MMM D, YYYY [at] h:mm A')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {dayjs(version.createdAt).fromNow()}
                  </Typography>
                  {version.createdByUser && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      by {version.createdByUser.firstName} {version.createdByUser.lastName}
                    </Typography>
                  )}
                  {version.changeNote && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {version.changeNote}
                    </Typography>
                  )}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
