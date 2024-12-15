// app/components/cvgen/personal-info/AddressForm.js

'use client';

import React, { useState, useEffect } from 'react';
import { Box, Stack, TextField, Typography, Paper, Alert } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { LocationOn } from '@mui/icons-material';

const AddressForm = () => {
  const t = useTranslations('cvform');
  const tValidation = useTranslations('validation');
  const { control, formState: { errors, touchedFields, isSubmitted } } = useFormContext();
  const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false);

  // Surveiller les changements dans les erreurs pour mettre à jour l'état de validation
  useEffect(() => {
    const hasErrors = Boolean(
      errors?.personalInfo?.address || 
      errors?.personalInfo?.city || 
      errors?.personalInfo?.zip
    );
    if (hasErrors) {
      setHasAttemptedValidation(true);
    }
  }, [errors?.personalInfo?.address, errors?.personalInfo?.city, errors?.personalInfo?.zip]);

  const shouldShowFieldError = (fieldName) => {
    const field = fieldName.split('.')[1];
    const hasError = Boolean(errors?.personalInfo?.[field]);
    return hasError && (touchedFields?.personalInfo?.[field] || hasAttemptedValidation || isSubmitted);
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderRadius: { xs: 2, sm: 4 },
        background: (theme) => theme.palette.background.paper
      }}
    >
      <Stack spacing={3}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 2,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <LocationOn sx={{ 
            fontSize: { xs: 24, sm: 28 }, 
            color: 'primary.main',
            mt: { xs: 0.5, sm: 0 }
          }} />
          <Box>
            <Typography 
              variant="h6" 
              color="primary.main" 
              gutterBottom
              sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
            >
              {t('personalInfo.address.title')}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              {t('personalInfo.address.description')}
            </Typography>
          </Box>
        </Box>

        <Stack spacing={3}>
          <Box sx={{ minHeight: '85px', position: 'relative' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: 1 
            }}>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ ml: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                {t('personalInfo.address.street.label')}
              </Typography>
              <Typography variant="caption" color="error">*</Typography>
            </Box>
            <Controller
              name="personalInfo.address"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder={t('personalInfo.address.street.placeholder')}
                  error={shouldShowFieldError('personalInfo.address')}
                  helperText={shouldShowFieldError('personalInfo.address') && errors?.personalInfo?.address?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: { xs: 1.5, sm: 2 },
                      backgroundColor: 'background.default',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
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

          <Box sx={{ minHeight: '85px', position: 'relative' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: 1 
            }}>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ ml: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                {t('personalInfo.address.city.label')}
              </Typography>
              <Typography variant="caption" color="error">*</Typography>
            </Box>
            <Controller
              name="personalInfo.city"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder={t('personalInfo.address.city.placeholder')}
                  error={shouldShowFieldError('personalInfo.city')}
                  helperText={shouldShowFieldError('personalInfo.city') && errors?.personalInfo?.city?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: { xs: 1.5, sm: 2 },
                      backgroundColor: 'background.default',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
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

          <Box sx={{ minHeight: '85px', position: 'relative' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: 1 
            }}>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ ml: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                {t('personalInfo.address.zip.label')}
              </Typography>
              <Typography variant="caption" color="error">*</Typography>
            </Box>
            <Controller
              name="personalInfo.zip"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder={t('personalInfo.address.zip.placeholder')}
                  error={shouldShowFieldError('personalInfo.zip')}
                  helperText={shouldShowFieldError('personalInfo.zip') && errors?.personalInfo?.zip?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: { xs: 1.5, sm: 2 },
                      backgroundColor: 'background.default',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
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

export default AddressForm;