'use client';
import React, { useState, useEffect } from 'react';
import NavBar from '../components/common/NavBar';
import Footer from '../components/common/Footer';
import CVEditor from '../components/cvedit/CVEditor'; // Assume this is your component for editing the CV
import { CssBaseline, Container, ThemeProvider, Box } from '@mui/material';
import theme from '../theme';

const CVEdit = () => {
const [cvData, setCvData] = useState(null);

  useEffect(() => {
    const fetchCVData = async () => {
      const userId = localStorage.getItem('cvUserId');
      if (userId) {
        try {
          const response = await fetch(`/api/cvedit/fetchCV?userId=${userId}`);
          if (!response.ok) throw new Error('Failed to fetch CV data');
          const data = await response.json();
          setCvData(data);
          console.log('CV data fetched:', data);
        } catch (error) {
          console.error("Error fetching CV data:", error.message);
        }
      }
    };
    
    fetchCVData();
  }, []);


  return (
    <>
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
              minWidth: '90%',
              backgroundColor: 'background.default',
              padding: { xs: 2, sm: 3 }, 
              borderRadius: '24px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              flexGrow: 1, 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center', 
            }}
          >
            <CVEditor cvData={cvData} setCvData={setCvData} />
          </Container>
          <Footer />
        </Box>
      </ThemeProvider>
    </>
  );
};

export default CVEdit;
