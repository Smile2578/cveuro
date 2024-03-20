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
    background: 'linear-gradient(45deg, #FDFEFE 30%, #00D2E2 90%)', // Example gradient, replace with GEDS colors
  },
  // Add more theme customizations here if needed
});

export default theme;