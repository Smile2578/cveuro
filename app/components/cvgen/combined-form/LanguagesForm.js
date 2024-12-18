// app/components/cvgen/combined-form/LanguagesForm.js
"use client";

import React, { useCallback, useEffect } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Translate as LanguageIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const PROFICIENCY_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native'];

const COMMON_LANGUAGES = [
  { code: 'languages.suggestions.items.english', level: 'B2' },
  { code: 'languages.suggestions.items.french', level: 'B2' },
  { code: 'languages.suggestions.items.spanish', level: 'B2' },
  { code: 'languages.suggestions.items.german', level: 'B2' },
  { code: 'languages.suggestions.items.italian', level: 'B2' },
  { code: 'languages.suggestions.items.portuguese', level: 'B2' },
  { code: 'languages.suggestions.items.chinese', level: 'B2' },
  { code: 'languages.suggestions.items.japanese', level: 'B2' },
  { code: 'languages.suggestions.items.arabic', level: 'B2' },
  { code: 'languages.suggestions.items.russian', level: 'B2' }
];

const LanguageItem = React.memo(({ index, onRemove, errors }) => {
  const t = useTranslations('cvform');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { register, setValue, getValues } = useFormContext();

  const currentValue = getValues(`languages.${index}.proficiency`);

  const languageField = register(`languages.${index}.language`, {
    onChange: (e) => {
      setValue(`languages.${index}.language`, e.target.value, {
        shouldValidate: false,
        shouldDirty: true,
        shouldTouch: false
      });
    }
  });

  const proficiencyField = register(`languages.${index}.proficiency`, {
    onChange: (e) => {
      setValue(`languages.${index}.proficiency`, e.target.value, {
        shouldValidate: false,
        shouldDirty: true,
        shouldTouch: false
      });
    }
  });

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 3 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        position: 'relative',
        borderRadius: 2,
        borderLeft: `4px solid ${theme.palette.info.main}`,
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <Stack spacing={2} sx={{ flex: 1 }}>
        <FormControl 
          fullWidth 
          error={!!errors?.languages?.[index]?.language}
        >
          <TextField
            {...languageField}
            label={t('languages.language.label')}
            placeholder={t('languages.language.placeholder')}
            error={!!errors?.languages?.[index]?.language}
            helperText={errors?.languages?.[index]?.language?.message}
            defaultValue={getValues(`languages.${index}.language`) || ''}
            size={isMobile ? 'small' : 'medium'}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </FormControl>

        <FormControl 
          fullWidth 
          error={!!errors?.languages?.[index]?.proficiency}
        >
          <InputLabel size={isMobile ? 'small' : 'medium'}>
            {t('languages.proficiency.label')}
          </InputLabel>
          <Select
            {...proficiencyField}
            label={t('languages.proficiency.label')}
            error={!!errors?.languages?.[index]?.proficiency}
            defaultValue={currentValue || 'B1'}
            size={isMobile ? 'small' : 'medium'}
            sx={{
              borderRadius: 2
            }}
          >
            {PROFICIENCY_LEVELS.map((level) => (
              <MenuItem key={level} value={level}>
                {t(`languages.proficiency.options.${level}`)}
              </MenuItem>
            ))}
          </Select>
          {errors?.languages?.[index]?.proficiency && (
            <FormHelperText>
              {errors.languages[index].proficiency.message}
            </FormHelperText>
          )}
        </FormControl>

        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2}
        >
          <FormControl fullWidth>
            <TextField
              {...register(`languages.${index}.testName`)}
              label={t('languages.test.name.label')}
              placeholder={t('languages.test.name.placeholder')}
              defaultValue={getValues(`languages.${index}.testName`) || ''}
              size={isMobile ? 'small' : 'medium'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              {...register(`languages.${index}.testScore`)}
              label={t('languages.test.score.label')}
              placeholder={t('languages.test.score.placeholder')}
              defaultValue={getValues(`languages.${index}.testScore`) || ''}
              size={isMobile ? 'small' : 'medium'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </FormControl>
        </Stack>
      </Stack>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        mt: 1
      }}>
        <IconButton
          onClick={() => onRemove(index)}
          color="error"
          size={isMobile ? 'small' : 'medium'}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Paper>
  );
});

