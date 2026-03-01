import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Close as CloseIcon,
  ExitToApp as LeaveIcon,
  StopCircle as EndIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useAppDispatch } from '@app/hooks';
import { setPanelOpen } from '../collaborationSlice';
import { ParticipantList } from './ParticipantList';
import { CommentThread } from './CommentThread';
import { CommentBox } from './CommentBox';
import { useAddCommentMutation, useDeleteCommentMutation, useReplyToCommentMutation } from '@api/collaborationApi';
import type { CommentDto, ParticipantInfoDto } from '@/types/api.types';

interface CollaborationPanelProps {
  open: boolean;
  sessionId: string | null;
  resourceId: string;
  resourceType: string;
  participants: ParticipantInfoDto[];
  participantCount: number;
  sessionStatus: string | null;
  comments: CommentDto[];
  currentUserId?: string;
  onLeave: () => Promise<void>;
  onEnd?: () => Promise<void>;
}

export const CollaborationPanel = ({
  open,
  sessionId,
  resourceId,
  resourceType,
  participants,
  participantCount,
  sessionStatus,
  comments,
  currentUserId,
  onLeave,
  onEnd,
}: CollaborationPanelProps) => {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState(0);
  const [leavingOrEnding, setLeavingOrEnding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [addComment] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [replyToComment] = useReplyToCommentMutation();

  const handleAddComment = async (text: string) => {
    if (!sessionId) return;
    await addComment({ resourceType, resourceId, sessionId, text }).unwrap();
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId).unwrap();
  };

  const handleReply = async (commentId: string, text: string) => {
    await replyToComment({ commentId, data: { text } }).unwrap();
  };

  const handleLeave = async () => {
    setLeavingOrEnding(true);
    setError(null);
    try {
      await onLeave();
    } catch {
      setError('Failed to leave session.');
      setLeavingOrEnding(false);
    }
  };

  const handleEnd = async () => {
    if (!onEnd) return;
    setLeavingOrEnding(true);
    setError(null);
    try {
      await onEnd();
    } catch {
      setError('Failed to end session.');
      setLeavingOrEnding(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      variant="persistent"
      sx={{
        width: 360,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 360,
          boxSizing: 'border-box',
          top: 64, // below AppBar
          height: 'calc(100% - 64px)',
          borderLeft: 1,
          borderColor: 'divider',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            Collaboration
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {sessionStatus === 'Active' ? `${participantCount} active` : sessionStatus ?? 'Connecting…'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {onEnd && (
            <Tooltip title="End session for everyone">
              <span>
                <IconButton size="small" color="error" onClick={handleEnd} disabled={leavingOrEnding}>
                  <EndIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          )}
          <Tooltip title="Leave session">
            <span>
              <IconButton size="small" onClick={handleLeave} disabled={leavingOrEnding}>
                {leavingOrEnding ? <CircularProgress size={16} /> : <LeaveIcon fontSize="small" />}
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Close panel">
            <IconButton size="small" onClick={() => dispatch(setPanelOpen(false))}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ m: 1 }}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_e, v) => setTab(v)}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Participants" />
        <Tab label={`Comments${comments.length > 0 ? ` (${comments.length})` : ''}`} />
      </Tabs>

      {/* Tab content */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {tab === 0 && (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Currently active
            </Typography>
            <ParticipantList participants={participants} />
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <CommentBox onSubmit={handleAddComment} />
            <Divider />
            <CommentThread
              comments={comments}
              currentUserId={currentUserId}
              onReply={handleReply}
              onDelete={handleDeleteComment}
            />
          </Box>
        )}
      </Box>
    </Drawer>
  );
};
