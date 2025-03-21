'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#fff',
    },
    error: {
      main: '#d32f2f',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#424242'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
      gradient: 'linear-gradient(45deg, #C1F0F6 10%, #F0FBFD 50%, #79E0EB 100%)'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          padding: '8px 16px',
          '&:focus-visible': {
            outline: '2px solid currentColor',
            outlineOffset: '2px'
          },
          borderRadius: 30,
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#1976d2',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1976d2',
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            color: '#424242',
            '&.Mui-focused': {
              color: '#1976d2',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          '&:focus-within': {
            outline: '2px solid #1976d2',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#1976d2',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
          '&:focus-visible': {
            outline: '2px solid currentColor',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
  typography: {
    fontFamily: "'Urbanist', sans-serif",
    h1: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontFamily: "'Urbanist', sans-serif",
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      fontFamily: "'Urbanist', sans-serif",
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontFamily: "'Urbanist', sans-serif",
      fontWeight: 700,
      fontSize: '1.5rem',
    },
    h5: {
      fontFamily: "'Urbanist', sans-serif",
      fontWeight: 700,
      fontSize: '1.25rem',
    },
    h6: {
      fontFamily: "'Urbanist', sans-serif",
      fontWeight: 700,
      fontSize: '1.1rem',
    },
    body1: {
      fontFamily: "'Urbanist', sans-serif",
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#1a1a1a',
    },
    body2: {
      fontFamily: "'Urbanist', sans-serif",
      fontSize: '0.875rem',
      lineHeight: 1.43,
      color: '#424242',
    },
    subtitle1: {
      fontFamily: "'Urbanist', sans-serif",
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontFamily: "'Urbanist', sans-serif",
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    button: {
      fontFamily: "'Urbanist', sans-serif",
      fontWeight: 600,
      textTransform: 'none',
    },
    caption: {
      fontFamily: "'Urbanist', sans-serif",
      fontSize: '0.75rem',
    },
    overline: {
      fontFamily: "'Urbanist', sans-serif",
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  zIndex: {
    appBar: 1200,
    drawer: 1100,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
});

export default theme;