// app/components/cvgen/FormNavigation.js

'use client';

import React, { useState } from 'react';
import { Box, Button, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
        return;
      }

      if (!isFinalStep) {
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: { xs: 1, sm: 2 },
        pt: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        width: '100%'
      }}
    >
      <LoadingButton
        variant="outlined"
        onClick={handlePrevious}
        disabled={!canGoPrevious || isLoading}
        startIcon={<NavigateBefore />}
        isLoading={isLoading && !canGoNext}
        sx={{
          minWidth: { xs: '40px', sm: '120px' },
          borderRadius: 4
        }}
      >
        {!isMobile && t('buttons.previous')}
      </LoadingButton>

      {showReset && (
        <LoadingButton
          startIcon={<Refresh />}
          color="error"
          onClick={handleReset}
          disabled={isLoading}
          isLoading={isLoading && !canGoNext && !canGoPrevious}
          sx={{
            minWidth: { xs: '40px', sm: '120px' },
            borderRadius: 6
          }}
        >
          {!isMobile && t('buttons.reset')}
        </LoadingButton>
      )}

      <LoadingButton
        variant="contained"
        onClick={handleNext}
        disabled={(isFinalStep ? false : !canGoNext) || isLoading}
        endIcon={isFinalStep ? (!isMobile && <NavigateNext />) : <NavigateNext />}
        isLoading={isLoading && (isFinalStep || canGoNext)}
        color={isFinalStep ? "success" : "primary"}
        sx={{
          minWidth: { xs: isFinalStep ? '80px' : '40px', sm: '120px' },
          borderRadius: 6,
          ...(isFinalStep && {
            background: theme => `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
            boxShadow: theme => `0 4px 10px ${theme.palette.success.main}40`,
            '&:hover': {
              background: theme => `linear-gradient(45deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`,
            }
          })
        }}
      >
        {isMobile ? (isFinalStep ? t('buttons.save') : '') : (isFinalStep ? t('buttons.save') : t('buttons.next'))}
      </LoadingButton>
    </Box>
  );
};

export default FormNavigation;