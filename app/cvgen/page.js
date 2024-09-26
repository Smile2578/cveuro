'use client';
import React from 'react';
import { Container, Box, ThemeProvider, CssBaseline } from '@mui/material';
import { motion } from 'framer-motion';
import Form from '../components/cvgen/Form';
import NavBar from '../components/common/NavBar';
import Footer from '../components/common/Footer';
import theme from '../theme';

export default function CVGenPage() {
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

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
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          <Container
            component="main" 
            maxWidth="md"
            sx={{
              mt: 12, 
              mb: 2,
              backgroundColor: 'background.default',
              padding: { xs: 2, sm: 3 }, 
              borderRadius: '24px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.06)',
              flexGrow: 1, 
              display: 'flex',
              maxWidth: '90%',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Form />
          </Container>
        </motion.div>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}