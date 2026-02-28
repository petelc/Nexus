import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export const CollectionsPage = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Collections
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Create Collection
        </Button>
      </Box>

      <Typography variant="body1" color="text.secondary">
        No collections yet. Create your first collection to organize related items.
      </Typography>
    </Box>
  );
};
