// app/components/cvgen/LanguagesForm.js

"use client";

import React, { useCallback } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
  Box,
  Button,
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

const PROFICIENCY_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];


const LanguageItem = React.memo(({ index, onRemove, errors }) => {
  const t = useTranslations('cvform');
  const { register, formState } = useFormContext();

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
            {...register(`languages.${index}.language`)}
            label={t('languages.language.label')}
            placeholder={t('languages.language.placeholder')}
            error={!!errors?.languages?.[index]?.language}
            helperText={errors?.languages?.[index]?.language?.message}
            fullWidth
            select
          >
            {COMMON_LANGUAGES.map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>

        <FormControl fullWidth error={!!errors?.languages?.[index]?.proficiency}>
          <InputLabel>{t('languages.proficiency.label')}</InputLabel>
          <Select
            {...register(`languages.${index}.proficiency`)}
            label={t('languages.proficiency.label')}
            error={!!errors?.languages?.[index]?.proficiency}
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
              {...register(`languages.${index}.testName`)}
              label={t('languages.test.name.label')}
              placeholder={t('languages.test.name.placeholder')}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              {...register(`languages.${index}.testScore`)}
              label={t('languages.test.score.label')}
              placeholder={t('languages.test.score.placeholder')}
              fullWidth
            />
          </FormControl>
        </Stack>
      </Stack>

      <IconButton
        onClick={() => onRemove(index)}
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
    formState: { errors },
    trigger,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'languages',
  });

  const handleAddLanguage = useCallback(() => {
    if (fields.length < 5) {
      append({
        language: '',
        proficiency: 'B1',
        testName: '',
        testScore: ''
      });
    }
  }, [fields.length, append]);

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

        <AnimatePresence>
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
                  onRemove={remove}
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
      </Stack>
    </Box>
  );
};

export default LanguagesForm; 