"use client";
import React, { useEffect, useState } from 'react';
import { Grid, Paper, Button, Box, Typography } from '@mui/material';
import CVInfos from './CVInfos';
import LiveCV from './LiveCV';
import PrintButton from './PrintButton';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import theme from '@/app/theme';

const CVEditor = ({ cvData, setCvData }) => {
  const router = useRouter();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    let interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress <= 0) {
          clearInterval(interval);
          setShowMessage(false);
          return 0;
        }
        return oldProgress - 1; 
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const handleGoBack = () => {
    router.push('/cvgen');
  };

  const messageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <>
      <AnimatePresence>
        {showMessage && (
          <motion.div
            variants={messageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#1976d2',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              zIndex: 999
            }}
          >
            <Typography variant="h4" component="h1" sx={{ textAlign: 'center', px: 2, mb: 3 }}>
              Vous avez maintenant terminé votre CV ! Vous pouvez maintenant le modifier ou le télécharger directement.
            </Typography>
            <div style={{ position: 'absolute', bottom: 50, width: '100%', height: '5px', backgroundColor: '#ccc' }}>
              <motion.div
                style={{ width: `${progress}%`, height: '5px', backgroundColor: 'green' }}
                initial={{ width: '100%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.05 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!showMessage && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <CVInfos cvData={cvData} setCvData={setCvData} />
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2, color: theme.palette.primary.alt, textAlign: 'center' }}>Vous pouvez modifier l&apos;ordre des expériences professionnelles ou éducatives avec les flèches</Typography>
                <Button variant="outlined" sx={{ width: "40%" }} onClick={handleGoBack}>Retourner sur le formulaire</Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 4, minHeight: '100vh' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <PrintButton setIsGeneratingPDF={setIsGeneratingPDF} />
              </Box>
              <LiveCV id="live-cv" cvData={cvData} setCvData={setCvData} setIsGeneratingPDF={setIsGeneratingPDF}/>
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default CVEditor;