import { Box, Button, TextField } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useState } from 'react';

interface CommentBoxProps {
  onSubmit: (text: string) => Promise<void>;
  placeholder?: string;
  submitLabel?: string;
  autoFocus?: boolean;
}

export const CommentBox = ({
  onSubmit,
  placeholder = 'Add a comment…',
  submitLabel = 'Comment',
  autoFocus = false,
}: CommentBoxProps) => {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      await onSubmit(trimmed);
      setText('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <TextField
        multiline
        minRows={2}
        maxRows={6}
        fullWidth
        size="small"
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={submitting}
        autoFocus={autoFocus}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<SendIcon />}
          onClick={handleSubmit}
          disabled={!text.trim() || submitting}
        >
          {submitting ? 'Sending…' : submitLabel}
        </Button>
      </Box>
    </Box>
  );
};
