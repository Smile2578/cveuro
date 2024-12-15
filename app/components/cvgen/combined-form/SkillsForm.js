// app/components/cvgen/SkillsForm.js
"use client";

import React, { useState, useCallback } from 'react';
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

const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];

const MEDICAL_SKILLS = [
  { skillName: 'Anatomie', level: 'intermediate' },
  { skillName: 'Physiologie', level: 'intermediate' },
  { skillName: 'Biologie cellulaire', level: 'intermediate' },
  { skillName: 'Biochimie', level: 'intermediate' },
  { skillName: 'Microbiologie', level: 'intermediate' },
  { skillName: 'Pharmacologie', level: 'intermediate' },
  { skillName: 'Immunologie', level: 'intermediate' },
  { skillName: 'Génétique', level: 'intermediate' },
  { skillName: 'Histologie', level: 'intermediate' },
  { skillName: 'Embryologie', level: 'intermediate' },
  { skillName: 'Neurologie', level: 'intermediate' },
  { skillName: 'Pathologie', level: 'intermediate' },
  { skillName: 'Radiologie', level: 'intermediate' },
  { skillName: 'Premiers secours', level: 'intermediate' },
  { skillName: 'Éthique médicale', level: 'intermediate' }
];

const SkillItem = React.memo(({ index, onRemove, errors }) => {
  const t = useTranslations('cvform');
  const { register, formState } = useFormContext();

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <FormControl fullWidth error={!!errors?.skills?.[index]?.skillName}>
        <TextField
          {...register(`skills.${index}.skillName`)}
          label={t('skills.name.label')}
          placeholder={t('skills.name.placeholder')}
          error={!!errors?.skills?.[index]?.skillName}
          helperText={errors?.skills?.[index]?.skillName?.message}
          fullWidth
        />
      </FormControl>

      <FormControl fullWidth error={!!errors?.skills?.[index]?.level}>
        <InputLabel>{t('skills.level.label')}</InputLabel>
        <Select
          {...register(`skills.${index}.level`)}
          label={t('skills.level.label')}
          error={!!errors?.skills?.[index]?.level}
        >
          {SKILL_LEVELS.map((level) => (
            <MenuItem key={level} value={level}>
              {t(`skills.level.options.${level}`)}
            </MenuItem>
          ))}
        </Select>
        {errors?.skills?.[index]?.level && (
          <FormHelperText>
            {errors.skills[index].level.message}
          </FormHelperText>
        )}
      </FormControl>

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

SkillItem.displayName = 'SkillItem';

const SkillsForm = () => {
  const t = useTranslations('cvform');
  const {
    control,
    formState: { errors },
    trigger,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  const handleAddSkill = useCallback(() => {
    if (fields.length < 15) {
      append({ skillName: '', level: 'intermediate' });
    }
  }, [fields.length, append]);

  const handleQuickAdd = useCallback((skill) => {
    if (fields.length < 15) {
      append(skill);
      trigger('skills');
    }
  }, [fields.length, append, trigger]);

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" gutterBottom>
            {t('skills.main.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('skills.main.description')}
          </Typography>
        </Box>

        {errors?.skills && (
          <Alert severity="error">
            {errors.skills.message || t('skills.errors.checkFields')}
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
                <SkillItem
                  index={index}
                  onRemove={remove}
                  errors={errors}
                />
              </motion.div>
            ))}
          </Stack>
        </AnimatePresence>

        {fields.length < 15 ? (
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddSkill}
            variant="outlined"
            fullWidth
          >
            {fields.length === 0
              ? t('skills.actions.addFirst')
              : t('skills.actions.add')}
          </Button>
        ) : (
          <Alert severity="info">
            {t('skills.actions.maxLength')}
          </Alert>
        )}

        {fields.length < 15 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {t('skills.suggestions.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('skills.suggestions.description')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {MEDICAL_SKILLS.map((skill) => (
                <Chip
                  key={skill.skillName}
                  label={skill.skillName}
                  onClick={() => handleQuickAdd(skill)}
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

export default SkillsForm; 