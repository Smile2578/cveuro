// app/components/cvgen/personal-info/PersonalInfoStepper.js

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Stepper, 
  Step, 
  StepLabel, 
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery,
  MobileStepper,
  Paper
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { Warning } from '@mui/icons-material';
import { useCVStore } from '@/app/store/cvStore';
import FormNavigationWrapper from '../FormNavigationWrapper';
import { useFormProgress } from '@/app/hooks/useFormProgress';

// Définition des champs par étape
const STEP_FIELDS = {
  0: ['firstname', 'lastname'],
  1: ['email', 'phoneNumber'],
  2: ['dateofBirth', 'nationality', 'sex'],
  3: ['address', 'city', 'zip'],
  4: ['linkedIn', 'personalWebsite']
};

const PersonalInfoStepper = ({ children }) => {
  const tCvform = useTranslations('cvform');
  const tCommon = useTranslations('common');
  const store = useCVStore();
  const steps = React.Children.toArray(children);
  const { trigger, getValues, formState: { errors }, clearErrors, watch, setValue, reset } = useFormContext();
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { currentSubStep, isSubStep } = useFormProgress();
  const [validationAttempted, setValidationAttempted] = useState(false);

  // Surveiller les changements dans les champs de l'étape actuelle
  useEffect(() => {
    const currentStepFields = STEP_FIELDS[currentSubStep] || [];
    const subscription = watch((value, { name, type }) => {
      if (type === 'change' && currentStepFields.some(field => name?.includes(field))) {
        trigger(name);
      }
    });
    return () => subscription.unsubscribe();
  }, [currentSubStep, watch, trigger]);

  const validateCurrentStep = async (silent = false) => {
    const currentStepFields = STEP_FIELDS[currentSubStep] || [];
    
    if (!Array.isArray(currentStepFields)) {
      console.error('Les champs de l\'étape actuelle ne sont pas dans un format valide:', currentStepFields);
      return false;
    }

    setValidationAttempted(true);
    const fieldsToValidate = currentStepFields.map(field => `personalInfo.${field}`);
    const result = await trigger(fieldsToValidate, { shouldFocus: true });
    
    if (!result && !silent) {
      store.setFormErrors({
        ...store.formErrors,
        personalInfo: errors?.personalInfo
      });
    }
    
    return result;
  };

  const handleReset = async () => {
    setOpenResetDialog(true);
  };

  const handleConfirmReset = async () => {
    try {
      reset({
        personalInfo: {
          firstname: '',
          lastname: '',
          email: '',
          phoneNumber: '',
          dateofBirth: '',
          nationality: [],
          sex: '',
          address: '',
          city: '',
          zip: '',
          linkedIn: '',
          personalWebsite: ''
        }
      });
      store.resetForm();
      setOpenResetDialog(false);
      setValidationAttempted(false);
    } catch (error) {
      console.error('Erreur lors du reset:', error);
    }
  };

  const handleCancelReset = () => {
    setOpenResetDialog(false);
  };

  const renderStepContent = (step) => (
    <Box sx={{ mt: { xs: 2, sm: 3 } }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          backgroundColor: 'background.default'
        }}
      >

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSubStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step}
          </motion.div>
        </AnimatePresence>
      </Paper>
    </Box>
  );

  return (
    <FormNavigationWrapper
      onValidate={validateCurrentStep}
      onReset={handleReset}
      showReset={true}
    >
      <Box sx={{ width: '100%' }}>
        {isMobile ? (
          <>
            <MobileStepper
              variant="dots"
              steps={steps.length}
              position="static"
              activeStep={currentSubStep}
              sx={{
                backgroundColor: 'transparent',
                padding: 0,
                marginBottom: 2
              }}
              backButton={<div />}
              nextButton={<div />}
            />
            {renderStepContent(steps[currentSubStep])}
          </>
        ) : (
          <>
            <Stepper 
              activeStep={currentSubStep} 
              alternativeLabel
              sx={{
                '& .MuiStepLabel-root': {
                  '& .MuiStepLabel-labelContainer': {
                    marginTop: 1
                  }
                }
              }}
            >
              {steps.map((_, index) => (
                <Step key={index}>
                  <StepLabel>
                    <Typography 
                      variant="body2"
                      sx={{ 
                        fontWeight: index === currentSubStep ? 600 : 400,
                        color: theme => index === currentSubStep ? theme.palette.primary.main : 'inherit'
                      }}
                    >
                      {tCvform(`personalInfo.subSteps.${index}.label`)}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            {renderStepContent(steps[currentSubStep])}
          </>
        )}

        <Dialog
          open={openResetDialog}
          onClose={handleCancelReset}
          aria-labelledby="reset-dialog-title"
          sx={{
            '& .MuiDialog-paper': {
              width: { xs: '90%', sm: 'auto' },
              m: { xs: 2, sm: 3 }
            }
          }}
        >
          <DialogTitle 
            id="reset-dialog-title" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: 'error.main',
              py: { xs: 1.5, sm: 2 }
            }}
          >
            <Warning color="error" />
            <Typography variant={isMobile ? "subtitle1" : "h6"}>
              {tCommon('buttons.reset')}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant={isMobile ? "body2" : "body1"}>
              {tCommon('confirmations.reset')}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
            <Button 
              onClick={handleCancelReset}
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              {tCommon('buttons.cancel')}
            </Button>
            <Button 
              onClick={handleConfirmReset} 
              color="error" 
              variant="contained"
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              {tCommon('buttons.reset')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </FormNavigationWrapper>
  );
};

export default PersonalInfoStepper; 