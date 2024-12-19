// app/[locale]/cvgen/CVGenPageClient.js

'use client';

import React, { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { Container, Box, ThemeProvider, CssBaseline, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { NextIntlClientProvider } from 'next-intl';
import { useCVStore } from '../../store/cvStore';
import theme from '../../theme';

// Chargement dynamique des composants
const NavBar = dynamic(() => import('../../components/common/NavBar'), {
  loading: () => <Box sx={{ height: '64px' }} />,
  ssr: false
});

const Footer = dynamic(() => import('../../components/common/Footer'), {
  loading: () => <Box sx={{ height: '50px' }} />,
  ssr: false
});

const DynamicForm = dynamic(() => import('../../components/cvgen/Form'), {
  loading: () => (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh' 
      }}
    >
      <CircularProgress />
    </Box>
  ),
  ssr: false
});

const DynamicWelcomeDialog = dynamic(() => import('../../components/cvgen/welcome/WelcomeDialog'), {
  loading: () => (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh' 
      }}
    >
      <CircularProgress />
    </Box>
  ),
  ssr: false
});

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};

export default function CVGenPageClient({ locale, messages }) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const store = useCVStore();
  const hasFetched = useRef(false);
  const isMounted = useRef(false);

  const transformData = useCallback((data) => {
    if (!data) return null;
    
    return {
      personalInfo: data.personalInfo || {},
      educations: data.education?.map(edu => ({
        ...edu,
        degree: edu.degree || '',
        customDegree: edu.customDegree === undefined ? '' : edu.customDegree,
        fieldOfStudy: edu.fieldOfStudy || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        ongoing: edu.ongoing || false,
        achievements: edu.achievements || []
      })) || [],
      workExperience: {
        hasWorkExperience: data.workExperience?.length > 0,
        experiences: data.workExperience?.map(exp => ({
          ...exp,
          responsibilities: exp.responsibilities || []
        })) || []
      },
      skills: data.skills?.map(skill => ({
        ...skill,
        level: skill.level || 'beginner'
      })) || [],
      languages: data.languages?.map(lang => ({
        ...lang,
        proficiency: lang.proficiency || '',
        testName: lang.testName || '',
        testScore: lang.testScore || ''
      })) || [],
      hobbies: data.hobbies || []
    };
  }, []);

  const fetchCVData = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    const welcomeSeen = localStorage.getItem('welcomeSeen');
    
    if (!userId || !isMounted.current || hasFetched.current) {
      setIsLoading(false);
      setShowWelcome(!welcomeSeen);
      return;
    }

    try {
      hasFetched.current = true;
      
      const response = await fetch(`/api/cvedit/fetchCV?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch CV');
      }

      const rawData = await response.json();
      const transformedData = transformData(rawData);
      
      if (transformedData && isMounted.current) {
        store.setFormData(transformedData);
        store.setIsEditing(true);
        store.setUserId(userId);
        setShowWelcome(false);
      }
    } catch (error) {
      console.error('Error fetching CV:', error);
      if (isMounted.current) {
        hasFetched.current = false;
        setShowWelcome(!welcomeSeen);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [store, transformData]);

  const handleWelcomeClose = useCallback(() => {
    localStorage.setItem('welcomeSeen', 'true');
    setShowWelcome(false);
  }, []);

  useEffect(() => {
    isMounted.current = true;
    
    if (typeof window !== 'undefined' && !hasFetched.current) {
      fetchCVData();
    }

    return () => {
      isMounted.current = false;
    };
  }, [fetchCVData]);

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: theme.palette.background.gradient
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: theme.palette.background.gradient,
            width: '100%',
            overflowX: 'hidden'
          }}
        >
          <Suspense fallback={<Box sx={{ height: '64px' }} />}>
            <NavBar />
          </Suspense>

          <Container
            component="main"
            maxWidth="md"
            sx={{
              mt: { xs: 12, sm: 12 },
              mb: 2,
              backgroundColor: 'background.paper',
              padding: { xs: 2, sm: 3 },
              borderRadius: '24px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              width: '100%',
              maxWidth: { xs: '95%', sm: '90%', md: '800px' }
            }}
          >
            <Suspense 
              fallback={
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '60vh' 
                  }}
                >
                  <CircularProgress />
                </Box>
              }
            >
              <AnimatePresence mode="wait">
                {showWelcome ? (
                  <motion.div
                    key="welcome"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <DynamicWelcomeDialog onClose={handleWelcomeClose} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <DynamicForm />
                  </motion.div>
                )}
              </AnimatePresence>
            </Suspense>
          </Container>

          <Suspense fallback={<Box sx={{ height: '50px' }} />}>
            <Footer />
          </Suspense>
        </Box>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}