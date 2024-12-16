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
    console.log('Navigation: handleNext called', { 
      isLastStep,
      isLastSubStep,
      isFinalStep,
      canGoNext
    });
    
    setIsValidating(true);
    try {
      if (customNext) {
        console.log('Navigation: using customNext');
        await customNext();
        return;
      }

      if (onValidate) {
        console.log('Navigation: validating form');
        const isValid = await onValidate();
        console.log('Navigation: validation result:', isValid);
        if (!isValid) return;
      }

      if (isFinalStep && onSubmit) {
        console.log('Navigation: submitting form');
        await onSubmit();
      } else {
        console.log('Navigation: proceeding to next step');
        goNext();
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handlePrevious = async () => {
    if (customPrevious) {
      await customPrevious();
      return;
    }

    goPrevious();
  };

  const handleReset = async () => {
    console.log('Navigation: handleReset called');
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