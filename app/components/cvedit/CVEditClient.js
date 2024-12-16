'use client';

import React, { useState, useEffect } from 'react';
import { CssBaseline, Container, ThemeProvider, Box, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import CVEditor from './CVEditor';
import theme from '../../theme';
import { useRouter } from 'next/navigation';

export default function CVEditClient({ initialData, locale }) {
  const [cvData, setCvData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const t = useTranslations('cvedit');

  useEffect(() => {
    if (!initialData) {
      const fetchCVData = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          router.push('/cvgen');
          return;
        }

        try {
          const response = await fetch(`/api/cvedit/fetchCV?userId=${userId}`);
          if (!response.ok) throw new Error('Failed to fetch CV data');
          const data = await response.json();
          setCvData(data);
        } catch (error) {
          console.error("Error fetching CV data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchCVData();
    }
  }, [initialData, router]);

  const handleUpdate = async (updatedData) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const response = await fetch(`/api/cvedit/updateCV?userId=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) throw new Error('Failed to update CV');

      setCvData(updatedData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating CV:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        ease: "easeInOut"
      }
    }
  };

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: theme.palette.background.default,
        }}
      >
        <NavBar />
        <Container 
          component="main" 
          maxWidth="xl" 
          sx={{ 
            mt: 4, 
            mb: 4, 
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key="cv-editor"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ flex: 1 }}
            >
              <CVEditor 
                cvData={cvData}
                onUpdate={handleUpdate}
                showSuccess={showSuccess}
                locale={locale}
              />
            </motion.div>
          </AnimatePresence>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
} 