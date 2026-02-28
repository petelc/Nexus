import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { Reply as ReplyIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { CommentDto } from '@types/api.types';
import { CommentBox } from './CommentBox';

dayjs.extend(relativeTime);

function getInitials(fullName: string, username: string): string {
  if (fullName && fullName !== 'Unknown User') {
    const parts = fullName.trim().split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  }
  return username[0]?.toUpperCase() ?? '?';
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 60%, 45%)`;
}

interface CommentItemProps {
  comment: CommentDto;
  currentUserId?: string;
  onReply: (commentId: string, text: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  nested?: boolean;
}

const CommentItem = ({
  comment,
  currentUserId,
  onReply,
  onDelete,
  nested = false,
}: CommentItemProps) => {
  const [showReply, setShowReply] = useState(false);

  const handleReplySubmit = async (text: string) => {
    await onReply(comment.commentId, text);
    setShowReply(false);
  };

  if (comment.isDeleted) {
    return (
      <Box sx={{ pl: nested ? 4 : 0, py: 1 }}>
        <Typography variant="body2" color="text.disabled" fontStyle="italic">
          [Comment deleted]
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pl: nested ? 4 : 0 }}>
      <Box sx={{ display: 'flex', gap: 1.5, py: 1.5 }}>
        <Avatar
          sx={{
            bgcolor: stringToColor(comment.userId),
            width: 28,
            height: 28,
            fontSize: 12,
            flexShrink: 0,
            mt: 0.25,
          }}
        >
          {getInitials(comment.fullName, comment.username)}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body2" fontWeight={600}>
              {comment.fullName || comment.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {dayjs(comment.createdAt).fromNow()}
            </Typography>
            {comment.updatedAt && (
              <Typography variant="caption" color="text.disabled">
                (edited)
              </Typography>
            )}
          </Box>
          <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {comment.text}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
            {!nested && (
              <Tooltip title="Reply">
                <IconButton size="small" onClick={() => setShowReply((v) => !v)}>
                  <ReplyIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            )}
            {comment.userId === currentUserId && (
              <Tooltip title="Delete">
                <IconButton size="small" color="error" onClick={() => onDelete(comment.commentId)}>
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          {showReply && (
            <Box sx={{ mt: 1 }}>
              <CommentBox
                onSubmit={handleReplySubmit}
                placeholder="Write a reply…"
                submitLabel="Reply"
                autoFocus
              />
            </Box>
          )}
        </Box>
      </Box>

      {/* Nested replies */}
      {comment.replies?.filter((r) => !r.isDeleted).map((reply) => (
        <CommentItem
          key={reply.commentId}
          comment={reply}
          currentUserId={currentUserId}
          onReply={onReply}
          onDelete={onDelete}
          nested
        />
      ))}
    </Box>
  );
};

interface CommentThreadProps {
  comments: CommentDto[];
  currentUserId?: string;
  onReply: (commentId: string, text: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
}

export const CommentThread = ({
  comments,
  currentUserId,
  onReply,
  onDelete,
}: CommentThreadProps) => {
  // Only top-level comments (no parentCommentId)
  const topLevel = comments.filter((c) => !c.parentCommentId);

  if (topLevel.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
        No comments yet. Start the conversation!
      </Typography>
    );
  }

  return (
    <Box>
      {topLevel.map((comment, index) => (
        <Box key={comment.commentId}>
          <CommentItem
            comment={comment}
            currentUserId={currentUserId}
            onReply={onReply}
            onDelete={onDelete}
          />
          {index < topLevel.length - 1 && <Divider />}
        </Box>
      ))}
    </Box>
  );
};
