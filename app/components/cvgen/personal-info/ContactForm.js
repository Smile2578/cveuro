// app/components/cvgen/personal-info/ContactForm.js

'use client';

import React, { useState, useEffect } from 'react';
import { Box, Stack, TextField, Typography, Paper, Alert } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Email, Phone } from '@mui/icons-material';

const ContactForm = () => {
  const t = useTranslations('cvform');
  const tValidation = useTranslations('validation');
  const { control, formState: { errors, touchedFields, isSubmitted } } = useFormContext();
  const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false);

  // Surveiller les changements dans les erreurs pour mettre à jour l'état de validation
  useEffect(() => {
    const hasErrors = Boolean(errors?.personalInfo?.email || errors?.personalInfo?.phoneNumber);
    if (hasErrors) {
      setHasAttemptedValidation(true);
    }
  }, [errors?.personalInfo?.email, errors?.personalInfo?.phoneNumber]);

  const shouldShowFieldError = (fieldName) => {
    const field = fieldName.split('.')[1];
    const hasError = Boolean(errors?.personalInfo?.[field]);
    return hasError && (touchedFields?.personalInfo?.[field] || hasAttemptedValidation || isSubmitted);
  };


  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: { xs: 3, sm: 3 }, 
        borderRadius: { xs: 2, sm: 4 },
        background: (theme) => theme.palette.background.paper,
        width: '100%',
        mx: 'auto'
      }}
    >
      <Stack spacing={3}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: { xs: 'center', sm: 'center' }, 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 2,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          <Email sx={{ 
            fontSize: { xs: 32, sm: 28 }, 
            color: 'primary.main'
          }} />
          <Box>
            <Typography 
              variant="h6" 
              color="primary.main" 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.125rem', sm: '1.25rem' },
                textAlign: { xs: 'center', sm: 'left' }
              }}
            >
              {t('personalInfo.contact.title')}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                textAlign: { xs: 'center', sm: 'left' }
              }}
            >
              {t('personalInfo.contact.description')}
            </Typography>
          </Box>
        </Box>

        <Stack spacing={4}>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            mb: { xs: 3, sm: 2 }
          }}>
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
                {t('personalInfo.contact.email.label')}
              </Typography>
              <Typography variant="caption" color="error">*</Typography>
            </Box>
            <Controller
              name="personalInfo.email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Box sx={{ width: '100%' }}>
                  <TextField
                    {...field}
                    fullWidth
                    type="email"
                    placeholder={t('personalInfo.contact.email.placeholder')}
                    error={shouldShowFieldError('personalInfo.email')}
                    helperText={shouldShowFieldError('personalInfo.email') && errors?.personalInfo?.email?.message}
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: { xs: 1.5, sm: 2 },
                        backgroundColor: 'background.default',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        height: { xs: '48px', sm: '56px' },
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
                        marginTop: 1,
                        position: 'static'
                      }
                    }}
                  />
                </Box>
              )}
            />
          </Box>

          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            mb: { xs: 3, sm: 2 }
          }}>
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
                {t('personalInfo.contact.phone.label')}
              </Typography>
              <Typography variant="caption" color="error">*</Typography>
            </Box>
            <Controller
              name="personalInfo.phoneNumber"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Box sx={{ width: '100%' }}>
                  <TextField
                    {...field}
                    fullWidth
                    type="tel"
                    placeholder={t('personalInfo.contact.phone.placeholder')}
                    error={shouldShowFieldError('personalInfo.phoneNumber')}
                    helperText={shouldShowFieldError('personalInfo.phoneNumber') && errors?.personalInfo?.phoneNumber?.message}
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: { xs: 1.5, sm: 2 },
                        backgroundColor: 'background.default',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        height: { xs: '48px', sm: '56px' },
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
                        marginTop: 1,
                        position: 'static'
                      }
                    }}
                  />
                </Box>
              )}
            />
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ContactForm; 