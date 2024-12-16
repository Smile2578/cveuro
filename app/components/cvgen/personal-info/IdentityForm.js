// app/components/cvgen/personal-info/IdentityForm.js

'use client';

import React, { useState, useEffect } from 'react';
import { Box, Stack, TextField, Typography, Paper, useTheme, useMediaQuery, Alert } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Person } from '@mui/icons-material';


const IdentityForm = () => {
  const t = useTranslations('cvform');
  const tValidation = useTranslations('validation');
  const { control, formState: { errors, touchedFields, isSubmitted }, trigger } = useFormContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false);

  // Surveiller les changements dans les erreurs pour mettre à jour l'état de validation
  useEffect(() => {
    const hasErrors = Boolean(errors?.personalInfo?.firstname || errors?.personalInfo?.lastname);
    if (hasErrors) {
      setHasAttemptedValidation(true);
    }
  }, [errors?.personalInfo?.firstname, errors?.personalInfo?.lastname]);

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
        background: (theme) => theme.palette.background.paper,
        width: '100%'
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
          <Person sx={{ 
            fontSize: { xs: 24, sm: 28 }, 
            color: 'primary.main',
            mt: { xs: 0.5, sm: 0 }
          }} />
          <Box>
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              color="primary.main" 
              gutterBottom
            >
              {t('personalInfo.identity.title')}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              {t('personalInfo.identity.description')}
            </Typography>
          </Box>
        </Box>

        <Stack spacing={3}>
          <Box sx={{ flex: 1, minHeight: { xs: '100px', sm: '85px' }, position: 'relative' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: 1 
            }}>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  ml: 1,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                {t('personalInfo.identity.firstName.label')}
              </Typography>
              <Typography 
                variant="caption" 
                color="error" 
                component="span"
              >
                *
              </Typography>
            </Box>
            <Controller
              name="personalInfo.firstname"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder={t('personalInfo.identity.firstName.placeholder')}
                  error={shouldShowFieldError('personalInfo.firstname')}
                  helperText={shouldShowFieldError('personalInfo.firstname') && errors?.personalInfo?.firstname?.message}
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
                      bottom: { xs: '-24px', sm: '-20px' }
                    }
                  }}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: 1, minHeight: { xs: '100px', sm: '85px' }, position: 'relative' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: 1 
            }}>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  ml: 1,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                {t('personalInfo.identity.lastName.label')}
              </Typography>
              <Typography 
                variant="caption" 
                color="error" 
                component="span"
              >
                *
              </Typography>
            </Box>
            <Controller
              name="personalInfo.lastname"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder={t('personalInfo.identity.lastName.placeholder')}
                  error={shouldShowFieldError('personalInfo.lastname')}
                  helperText={shouldShowFieldError('personalInfo.lastname') && errors?.personalInfo?.lastname?.message}
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
                      bottom: { xs: '-24px', sm: '-20px' }
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

export default IdentityForm; 