// app/components/cvgen/FormNavigation.js

'use client';

import React, { useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';
import { Refresh, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { useFormProgress } from '@/app/hooks/useFormProgress';

const LoadingButton = ({ 
  isLoading, 
  startIcon, 
  endIcon, 
  children, 
  ...props 
}) => {
  return (
    <Button
      {...props}
      sx={{ 
        minWidth: '120px',
        position: 'relative',
        ...props.sx
      }}
    >
      {!isLoading && startIcon}
      {!isLoading && children}
      {!isLoading && endIcon}
      {isLoading && (
        <CircularProgress
          size={24}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px'
          }}
        />
      )}
    </Button>
  );
};

const FormNavigation = ({
  onValidate,
  onReset,
  showReset = true,
  customNext,
  customPrevious,
  onSubmit
}) => {
  const t = useTranslations('common');
  const { formState: { errors } } = useFormContext();
  const {
    isLastStep,
    isSubmitting,
    canGoNext,
    canGoPrevious,
    goNext,
    goPrevious,
    isLastSubStep
  } = useFormProgress();

  const [isValidating, setIsValidating] = useState(false);
  const isFinalStep = isLastStep && isLastSubStep;

  const handleNext = async () => {
    console.log('[FormNavigation] handleNext appelé', { 
      isLastStep,
      isLastSubStep,
      isFinalStep,
      canGoNext,
      isValidating,
      isSubmitting
    });
    
    setIsValidating(true);
    try {
      if (customNext) {
        console.log('[FormNavigation] Utilisation de customNext');
        await customNext();
        return;
      }

      if (onValidate) {
        console.log('[FormNavigation] Début de la validation');
        const isValid = await onValidate();
        console.log('[FormNavigation] Résultat de la validation:', isValid);
        if (!isValid) return;
      }

      if (isFinalStep && onSubmit) {
        console.log('[FormNavigation] Soumission du formulaire');
        await onSubmit();
      } else {
        console.log('[FormNavigation] Passage à l\'étape suivante');
        goNext();
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handlePrevious = async () => {
    console.log('[FormNavigation] handlePrevious appelé');
    if (customPrevious) {
      await customPrevious();
      return;
    }

    goPrevious();
  };

  const handleReset = async () => {
    console.log('[FormNavigation] handleReset appelé');
    if (onReset) {
      await onReset();
    }
  };

  const isLoading = isSubmitting || isValidating;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 4,
        pt: 2,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <LoadingButton
        variant="outlined"
        onClick={handlePrevious}
        disabled={!canGoPrevious || isLoading}
        startIcon={<NavigateBefore />}
        isLoading={isLoading && !canGoNext}
      >
        {t('buttons.previous')}
      </LoadingButton>

      <Box 
        sx={{ 
          display: 'flex', 
          gap: 2,
          justifyContent: 'center',
          flex: 1
        }}
      >
        {showReset && (
          <LoadingButton
            startIcon={<Refresh />}
            color="error"
            onClick={handleReset}
            disabled={isLoading}
            isLoading={isLoading && !canGoNext && !canGoPrevious}
          >
            {t('buttons.reset')}
          </LoadingButton>
        )}
      </Box>

      <LoadingButton
        variant="contained"
        onClick={handleNext}
        disabled={(isFinalStep ? false : !canGoNext) || isLoading}
        endIcon={<NavigateNext />}
        isLoading={isLoading && (isFinalStep || canGoNext)}
      >
        {isFinalStep ? t('buttons.save') : t('buttons.next')}
      </LoadingButton>
    </Box>
  );
};

export default FormNavigation;