// app/components/cvgen/personal-info/InfoForm.js

'use client';

import React, { useState, useEffect } from 'react';
import { Box, Stack, TextField, Typography, Paper, Autocomplete, MenuItem, Alert } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslations, useLocale } from 'next-intl';
import { Info } from '@mui/icons-material';
import { nationalities } from '../utils/Nationalities';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/fr';

dayjs.extend(customParseFormat);
dayjs.locale('fr');

const InfoForm = () => {
  const t = useTranslations('cvform');
  const tValidation = useTranslations('validation');
  const locale = useLocale();
  const { control, formState: { errors, touchedFields, isSubmitted } } = useFormContext();
  const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false);

  // Surveiller les changements dans les erreurs pour mettre à jour l'état de validation
  useEffect(() => {
    const hasErrors = Boolean(
      errors?.personalInfo?.dateofBirth || 
      errors?.personalInfo?.nationality || 
      errors?.personalInfo?.sex
    );
    if (hasErrors) {
      setHasAttemptedValidation(true);
    }
  }, [errors?.personalInfo?.dateofBirth, errors?.personalInfo?.nationality, errors?.personalInfo?.sex]);

  const shouldShowFieldError = (fieldName) => {
    const field = fieldName.split('.')[1];
    const hasError = Boolean(errors?.personalInfo?.[field]);
    return hasError && (touchedFields?.personalInfo?.[field] || hasAttemptedValidation || isSubmitted);
  };


  const genderOptions = [
    { value: 'male', label: t('personalInfo.info.gender.options.male') },
    { value: 'female', label: t('personalInfo.info.gender.options.female') },
    { value: 'other', label: t('personalInfo.info.gender.options.other') }
  ];

  const handleDateChange = (field, value) => {
    if (!value) {
      field.onChange('');
      return;
    }

    if (dayjs.isDayjs(value) && value.isValid()) {
      field.onChange(value.format('DD/MM/YYYY'));
      return;
    }

    if (typeof value === 'string') {
      const date = dayjs(value, 'DD/MM/YYYY', true);
      if (date.isValid()) {
        field.onChange(date.format('DD/MM/YYYY'));
        return;
      }
    }

    field.onChange('');
  };

  const parseDateValue = (value) => {
    if (!value) return null;
    const date = dayjs(value, 'DD/MM/YYYY', true);
    return date.isValid() ? date : null;
  };

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: { xs: 2, sm: 4 }, background: (theme) => theme.palette.background.paper }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Info sx={{ fontSize: { xs: 24, sm: 28 }, color: 'primary.main', mt: { xs: 0.5, sm: 0 } }} />
          <Box>
            <Typography variant="h6" color="primary.main" gutterBottom sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>{t('personalInfo.info.title')}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>{t('personalInfo.info.description')}</Typography>
          </Box>
        </Box>

        <Stack spacing={3}>
          <Box sx={{ minHeight: '85px', position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {t('personalInfo.info.birthDate.label')}
              </Typography>
              <Typography variant="caption" color="error">*</Typography>
            </Box>
            <Controller
              name="personalInfo.dateofBirth"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                  <DatePicker
                    value={parseDateValue(field.value)}
                    onChange={(newValue) => handleDateChange(field, newValue)}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: shouldShowFieldError('personalInfo.dateofBirth'),
                        helperText: shouldShowFieldError('personalInfo.dateofBirth') && errors?.personalInfo?.dateofBirth?.message,
                        required: true,
                        inputProps: {
                          placeholder: 'JJ/MM/AAAA'
                        },
                        sx: {
                          '& .MuiFormHelperText-root': {
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            marginLeft: 1,
                            position: 'absolute',
                            bottom: '-20px'
                          }
                        }
                      }
                    }}
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: { xs: 1.5, sm: 2 },
                        backgroundColor: 'background.default',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        '&:hover': { backgroundColor: 'action.hover' },
                        '&.Mui-focused': { backgroundColor: 'background.default' }
                      }
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </Box>

          <Box sx={{ minHeight: '85px', position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {t('personalInfo.info.gender.label')}
              </Typography>
              <Typography variant="caption" color="error">*</Typography>
            </Box>
            <Controller
              name="personalInfo.sex"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  placeholder={t('personalInfo.info.gender.placeholder')}
                  error={shouldShowFieldError('personalInfo.sex')}
                  helperText={shouldShowFieldError('personalInfo.sex') && errors?.personalInfo?.sex?.message}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: { xs: 1.5, sm: 2 },
                      backgroundColor: 'background.default',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&:hover': { backgroundColor: 'action.hover' },
                      '&.Mui-focused': { backgroundColor: 'background.default' }
                    },
                    '& .MuiFormHelperText-root': {
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      marginLeft: 1,
                      position: 'absolute',
                      bottom: '-20px'
                    }
                  }}
                >
                  {genderOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          <Box sx={{ minHeight: '85px', position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {t('personalInfo.info.nationality.label')}
              </Typography>
              <Typography variant="caption" color="error">*</Typography>
            </Box>
            <Controller
              name="personalInfo.nationality"
              control={control}
              defaultValue={[]}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  options={nationalities[locale]}
                  value={value || []}
                  onChange={(_, newValue) => onChange(newValue)}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.code === value.code}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t('personalInfo.info.nationality.placeholder')}
                      error={shouldShowFieldError('personalInfo.nationality')}
                      helperText={shouldShowFieldError('personalInfo.nationality') && errors?.personalInfo?.nationality?.message}
                      required
                      sx={{
                        '& .MuiFormHelperText-root': {
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          marginLeft: 1,
                          position: 'absolute',
                          bottom: '-20px'
                        }
                      }}
                    />
                  )}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: { xs: 1.5, sm: 2 },
                      backgroundColor: 'background.default',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&:hover': { backgroundColor: 'action.hover' },
                      '&.Mui-focused': { backgroundColor: 'background.default' }
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

export default InfoForm; 