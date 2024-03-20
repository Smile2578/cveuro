'use client';
import React, { useState } from 'react';
import { CssBaseline, Container, ThemeProvider, Box } from '@mui/material';
import theme from '../theme'; // Make sure this path is correct
import PersonalInfoForm from '../components/cvgen/PersonalInfoForm';
import NavBar from '../components/common/NavBar';
import Footer from '../components/common/Footer';

export default function CVGenPage() {
  const [currentSection, setCurrentSection] = useState('PersonalInfo');

  const renderSection = () => {
    switch (currentSection) {
      case 'PersonalInfo':
        return <PersonalInfoForm onComplete={() => setCurrentSection('Education')} />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh', // Ensures the gradient background covers the full viewport height
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between', // Pushes the footer to the bottom
          background: theme.gradient.background, // Use the gradient defined in the theme
        }}
      >
        <NavBar />
        <Container
          component="main" // Use the main landmark for better accessibility
          maxWidth="md"
          sx={{
            mt: 4, // Adds margin top for spacing from the NavBar
            mb: 4, // Adds margin bottom for spacing above the Footer
            backgroundColor: 'background.default', // Ensures readability of the form
            padding: { xs: 2, sm: 3 }, // Responsive padding
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            flexGrow: 1, // Allows the container to grow and center its content vertically
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center', // Centers the form vertically in the container
          }}
        >
          {renderSection()}
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
