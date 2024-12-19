// app/components/cvgen/combined-form/SkillsForm.js
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
  Construction as ConstructionIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];

const STUDENT_SKILLS = [
  { skillName: 'skills.suggestions.items.office', level: 'intermediate' },
  { skillName: 'skills.suggestions.items.communication', level: 'intermediate' },
  { skillName: 'skills.suggestions.items.teamwork', level: 'intermediate' },
  { skillName: 'skills.suggestions.items.timeManagement', level: 'intermediate' },
  { skillName: 'skills.suggestions.items.research', level: 'intermediate' },
  { skillName: 'skills.suggestions.items.presentation', level: 'intermediate' },
  { skillName: 'skills.suggestions.items.analysis', level: 'intermediate' },
  { skillName: 'skills.suggestions.items.writing', level: 'intermediate' },
  { skillName: 'skills.suggestions.items.programming', level: 'intermediate' },
  { skillName: 'skills.suggestions.items.socialMedia', level: 'intermediate' },
  { skillName: 'skills.suggestions.items.adaptability', level: 'intermediate' },
  { skillName: 'skills.suggestions.items.problemSolving', level: 'intermediate' },
  { skillName: 'skills.suggestions.items.organization', level: 'intermediate' },
  { skillName: 'skills.suggestions.items.leadership', level: 'intermediate' },
  { skillName: 'skills.suggestions.items.creativity', level: 'intermediate' }
];

const SkillItem = React.memo(({ index, onRemove, errors }) => {
  const t = useTranslations('cvform');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { register, setValue, getValues } = useFormContext();

  const currentValue = getValues(`skills.${index}.level`);

  const skillNameField = register(`skills.${index}.skillName`, {
    onChange: (e) => {
      setValue(`skills.${index}.skillName`, e.target.value, {
        shouldValidate: false,
        shouldDirty: true,
        shouldTouch: false
      });
    }
  });

  const levelField = register(`skills.${index}.level`, {
    onChange: (e) => {
      setValue(`skills.${index}.level`, e.target.value, {
        shouldValidate: false,
        shouldDirty: true,
        shouldTouch: false
      });
    }
  });

  const handleRemove = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(index);
  }, [onRemove, index]);

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 3 },
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        alignItems: { xs: 'stretch', sm: 'center' },
        position: 'relative',
        borderRadius: 2,
        borderLeft: `4px solid ${theme.palette.primary.main}`,
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <FormControl 
        fullWidth 
        error={!!errors?.skills?.[index]?.skillName}
        sx={{ flex: 2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <TextField
          {...skillNameField}
          label={t('skills.name.label')}
          placeholder={t('skills.name.placeholder')}
          error={!!errors?.skills?.[index]?.skillName}
          helperText={errors?.skills?.[index]?.skillName?.message}
          size={isMobile ? 'small' : 'medium'}
          onBlur={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
      </FormControl>

      <FormControl 
        fullWidth 
        error={!!errors?.skills?.[index]?.level}
        sx={{ flex: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <InputLabel size={isMobile ? 'small' : 'medium'}>
          {t('skills.level.label')}
        </InputLabel>
        <Select
          {...levelField}
          label={t('skills.level.label')}
          error={!!errors?.skills?.[index]?.level}
          defaultValue={currentValue || "beginner"}
          size={isMobile ? 'small' : 'medium'}
          onBlur={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          sx={{
            borderRadius: 2
          }}
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
        onClick={(e) => {
          handleRemove(e);
        }}
        color="error"
        size={isMobile ? 'small' : 'medium'}
        sx={{ 
          alignSelf: { xs: 'flex-end', sm: 'center' },
          flexShrink: 0,
          pointerEvents: 'auto',  // Forcer les événements de pointeur
          zIndex: 1  // S'assurer que le bouton est au-dessus
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Paper>
  );
});

SkillItem.displayName = 'SkillItem';

const SkillsForm = () => {
  const t = useTranslations('cvform');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    control,
    formState: { errors, isValidating, isDirty, dirtyFields },
    clearErrors,
    getValues,
    setValue,
    trigger
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
    rules: {
      validate: () => true
    }
  });

  const handleAddSkill = useCallback(() => {
    if (fields.length < 15) {
      append({ 
        skillName: '', 
        level: 'beginner' 
      }, {
        shouldFocus: false,
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false
      });
    }
  }, [fields.length, append]);

  const handleQuickAdd = useCallback((skill) => {
    if (fields.length < 8) {
      const translatedSkill = {
        ...skill,
        skillName: t(skill.skillName)
      };
      append(translatedSkill);
    }
  }, [fields.length, append, t]);

  const handleRemove = useCallback((index) => {
    
    // Récupérer les valeurs actuelles
    const currentSkills = getValues('skills');
    
    // Créer une nouvelle liste sans l'élément à supprimer
    const newSkills = currentSkills.filter((_, idx) => idx !== index);
    
    // Désactiver temporairement la validation
    const currentMode = control._options.mode;
    control._options.mode = 'manual';
    
    // Mettre à jour le tableau complet
    setValue('skills', newSkills, {
      shouldValidate: false,
      shouldDirty: true,
      shouldTouch: false
    });
    
    // Nettoyer les erreurs
    clearErrors('skills');
    
    // Restaurer le mode de validation
    setTimeout(() => {
      control._options.mode = currentMode;
    }, 0);

  }, [control, setValue, getValues, clearErrors]);

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
          <ConstructionIcon 
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.125rem' },
              color: 'primary.main'
            }}
          />
          <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                fontWeight: 600,
                color: 'primary.main'
              }}
            >
              {t('skills.main.title')}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                mt: 0.5,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              {t('skills.main.description')}
            </Typography>
          </Box>
        </Box>

        {errors?.skills && (
          <Alert 
            severity="error"
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            {errors.skills.message || t('skills.errors.checkFields')}
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
                <SkillItem
                  index={index}
                  onRemove={handleRemove}
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
            variant="contained"
            fullWidth
            size={isMobile ? 'large' : 'medium'}
            sx={{ 
              mt: { xs: 1, sm: 2 },
              height: { xs: '48px', sm: '42px' },
              borderRadius: 6
            }}
          >
            {fields.length === 0
              ? t('skills.actions.addFirst')
              : t('skills.actions.add')}
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
            {t('skills.actions.maxLength')}
          </Alert>
        )}

        {fields.length < 15 && (
          <Box sx={{ mt: 3 }}>
            <Typography 
              variant="subtitle2" 
              gutterBottom
              sx={{ 
                color: 'primary.main',
                fontWeight: 600
              }}
            >
              {t('skills.suggestions.title')}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mb: 2 }}
            >
              {t('skills.suggestions.description')}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1
            }}>
              {STUDENT_SKILLS.map((skill) => (
                <Chip
                  key={skill.skillName}
                  label={t(skill.skillName)}
                  onClick={() => handleQuickAdd(skill)}
                  clickable
                  color="primary"
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

export default SkillsForm; 