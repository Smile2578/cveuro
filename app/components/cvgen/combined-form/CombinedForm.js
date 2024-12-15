// app/components/cvgen/combined-form/CombinedForm.js

"use client";

import React, { useCallback } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Alert,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useCVStore } from '@/app/store/cvStore';
import { motion, AnimatePresence } from 'framer-motion';
import FormNavigation from '../FormNavigation';
import { useFormProgress } from '@/app/hooks/useFormProgress';

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

const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];
const PROFICIENCY_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];


const COMMON_HOBBIES = [
  'hobbies.suggestions.items.reading',
  'hobbies.suggestions.items.sports',
  'hobbies.suggestions.items.music',
  'hobbies.suggestions.items.travel',
  'hobbies.suggestions.items.photography',
  'hobbies.suggestions.items.cooking',
  'hobbies.suggestions.items.gardening',
  'hobbies.suggestions.items.volunteering',
  'hobbies.suggestions.items.arts',
  'hobbies.suggestions.items.theater'
];

const SkillItem = React.memo(({ index, onRemove, errors }) => {
  const t = useTranslations('cvform');
  const { register, setValue } = useFormContext();

  React.useEffect(() => {
    setValue(`skills.${index}.level`, 'beginner', { shouldValidate: true });
  }, [index, setValue]);

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
          defaultValue="beginner"
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

const SkillsStep = () => {
  const t = useTranslations('cvform');
  const { control, formState: { errors }, trigger } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'skills' });

  const handleAddSkill = useCallback(() => {
    if (fields.length < 15) {
      append({ skillName: '', level: 'beginner' });
    }
  }, [fields.length, append]);

  const handleQuickAdd = useCallback((skill) => {
    if (fields.length < 15) {
      append({
        skillName: t(skill.skillName),
        level: 'beginner'
      });
      trigger('skills');
    }
  }, [fields.length, append, trigger, t]);

  const validateSkills = async () => {
    const result = await trigger('skills');
    return result;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('skills.main.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {t('skills.main.description')}
      </Typography>

      {errors?.skills && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.skills.message || t('skills.errors.checkFields')}
        </Alert>
      )}

      <Stack spacing={2}>
        {fields.map((field, index) => (
          <SkillItem
            key={field.id}
            index={index}
            onRemove={remove}
            errors={errors}
          />
        ))}
      </Stack>

      {fields.length < 15 ? (
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddSkill}
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        >
          {fields.length === 0
            ? t('skills.actions.addFirst')
            : t('skills.actions.add')}
        </Button>
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>
          {t('skills.actions.maxLength')}
        </Alert>
      )}

      {fields.length < 15 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('skills.suggestions.title')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {STUDENT_SKILLS.map((skill) => (
              <Chip
                key={skill.skillName}
                label={t(skill.skillName)}
                onClick={() => handleQuickAdd(skill)}
                clickable
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

const LanguageItem = React.memo(({ index, onRemove, errors }) => {
  const t = useTranslations('cvform');
  const { register } = useFormContext();

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
          />
        </FormControl>

        <FormControl fullWidth error={!!errors?.languages?.[index]?.proficiency}>
          <InputLabel>{t('languages.proficiency.label')}</InputLabel>
          <Select
            {...register(`languages.${index}.proficiency`)}
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

const LanguagesStep = () => {
  const t = useTranslations('cvform');
  const { control, formState: { errors }, trigger } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'languages' });

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

  const validateLanguages = async () => {
    const result = await trigger('languages');
    return result;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('languages.main.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {t('languages.main.description')}
      </Typography>

      {errors?.languages && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.languages.message || t('languages.errors.checkFields')}
        </Alert>
      )}

      <Stack spacing={2}>
        {fields.map((field, index) => (
          <LanguageItem
            key={field.id}
            index={index}
            onRemove={remove}
            errors={errors}
          />
        ))}
      </Stack>

      {fields.length < 5 ? (
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddLanguage}
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        >
          {fields.length === 0
            ? t('languages.actions.addFirst')
            : t('languages.actions.add')}
        </Button>
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>
          {t('languages.actions.maxLength')}
        </Alert>
      )}
    </Box>
  );
};

const HobbyItem = React.memo(({ index, onRemove, errors }) => {
  const t = useTranslations('cvform');
  const { register } = useFormContext();

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
      <FormControl fullWidth error={!!errors?.hobbies?.[index]}>
        <TextField
          {...register(`hobbies.${index}`)}
          label={t('hobbies.hobby.label')}
          placeholder={t('hobbies.hobby.placeholder')}
          error={!!errors?.hobbies?.[index]}
          helperText={errors?.hobbies?.[index]?.message}
          fullWidth
        />
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

HobbyItem.displayName = 'HobbyItem';

const HobbiesStep = () => {
  const t = useTranslations('cvform');
  const { control, formState: { errors }, trigger } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'hobbies' });

  const handleAddHobby = useCallback(() => {
    if (fields.length < 5) {
      append('');
    }
  }, [fields.length, append]);

  const handleQuickAdd = useCallback((hobby) => {
    if (fields.length < 5) {
      append(t(hobby));
      trigger('hobbies');
    }
  }, [fields.length, append, trigger, t]);

  const validateHobbies = async () => {
    const result = await trigger('hobbies');
    return result;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('hobbies.main.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {t('hobbies.main.description')}
      </Typography>

      {errors?.hobbies && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.hobbies.message}
        </Alert>
      )}

      <Stack spacing={2}>
        {fields.map((field, index) => (
          <HobbyItem
            key={field.id}
            index={index}
            onRemove={remove}
            errors={errors}
          />
        ))}
      </Stack>

      {fields.length < 5 ? (
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddHobby}
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        >
          {fields.length === 0
            ? t('hobbies.actions.addFirst')
            : t('hobbies.actions.add')}
        </Button>
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>
          {t('hobbies.actions.maxLength')}
        </Alert>
      )}

      {fields.length < 5 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('hobbies.suggestions.title')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {COMMON_HOBBIES.map((hobby) => (
              <Chip
                key={hobby}
                label={t(hobby)}
                onClick={() => handleQuickAdd(hobby)}
                clickable
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

const CombinedForm = () => {
  const t = useTranslations('cvform');
  const store = useCVStore();
  const { currentSubStep, isSubStep } = useFormProgress();
  const { trigger } = useFormContext();

  const steps = [
    {
      label: t('steps.skills'),
      component: <SkillsStep />,
      validate: () => trigger('skills')
    },
    {
      label: t('steps.hobbies'),
      component: <HobbiesStep />,
      validate: () => trigger('hobbies')
    },
    {
      label: t('steps.languages'),
      component: <LanguagesStep />,
      validate: () => trigger('languages')
    }
  ];

  const handleReset = async () => {
    try {
      store.resetForm();
    } catch (error) {
      console.error('Erreur lors du reset:', error);
    }
  };

  const validateCurrentStep = async () => {
    const currentStep = steps[currentSubStep];
    if (!currentStep?.validate) return true;
    
    const result = await currentStep.validate();
    return result;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper 
        activeStep={currentSubStep} 
        sx={{ 
          mb: 4,
          '& .MuiStepLabel-label': {
            fontSize: '0.875rem',
          }
        }}
      >
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4, minHeight: '400px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSubStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {steps[currentSubStep].component}
          </motion.div>
        </AnimatePresence>
      </Box>

      <FormNavigation
        onValidate={validateCurrentStep}
        onReset={handleReset}
        showReset={true}
      />
    </Box>
  );
};

export default CombinedForm; 