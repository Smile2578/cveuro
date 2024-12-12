"use client";
import React, { useEffect, useState } from 'react';
import { Grid, Paper, Button, Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import CVInfos from './CVInfos';
import LiveCV from './LiveCV';
import PrintButton from './PrintButton';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import theme from '@/app/theme';

const SuccessNotification = ({ show, message, onHide }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (show) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress <= 0) {
            clearInterval(timer);
            onHide();
            return 0;
          }
          return prevProgress - 1;
        });
      }, 80);

      return () => clearInterval(timer);
    }
  }, [show, onHide]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed top-3 transform -translate-x-1/2 bg-white shadow-lg rounded-lg"
          style={{ maxWidth: '90vw', zIndex: 1000 }}
        >
          <div className="p-4 flex items-center space-x-3">
            <CheckCircle color={theme.palette.primary.alt} size={24} />
            <p className="text-sm font-medium text-gray-800">{message}</p>
          </div>
          <motion.div
            className="bg-green-500 h-1"
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CVEditor = ({ cvData, setCvData, setShowNavBar }) => {
  const router = useRouter();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const t = useTranslations('cvedit.editor');

  useEffect(() => {
    setShowNavBar(!showNotification);
  }, [showNotification, setShowNavBar]);

  const handleNotificationHide = () => {
    setShowNotification(false);
  };

  const handleGoBack = () => {
    router.push('/cvgen');
  };

  return (
    <>
      <SuccessNotification 
        show={showNotification}
        message={t('success')}
        onHide={handleNotificationHide}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <CVInfos cvData={cvData} setCvData={setCvData} />
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
              <Typography variant="h6" component="h2" sx={{ mb: 2, color: theme.palette.primary.alt, textAlign: 'center' }}>
                {t('dragAndDrop')}
              </Typography>
              <Button variant="outlined" sx={{ width: "40%" }} onClick={handleGoBack}>
                {t('backToForm')}
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4, minHeight: '100vh', overflowX: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <PrintButton setIsGeneratingPDF={setIsGeneratingPDF} />
            </Box>
            <LiveCV id="live-cv" cvData={cvData} setCvData={setCvData} setIsGeneratingPDF={setIsGeneratingPDF}/>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default CVEditor;