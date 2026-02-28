import { Box, Typography } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

export const SearchPage = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Search
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
        }}
      >
        <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Use the search bar above to find documents, snippets, and diagrams.
        </Typography>
      </Box>
    </Box>
  );
};
