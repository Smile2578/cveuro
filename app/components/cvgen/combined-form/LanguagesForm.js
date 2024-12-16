// app/components/cvgen/LanguagesForm.js

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
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
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
  const { register, formState, trigger, setValue, getValues } = useFormContext();

  console.log(`[LanguageItem ${index}] Rendu avec errors:`, errors?.languages?.[index]);

  useEffect(() => {
    console.log(`[LanguageItem ${index}] Initialisation de proficiency`);
    setValue(`languages.${index}.proficiency`, 'B1', { 
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false
    });
  }, [index, setValue]);

  const handleRemoveClick = React.useCallback(() => {
    console.log(`[LanguageItem ${index}] Clic sur supprimer`);
    onRemove(index);
  }, [index, onRemove]);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        display: 'flex',
        gap: 2,
        alignItems: 'flex-start',
        position: 'relative',
      }}
    >
      <Stack spacing={2} sx={{ flex: 1 }}>
        <FormControl fullWidth error={!!errors?.languages?.[index]?.language}>
          <TextField
            {...register(`languages.${index}.language`, {
              onChange: (e) => {
                console.log(`[LanguageItem ${index}] Changement de language:`, e.target.value);
              }
            })}
            label={t('languages.language.label')}
            placeholder={t('languages.language.placeholder')}
            error={!!errors?.languages?.[index]?.language}
            helperText={errors?.languages?.[index]?.language?.message}
            fullWidth
          />
        </FormControl>

        <FormControl fullWidth error={!!errors?.languages?.[index]?.proficiency}>
          <InputLabel>{t('languages.proficiency.label')}</InputLabel>
          <Select
            {...register(`languages.${index}.proficiency`, {
              onChange: (e) => {
                console.log(`[LanguageItem ${index}] Changement de proficiency:`, e.target.value);
              }
            })}
            label={t('languages.proficiency.label')}
            error={!!errors?.languages?.[index]?.proficiency}
            defaultValue="B1"
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

        <Stack direction="row" spacing={2}>
          <FormControl fullWidth>
            <TextField
              {...register(`languages.${index}.testName`, {
                onChange: (e) => {
                  console.log(`[LanguageItem ${index}] Changement de testName:`, e.target.value);
                }
              })}
              label={t('languages.test.name.label')}
              placeholder={t('languages.test.name.placeholder')}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              {...register(`languages.${index}.testScore`, {
                onChange: (e) => {
                  console.log(`[LanguageItem ${index}] Changement de testScore:`, e.target.value);
                }
              })}
              label={t('languages.test.score.label')}
              placeholder={t('languages.test.score.placeholder')}
              fullWidth
            />
          </FormControl>
        </Stack>
      </Stack>

      <IconButton
        onClick={handleRemoveClick}
        color="error"
        sx={{ flexShrink: 0 }}
      >
        <DeleteIcon />
      </IconButton>
    </Paper>
  );
});

LanguageItem.displayName = 'LanguageItem';

const LanguagesForm = () => {
  const t = useTranslations('cvform');
  const {
    control,
    formState: { errors, isValid, isDirty, dirtyFields, touchedFields },
    trigger,
    setValue,
    getValues,
    clearErrors,
    reset
  } = useFormContext();

  console.log('[LanguagesForm] État complet du formulaire:', {
    isValid,
    isDirty,
    dirtyFields,
    touchedFields,
    errors
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'languages',
    shouldUnregister: true
  });

  console.log('[LanguagesForm] Champs actuels:', fields);

  const handleRemove = useCallback((index) => {
    console.log('[LanguagesForm] Début de la suppression pour index:', index);
    
    // On supprime simplement la langue
    remove(index);
    
    // On nettoie les erreurs sans re-validation
    clearErrors('languages');
  }, [remove, clearErrors]);

  const handleAddLanguage = useCallback(() => {
    console.log('[LanguagesForm] Ajout d\'une nouvelle langue');
    if (fields.length < 5) {
      const newLanguage = {
        language: '',
        proficiency: 'B1',
        testName: '',
        testScore: ''
      };
      
      console.log('[LanguagesForm] Nouvelle langue à ajouter:', newLanguage);
      
      // On désactive toute validation
      clearErrors('languages');
      
      append(newLanguage, {
        shouldFocus: true,
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false
      });
    }
  }, [fields.length, append, clearErrors]);

  const handleQuickAdd = useCallback((language) => {
    console.log('[LanguagesForm] Ajout rapide d\'une langue:', language);
    if (fields.length < 5) {
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
      
      // On déclenche la validation après un court délai
      setTimeout(() => {
        trigger('languages');
      }, 100);
    }
  }, [fields.length, append, trigger, t]);

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" gutterBottom>
            {t('languages.main.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('languages.main.description')}
          </Typography>
        </Box>

        {errors?.languages && (
          <Alert severity="error">
            {errors.languages.message || t('languages.errors.checkFields')}
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
            fullWidth
          >
            {fields.length === 0
              ? t('languages.actions.addFirst')
              : t('languages.actions.add')}
          </Button>
        ) : (
          <Alert severity="info">
            {t('languages.actions.maxLength')}
          </Alert>
        )}

        {fields.length < 5 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              {t('languages.suggestions.title')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {COMMON_LANGUAGES.map((language) => (
                <Chip
                  key={language.code}
                  label={t(language.code)}
                  onClick={() => handleQuickAdd(language)}
                  clickable
                  color="primary"
                  variant="outlined"
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