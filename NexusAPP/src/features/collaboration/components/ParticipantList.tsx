import { Avatar, AvatarGroup, Box, Tooltip, Typography } from '@mui/material';
import type { ParticipantInfoDto } from '@types/api.types';

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

interface ParticipantListProps {
  participants: ParticipantInfoDto[];
  max?: number;
}

export const ParticipantList = ({ participants, max = 5 }: ParticipantListProps) => {
  if (participants.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No active participants
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <AvatarGroup max={max} sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: 13 } }}>
        {participants.map((p) => (
          <Tooltip
            key={p.userId}
            title={`${p.fullName || p.username} · ${p.role}`}
            arrow
          >
            <Avatar
              sx={{
                bgcolor: stringToColor(p.userId),
                width: 32,
                height: 32,
                fontSize: 13,
              }}
            >
              {getInitials(p.fullName, p.username)}
            </Avatar>
          </Tooltip>
        ))}
      </AvatarGroup>
      <Typography variant="body2" color="text.secondary">
        {participants.length === 1
          ? '1 participant'
          : `${participants.length} participants`}
      </Typography>
    </Box>
  );
};
