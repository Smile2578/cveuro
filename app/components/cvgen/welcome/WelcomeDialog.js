// app/components/cvgen/welcome/WelcomeDialog.js

'use client';

import React from 'react';
import { 
  Box, Typography, Stepper, Step, StepLabel,
  StepContent, Paper, Button
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const steps = [
  'personal',
  'education', 
  'experience',
  'skills'
];

const personalSubSteps = [
  'identity',
  'contact', 
  'info',
  'address',
  'social'
];

const CustomStepContent = ({ step }) => {
  const t = useTranslations('welcome');

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="body1" gutterBottom>
        {t(`steps.${step}.description`)}
      </Typography>

      {step === 'personal' && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            {t('subSteps')}:
          </Typography>
          <Box component="ul" sx={{ mt: 0, pl: 2 }}>
            {personalSubSteps.map((subStep) => (
              <Typography key={subStep} component="li">
                {t(`steps.personal.${subStep}`)}
              </Typography>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

const WelcomeGuide = ({ onClose }) => {
  const t = useTranslations('welcome');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: '16px' }}>
        <Typography variant="h4" gutterBottom>
          {t('title')}
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Stepper orientation="vertical">
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{t(`steps.${step}.title`)}</StepLabel>
                <StepContent>
                  <CustomStepContent step={step} />
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={onClose}
            sx={{ minWidth: 200 }}
          >
            {t('startButton')}
          </Button>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default WelcomeGuide;