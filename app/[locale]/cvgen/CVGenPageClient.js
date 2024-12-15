// app/[locale]/cvgen/CVGenPageClient.js

'use client';

import React, { Suspense, useState } from 'react';
import { Container, Box, ThemeProvider, CssBaseline, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { NextIntlClientProvider } from 'next-intl';
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
            background: theme.gradient.background,
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
              mt: 12,
              mb: 2,
              backgroundColor: 'background.default',
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
                    <DynamicWelcomeDialog onClose={() => setShowWelcome(false)} />
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