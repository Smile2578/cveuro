'use client';

import React, { useState, useEffect } from 'react';
import { CssBaseline, Container, ThemeProvider, Box, CircularProgress, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import CVEditor from './CVEditor';
import theme from '../../theme';
import { useRouter } from 'next/navigation';

export default function CVEditClient({ initialData, locale, userId }) {
  const [cvData, setCvData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const t = useTranslations('cvedit');

  useEffect(() => {
    if (!initialData) {
      const fetchCVData = async () => {
        if (!userId) {
          router.push('/');
          return;
        }

        try {
          const response = await fetch(`/api/cvedit/fetchCV?userId=${userId}`);
          if (response.status === 404) {
            setError('notFound');
            setTimeout(() => {
              router.push('/cvgen');
            }, 3000);
            return;
          }
          if (!response.ok) throw new Error('Failed to fetch CV data');
          const data = await response.json();
          setCvData(data);
        } catch (error) {
          console.error("Error fetching CV data:", error);
          setError('fetch');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchCVData();
    }
  }, [initialData, router, userId]);

  const handleUpdate = async (updatedData) => {
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
      setError('update');
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
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography>{t('editor.loading')}</Typography>
      </Box>
    );
  }

  if (error === 'notFound') {
    return (
      <Box 
        sx={{ 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h6">{t('editor.noUser')}</Typography>
        <Typography>{t('editor.redirecting')}</Typography>
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