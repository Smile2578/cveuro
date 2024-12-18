// app/components/cvgen/combined-form/CombinedForm.js
"use client";

import React, { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCVStore } from '@/app/store/cvStore';
import FormNavigation from '../FormNavigation';
import { useFormProgress } from '@/app/hooks/useFormProgress';
import SkillsForm from './SkillsForm';
import HobbiesForm from './HobbiesForm';
import LanguagesForm from './LanguagesForm';

const CombinedForm = ({ onSubmit }) => {
  const t = useTranslations('cvform');
  const tCommon = useTranslations('common');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const store = useCVStore();
  const { currentSubStep: rawCurrentSubStep, isSubStep } = useFormProgress();
  const { 
    trigger, 
    getValues, 
    reset, 
    clearErrors,
    formState: { errors, isDirty, dirtyFields, touchedFields } 
  } = useFormContext();
  const [openResetDialog, setOpenResetDialog] = useState(false);

  const currentSubStep = typeof rawCurrentSubStep === 'number' ? 
    Math.min(Math.max(0, rawCurrentSubStep), 2) : 0;

  const steps = [
    {
      label: t('steps.skills'),
      component: <SkillsForm />,
      validate: () => trigger('skills')
    },
    {
      label: t('steps.hobbies'),
      component: <HobbiesForm />,
      validate: () => trigger('hobbies')
    },
    {
      label: t('steps.languages'),
      component: <LanguagesForm />,
      validate: () => trigger('languages')
    }
  ];

  const handleReset = async () => {
    setOpenResetDialog(true);
  };

  const handleConfirmReset = async () => {
    try {
      const currentData = getValues();
      const newData = { ...currentData };
      
      switch (currentSubStep) {
        case 0:
          newData.skills = [];
          break;
        case 1:
          newData.hobbies = [];
          break;
        case 2:
          newData.languages = [];
          break;
      }
      
      store.setFormData(newData);
      reset(newData);
      
      setOpenResetDialog(false);
    } catch (error) {
      console.error('Erreur lors du reset:', error);
    }
  };

  const handleCancelReset = () => {
    setOpenResetDialog(false);
  };

  const validateCurrentStep = async () => {
    const currentStep = steps[currentSubStep];
    if (!currentStep?.validate) return true;
    
    if (currentSubStep === 2) {
      const languages = getValues('languages') || [];

      if (languages.length === 0) {
        const errorMessage = t('languages.errors.required');
        store.setFormErrors({
          languages: { message: errorMessage }
        });
        trigger('languages');
        return false;
      }

      const hasBeenTouched = Object.keys(touchedFields.languages || {}).length > 0;
      if (!hasBeenTouched && languages.length > 0) {
        clearErrors('languages');
        return true;
      }
    }
    
    const result = await currentStep.validate();
    return result;
  };

  return (
    <Box 
      component={Paper} 
      elevation={0}
      sx={{ 
        width: '100%',
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        backgroundColor: 'background.paper'
      }}
    >
      <Stepper 
        activeStep={currentSubStep} 
        sx={{ 
          mb: { xs: 3, sm: 4 },
          '& .MuiStepLabel-label': {
            fontSize: { xs: '0.875rem', sm: '1rem' },
            fontWeight: 500,
            textAlign: { xs: 'center', sm: 'left' }
          },
          '& .MuiStepIcon-root': {
            fontSize: { xs: '1.5rem', sm: '2rem' }
          },
          '& .MuiStep-root': {
            textAlign: { xs: 'center', sm: 'left' }
          }
        }}
        alternativeLabel={!isMobile}
        orientation={isMobile ? 'vertical' : 'horizontal'}
      >
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ 
        minHeight: '400px',
        mt: { xs: 2, sm: 4 }
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSubStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {steps[currentSubStep].component}
          </motion.div>
        </AnimatePresence>
      </Box>

      <FormNavigation
        onValidate={validateCurrentStep}
        onReset={handleReset}
        onSubmit={onSubmit}
        showReset={true}
      />

      <Dialog
        open={openResetDialog}
        onClose={handleCancelReset}
        PaperProps={{
          sx: {
            width: { xs: '90%', sm: 'auto' },
            minWidth: { sm: 400 },
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          typography: 'h6',
          fontSize: { xs: '1.125rem', sm: '1.25rem' }
        }}>
          {tCommon('buttons.reset')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ 
            color: 'text.secondary',
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}>
            {tCommon('confirmations.reset')}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCancelReset}
            size={isMobile ? 'small' : 'medium'}
          >
            {tCommon('buttons.cancel')}
          </Button>
          <Button 
            onClick={handleConfirmReset} 
            color="error" 
            variant="contained"
            size={isMobile ? 'small' : 'medium'}
          >
            {tCommon('buttons.reset')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CombinedForm; 