LanguageItem.displayName = 'LanguageItem';

const LanguagesForm = () => {
  const t = useTranslations('cvform');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    control,
    formState: { errors, touchedFields },
    trigger,
    clearErrors,
    getValues,
    setValue
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'languages',
    shouldUnregister: false
  });

  const handleRemove = useCallback((index) => {
    clearErrors();
    
    // Récupérer les valeurs actuelles
    const currentLanguages = getValues('languages');
    
    // Créer une nouvelle liste sans l'élément à supprimer
    const newLanguages = currentLanguages.filter((_, idx) => idx !== index);
    
    // Désactiver temporairement la validation
    const currentMode = control._options.mode;
    control._options.mode = 'manual';
    
    // Mettre à jour le tableau complet
    setValue('languages', newLanguages, {
      shouldValidate: false,
      shouldDirty: true,
      shouldTouch: false
    });
    
    // Nettoyer les erreurs
    clearErrors('languages');
    
    // Restaurer le mode de validation
    setTimeout(() => {
      control._options.mode = currentMode;
    }, 0);
  }, [control, setValue, getValues, clearErrors]);

  const handleAddLanguage = useCallback(() => {
    if (fields.length < 5) {
      clearErrors();
      
      const newLanguage = {
        language: '',
        proficiency: 'B1',
        testName: '',
        testScore: ''
      };
      
      append(newLanguage, {
        shouldFocus: false,
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false
      });
    }
  }, [fields.length, append, clearErrors]);

  const handleQuickAdd = useCallback((language) => {
    if (fields.length < 5) {
      clearErrors();
      
      const newLanguage = {
        language: t(language.code),
        proficiency: language.level,
        testName: '',
        testScore: ''
      };
      
      append(newLanguage, {
        shouldFocus: false,
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false
      });
    }
  }, [fields.length, append, clearErrors, t]);

  useEffect(() => {
    if (fields.length === 0) {
      clearErrors('languages');
    }
  }, [fields.length, clearErrors]);

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={3}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'center' },
          textAlign: { xs: 'center', sm: 'left' },
          gap: 2,
          mb: { xs: 2, sm: 3 }
        }}>
          <LanguageIcon 
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.125rem' },
              color: 'info.main'
            }}
          />
          <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                fontWeight: 600,
                color: 'info.main'
              }}
            >
              {t('languages.main.title')}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                mt: 0.5,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              {t('languages.main.description')}
            </Typography>
          </Box>
        </Box>

        {(errors?.languages?.message || errors?.languages?.type === 'required') && (
          <Alert 
            severity="error"
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            {errors.languages.message || t('languages.errors.required')}
          </Alert>
        )}

        <AnimatePresence mode="wait">
          <Stack spacing={2}>
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <LanguageItem
                  index={index}
                  onRemove={handleRemove}
                  errors={errors}
                />
              </motion.div>
            ))}
          </Stack>
        </AnimatePresence>

        {fields.length < 5 ? (
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddLanguage}
            variant="outlined"
            color="info"
            fullWidth
            size={isMobile ? 'large' : 'medium'}
            sx={{ 
              mt: { xs: 1, sm: 2 },
              height: { xs: '48px', sm: '42px' },
              borderRadius: 6
            }}
          >
            {fields.length === 0
              ? t('languages.actions.addFirst')
              : t('languages.actions.add')}
          </Button>
        ) : (
          <Alert 
            severity="info"
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            {t('languages.actions.maxLength')}
          </Alert>
        )}

        {fields.length < 5 && (
          <Box sx={{ mt: 3 }}>
            <Typography 
              variant="subtitle2" 
              gutterBottom
              sx={{ 
                color: 'info.main',
                fontWeight: 600
              }}
            >
              {t('languages.suggestions.title')}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1
            }}>
              {COMMON_LANGUAGES.map((language) => (
                <Chip
                  key={language.code}
                  label={t(language.code)}
                  onClick={() => handleQuickAdd(language)}
                  clickable
                  color="info"
                  variant="outlined"
                  size={isMobile ? 'small' : 'medium'}
                  sx={{ 
                    borderRadius: 3,
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default LanguagesForm; 