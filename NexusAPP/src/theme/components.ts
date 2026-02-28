import { Components, Theme } from '@mui/material/styles';

export const componentOverrides = (mode: 'light' | 'dark'): Components<Theme> => ({
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 7,
        padding: '10px 20px',
        textTransform: 'none',
        fontWeight: 500,
        transition: 'all 150ms ease-in-out',
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 7,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        transition: 'all 150ms ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 7,
      },
      elevation1: {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 7,
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 16,
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRadius: 0,
        width: 270,
        backgroundColor: mode === 'dark' ? '#2A3447' : '#FFFFFF',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        borderBottom: `1px solid ${mode === 'dark' ? '#333F55' : '#E5E7EB'}`,
        backgroundColor: mode === 'dark' ? '#2A3447' : '#FFFFFF',
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        marginBottom: 4,
        '&.Mui-selected': {
          backgroundColor: mode === 'dark' ? '#253662' : '#e3f2fd',
        },
      },
    },
  },
});
