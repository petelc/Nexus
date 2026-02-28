import { createTheme, ThemeOptions } from '@mui/material/styles';
import { darkPalette } from './darkTheme';
import { lightPalette } from './lightTheme';
import { typography } from './typography';
import { componentOverrides } from './components';

export const createAppTheme = (mode: 'light' | 'dark') => {
  const palette = mode === 'dark' ? darkPalette : lightPalette;

  const themeOptions: ThemeOptions = {
    palette,
    typography,
    shape: {
      borderRadius: 7,
    },
    spacing: 8,
    components: componentOverrides(mode),
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
    },
  };

  return createTheme(themeOptions);
};

// Export default themes
export const darkTheme = createAppTheme('dark');
export const lightTheme = createAppTheme('light');
