'use client';
import React, { useState } from 'react';
import { CssBaseline, Container, ThemeProvider, Box } from '@mui/material';
import theme from '../theme'; 
import Form from '../components/cvgen/Form';
import NavBar from '../components/common/NavBar';
import Footer from '../components/common/Footer';


export default function CVGenPage() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between', 
          background: theme.gradient.background,
        }}
      >
        <NavBar />
        <Container
          component="main" 
          maxWidth="md"
          sx={{
            mt: 12, 
            mb: 4,
            backgroundColor: 'background.default',
            padding: { xs: 2, sm: 3 }, 
            borderRadius: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            flexGrow: 1, 
            display: 'flex',
            maxWidth: '90%',
            flexDirection: 'column',
            justifyContent: 'center', 
          }}
        >
          <Form />
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
