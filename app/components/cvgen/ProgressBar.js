'use client';

import React from 'react';
import { Box, LinearProgress, Typography, useTheme, useMediaQuery } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useFormProgress } from '@/app/hooks/useFormProgress';

const ProgressBar = () => {
  const t = useTranslations('common');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { 
    currentStep,
    currentSubStep,
    totalSteps,
    totalSubSteps,
    hasSubSteps,
    progress
  } = useFormProgress();

  const getQualityMessage = (progress) => {
    if (progress === 0) return t('progress.quality.0');
    if (progress <= 25) return t('progress.quality.25');
    if (progress <= 50) return t('progress.quality.50');
    if (progress <= 75) return t('progress.quality.75');
    return t('progress.quality.100');
  };

  return (
    <Box sx={{ 
      width: '100%', 
      mb: 1,
      position: 'sticky',
      top: 0,
      backgroundColor: 'background.paper',
      p: 2,
      borderBottom: `1px solid ${theme.palette.divider}`,
      zIndex: 1
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {t('progress.step', { current: currentStep + 1, total: totalSteps })}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('progress.completion', { percentage: Math.round(progress) })}
        </Typography>
      </Box>

      <LinearProgress 
        variant="determinate" 
        value={progress}
        sx={{ 
          height: 8,
          borderRadius: 4,
          backgroundColor: theme.palette.grey[200],
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            backgroundColor: theme.palette.primary.main
          }
        }}
      />

      {hasSubSteps && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t('progress.subStep', { current: currentSubStep + 1, total: totalSubSteps })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round((currentSubStep + 1) / totalSubSteps * 100)}%
            </Typography>
          </Box>

          <LinearProgress 
            variant="determinate" 
            value={(currentSubStep + 1) / totalSubSteps * 100}
            sx={{ 
              height: 6,
              borderRadius: 3,
              backgroundColor: theme.palette.grey[100],
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                backgroundColor: theme.palette.secondary.main
              }
            }}
          />
        </Box>
      )}

      <Typography 
        variant="body2" 
        color="primary" 
        align="center"
        sx={{ mt: 1, fontWeight: 500 }}
      >
        {getQualityMessage(progress)}
      </Typography>
    </Box>
  );
};

export default ProgressBar; 