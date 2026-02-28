import { Box, Typography, Grid, Paper, useTheme } from '@mui/material';
import {
  Description as DocumentIcon,
  Code as CodeIcon,
  AccountTree as DiagramIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

export const DashboardPage = () => {
  const theme = useTheme();

  const stats = [
    { label: 'Documents', value: '0', icon: DocumentIcon, color: theme.palette.primary.main },
    { label: 'Code Snippets', value: '0', icon: CodeIcon, color: theme.palette.info.main },
    { label: 'Diagrams', value: '0', icon: DiagramIcon, color: theme.palette.success.main },
    { label: 'Activity', value: '0', icon: TrendingUpIcon, color: theme.palette.warning.main },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  borderRadius: theme.shape.borderRadius,
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '12px',
                    backgroundColor: `${stat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon sx={{ color: stat.color, fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Paper sx={{ p: 3, mt: 3, borderRadius: theme.shape.borderRadius }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Welcome to Nexus
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your knowledge management system is ready. Start creating documents, code snippets, and diagrams
          to organize your team's knowledge.
        </Typography>
      </Paper>
    </Box>
  );
};
