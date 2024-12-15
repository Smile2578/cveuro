// app/components/cvgen/personal-info/SocialForm.js

'use client';

import React, { useState, useEffect } from 'react';
import { Box, Stack, TextField, Typography, Paper, Alert } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Language } from '@mui/icons-material';
import FormNavigation from '../FormNavigation';
import { useFormProgress } from '@/app/hooks/useFormProgress';

const SocialForm = () => {
  const t = useTranslations('cvform');
  const tValidation = useTranslations('validation');
  const { control, formState: { errors, touchedFields, isSubmitted }, trigger } = useFormContext();
  const { isMainStep } = useFormProgress();
  const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false);

  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  // Surveiller les changements dans les erreurs pour mettre à jour l'état de validation
  useEffect(() => {
    const hasErrors = Boolean(
      errors?.personalInfo?.linkedIn || 
      errors?.personalInfo?.personalWebsite
    );
    if (hasErrors) {
      setHasAttemptedValidation(true);
    }
  }, [errors?.personalInfo?.linkedIn, errors?.personalInfo?.personalWebsite]);

  const shouldShowFieldError = (fieldName) => {
    const field = fieldName.split('.')[1];
    const hasError = Boolean(errors?.personalInfo?.[field]);
    return hasError && (touchedFields?.personalInfo?.[field] || hasAttemptedValidation || isSubmitted);
  };

  const validateForm = async () => {
    setHasAttemptedValidation(true);
    const result = await trigger(['personalInfo.linkedIn', 'personalInfo.personalWebsite']);
    return result;
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        borderRadius: 4,
        background: (theme) => theme.palette.background.paper
      }}
    >
      <Stack spacing={3}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          mb: 2,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Language sx={{ fontSize: 28, color: 'primary.main' }} />
          <Box>
            <Typography variant="h6" color="primary.main" gutterBottom>
              {t('personalInfo.social.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('personalInfo.social.description')}
            </Typography>
          </Box>
        </Box>

        <Stack spacing={3}>
          <Box sx={{ flex: 1, minHeight: '85px', position: 'relative' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: 1 
            }}>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                {t('personalInfo.social.linkedin.label')}
              </Typography>
            </Box>
            <Controller
              name="personalInfo.linkedIn"
              control={control}
              defaultValue=""
              rules={{
                validate: (value) => {
                  if (!value) return true; // Champ optionnel
                  return urlPattern.test(value) || tValidation('url.format');
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="url"
                  placeholder={t('personalInfo.social.linkedin.placeholder')}
                  error={shouldShowFieldError('personalInfo.linkedIn')}
                  helperText={shouldShowFieldError('personalInfo.linkedIn') && errors?.personalInfo?.linkedIn?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'background.default',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'background.default',
                      }
                    },
                    '& .MuiFormHelperText-root': {
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      marginLeft: 1,
                      position: 'absolute',
                      bottom: '-20px'
                    }
                  }}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: 1, minHeight: '85px', position: 'relative' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: 1 
            }}>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                {t('personalInfo.social.website.label')}
              </Typography>
            </Box>
            <Controller
              name="personalInfo.personalWebsite"
              control={control}
              defaultValue=""
              rules={{
                validate: (value) => {
                  if (!value) return true; // Champ optionnel
                  return urlPattern.test(value) || tValidation('url.format');
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="url"
                  placeholder={t('personalInfo.social.website.placeholder')}
                  error={shouldShowFieldError('personalInfo.personalWebsite')}
                  helperText={shouldShowFieldError('personalInfo.personalWebsite') && errors?.personalInfo?.personalWebsite?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'background.default',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'background.default',
                      }
                    },
                    '& .MuiFormHelperText-root': {
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      marginLeft: 1,
                      position: 'absolute',
                      bottom: '-20px'
                    }
                  }}
                />
              )}
            />
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default SocialForm; 