import { createTheme } from '@mui/material/styles';

const theme = createTheme({

typography: {
        fontFamily: [
          'Work Sans',
          'sans-serif',
        ].join(','),
      },
palette: {
    // Define your color palette here
    primary: {
      main: '#1976d2', // Example primary color
    },
    background: {
      default: '#ffffff', // Light background color for contrast
    },
    text: {
      primary: '#333333', // Dark text for readability on light background
    },
  },

gradient: {
    background: 'linear-gradient(45deg, #00D2E2 20%, #00D2E2 90%)', // Example gradient, replace with GEDS colors
  },

components: {
    MuiRadio: {
      styleOverrides: {
        root: {
          // Remove the default color from radio button if not selected
          color: 'rgba(0, 0, 0, 0.54)',
          '&.Mui-checked': {
            // Apply primary color when the radio button is checked
            color: '#1976d2',
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          // Label color same as your text.secondary or any suitable color for readability
          color: '#1976d2',
        },
      },
    },
  },
  // Add more theme customizations here if needed
});

export default theme;