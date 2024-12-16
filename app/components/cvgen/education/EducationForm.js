// app/components/cvgen/education/EducationForm.js

"use client";

import React, { useEffect, forwardRef, useState, useCallback } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
  Stack,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  FormControlLabel,
  Checkbox,
  Paper,
  Tooltip,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  MenuItem,
  Collapse,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  School as SchoolIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useCVStore } from '../../../store/cvStore';
import FormNavigation from '../FormNavigation';
import { useFormProgress } from '@/app/hooks/useFormProgress';

// Composant StyledTextField inchangé
const StyledTextField = forwardRef(({ error, helperText, ...props }, ref) => {
  const theme = useTheme();
  
  return (
    <TextField
      {...props}
      ref={ref}
      error={!!error}
      helperText={helperText}
      sx={{
        '& .MuiOutlinedInput-root': {
          transition: 'all 0.3s ease',
          '&:hover, &.Mui-focused': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)'
          },
          ...(error && {
            '& fieldset': {
              borderColor: theme.palette.error.main
            }
          })
        }
      }}
    />
  );
});

StyledTextField.displayName = 'StyledTextField';

const EducationCard = React.memo(({ index, remove, errors, isExpanded, onToggle }) => {
  const t = useTranslations('cvform');
  const theme = useTheme();
  const { watch, setValue, register, formState: { isSubmitted, touchedFields } } = useFormContext();

  const selectedDegree = watch(`educations.${index}.degree`);
  const isOtherDegree = selectedDegree === 'other';
  const schoolName = watch(`educations.${index}.schoolName`);
  const degree = watch(`educations.${index}.degree`);
  const achievements = watch(`educations.${index}.achievements`) || [];
  const isOngoing = watch(`educations.${index}.ongoing`);
  const endDate = watch(`educations.${index}.endDate`);
  const startDate = watch(`educations.${index}.startDate`);
  const fieldOfStudy = watch(`educations.${index}.fieldOfStudy`);

  const degreeOptions = [
    { value: 'baccalaureat', label: t('education.degree.options.baccalaureat') },
    { value: 'licence', label: t('education.degree.options.licence') },
    { value: 'bachelor', label: t('education.degree.options.bachelor') },
    { value: 'master', label: t('education.degree.options.master') },
    { value: 'doctorat', label: t('education.degree.options.doctorat') },
    { value: 'other', label: t('education.degree.options.other') }
  ];

  const formatDateForDisplay = useCallback((date) => {
    return date ? dayjs(date, 'MM/YYYY') : null;
  }, []);

  useEffect(() => {
    if (isOngoing) {
      setValue(
        `educations.${index}.endDate`,
        '',
        { 
          shouldValidate: false,
          shouldDirty: false,
          shouldTouch: false
        }
      );
    }
  }, [isOngoing, setValue, index]);

  const handleDateChange = useCallback((fieldName, date) => {
    setValue(
      fieldName,
      date ? dayjs(date).format('MM/YYYY') : '',
      { 
        shouldValidate: true,
        shouldTouch: true 
      }
    );
  }, [setValue]);
  const handleOngoingChange = useCallback((e) => {
    setValue(`educations.${index}.ongoing`, e.target.checked, { 
      shouldValidate: false // On ne valide pas immédiatement au changement
    });
    if (e.target.checked) {
      setValue(`educations.${index}.endDate`, '', { 
        shouldValidate: false 
      });
    }
  }, [setValue, index]);

  return (
    <Paper
      elevation={2}
      sx={{ 
        p: 3, 
        mb: 3, 
        position: 'relative',
        borderLeft: `4px solid ${
          errors?.educations?.[index] ? theme.palette.error.main : theme.palette.secondary.main
        }`,
        '&:hover': {
          boxShadow: theme.shadows[4]
        },
        width: '100%'
      }}
    >
      {/* Header de la carte */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SchoolIcon fontSize="small" color="secondary" />
          <Typography variant="subtitle1" color="secondary">
            {schoolName || degree ? 
              `${schoolName}${degree ? ` - ${t(`education.degree.options.${degree}`)}` : ''}` 
              : t('education.main.title')} {index + 1}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {index > 0 && (
            <Tooltip title={t('education.actions.remove')}>
              <IconButton
                onClick={() => remove(index)}
                size="small"
                sx={{ 
                  '&:hover': {
                    color: theme.palette.error.main
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          <IconButton onClick={() => onToggle(index)} size="small">
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={isExpanded}>
        <Stack spacing={3} sx={{ width: '100%', mt: 2 }}>
          {/* Première ligne : École et Diplôme */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <Box sx={{ width: '100%', minHeight: '80px' }}>
              <StyledTextField
                {...register(`educations.${index}.schoolName`)}
                fullWidth
                label={t('education.school.label')}
                placeholder={t('education.school.placeholder')}
                error={errors?.educations?.[index]?.schoolName}
                helperText={errors?.educations?.[index]?.schoolName?.message}
              />
            </Box>

            <Box sx={{ width: '100%', minHeight: '80px' }}>
              <FormControl fullWidth error={!!errors?.educations?.[index]?.degree}>
                <InputLabel>{t('education.degree.label')}</InputLabel>
                <Select
                  {...register(`educations.${index}.degree`)}
                  value={selectedDegree || ''}
                  label={t('education.degree.label')}
                  placeholder={t('education.degree.placeholder')}
                >
                  {degreeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors?.educations?.[index]?.degree && (
                  <FormHelperText>{errors.educations[index].degree.message}</FormHelperText>
                )}
              </FormControl>
            </Box>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <Box sx={{ width: '100%', minHeight: '80px' }}>
              <StyledTextField
                {...register(`educations.${index}.fieldOfStudy`)}
                fullWidth
                label={t('education.fieldOfStudy.label')}
                placeholder={t('education.fieldOfStudy.placeholder')}
                error={errors?.educations?.[index]?.fieldOfStudy}
                helperText={errors?.educations?.[index]?.fieldOfStudy?.message}
              />
            </Box>
          </Stack>

          {/* Deuxième ligne : Dates de début et fin */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <Box sx={{ width: '100%', minHeight: '80px' }}>
              <DatePicker
                label={t('education.dates.startDate.label')}
                views={['year', 'month']}
                value={formatDateForDisplay(startDate)}
                onChange={(date) => handleDateChange(`educations.${index}.startDate`, date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    placeholder: t('education.dates.startDate.placeholder'),
                    error: !!errors?.educations?.[index]?.startDate,
                    helperText: errors?.educations?.[index]?.startDate?.message
                  }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '80px' }}>
              <Box sx={{ width: '100%', mb: 1 }}>
                <DatePicker
                  label={t('education.dates.endDate.label')}
                  views={['year', 'month']}
                  value={formatDateForDisplay(endDate)}
                  onChange={(date) => handleDateChange(`educations.${index}.endDate`, date)}
                  disabled={isOngoing}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: !isOngoing,
                      placeholder: t('education.dates.endDate.placeholder'),
                      error: !isOngoing && !!errors?.educations?.[index]?.endDate,
                      helperText: !isOngoing && errors?.educations?.[index]?.endDate?.message
                    }
                  }}
                />
              </Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isOngoing}
                    onChange={handleOngoingChange}
                    {...register(`educations.${index}.ongoing`)}
                  />
                }
                label={t('education.dates.ongoing')}
                sx={{ alignSelf: 'flex-end' }}
              />
            </Box>
          </Stack>

          {/* Champ diplôme personnalisé si "other" est sélectionné */}
          {isOtherDegree && (
            <Box sx={{ width: '100%', minHeight: '80px' }}>
              <StyledTextField
                {...register(`educations.${index}.customDegree`)}
                fullWidth
                required
                label={t('education.customDegree.label')}
                placeholder={t('education.customDegree.placeholder')}
                error={errors?.educations?.[index]?.customDegree}
                helperText={errors?.educations?.[index]?.customDegree?.message}
              />
            </Box>
          )}

          {/* Section des réalisations */}
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle2" gutterBottom>
              {t('education.achievements.label')}
            </Typography>
            <Stack spacing={2} sx={{ width: '100%' }}>
              {achievements.map((achievement, achievementIndex) => (
                <Box 
                  key={`${index}-${achievementIndex}`} 
                  sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    width: '100%',
                    minHeight: '80px'
                  }}
                >
                  <StyledTextField
                    {...register(`educations.${index}.achievements.${achievementIndex}`)}
                    fullWidth
                    multiline
                    rows={2}
                    placeholder={t('education.achievements.placeholder')}
                    error={!!errors?.educations?.[index]?.achievements?.[achievementIndex]}
                    helperText={errors?.educations?.[index]?.achievements?.[achievementIndex]?.message}
                    sx={{ flex: 1 }}
                  />
                  <IconButton 
                    onClick={() => {
                      const currentAchievements = [...achievements];
                      currentAchievements.splice(achievementIndex, 1);
                      setValue(
                        `educations.${index}.achievements`,
                        currentAchievements,
                        { shouldValidate: false }
                      );
                    }}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              {achievements.length < 4 && (
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setValue(
                      `educations.${index}.achievements`,
                      [...achievements, ''],
                      { shouldValidate: false }
                    );
                  }}
                  variant="outlined"
                  size="small"
                >
                  {t('education.achievements.add')}
                </Button>
              )}
            </Stack>
          </Box>
        </Stack>
      </Collapse>
    </Paper>
  );
});

EducationCard.displayName = 'EducationCard';

const EducationForm = () => {
  const { control, formState: { errors, isSubmitted }, trigger, getValues, reset } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "educations"
  });
  const t = useTranslations('cvform');
  const [expandedItems, setExpandedItems] = useState([0]);
  const educationsErrors = errors?.educations;
  const cvStore = useCVStore();
  const [isResetting, setIsResetting] = useState(false);

  // Effet pour l'initialisation unique
  useEffect(() => {
    console.log('Initialisation effect - fields:', fields.length);
    const currentEducations = getValues('educations');
    console.log('Current educations:', currentEducations);
    if (!isResetting && (!currentEducations || currentEducations.length === 0)) {
      append({
        schoolName: '',
        degree: '',
        startDate: '',
        endDate: '',
        fieldOfStudy: '',
        ongoing: false,
        achievements: [],
        customDegree: ''
      });
      setExpandedItems([0]);
    }
  }, [isResetting, append, getValues]);

  // Effet pour synchroniser les erreurs avec le store
  useEffect(() => {
    if (errors?.educations) {
      console.log('Education errors:', errors.educations);
      cvStore.setFormErrors({
        ...cvStore.formErrors,
        educations: errors.educations
      });
    } else {
      cvStore.clearFormErrors();
    }
  }, [errors?.educations]);

  const handleAddEducation = useCallback(() => {
    console.log('Adding education - current fields:', fields.length);
    if (fields.length < 4) {
      // Désactiver temporairement la validation
      const newEducation = {
        schoolName: '',
        degree: '',
        startDate: '',
        endDate: '',
        fieldOfStudy: '',
        ongoing: false,
        achievements: [],
        customDegree: null
      };
      
      append(newEducation, { shouldFocus: false });
      const newIndex = fields.length;
      setExpandedItems(prev => [...prev, newIndex]);
      
      // Nettoyer les erreurs pour la nouvelle formation
      if (errors?.educations) {
        const newErrors = { ...errors };
        delete newErrors.educations[fields.length];
        cvStore.setFormErrors(newErrors);
      }
    }
  }, [fields.length, append, errors, cvStore]);

  // Fonction de réinitialisation
  const handleReset = useCallback(async () => {
    console.log('Resetting education form');
    try {
      setIsResetting(true);
      
      // Réinitialiser avec une seule formation vide
      const emptyEducation = {
        schoolName: '',
        degree: '',
        startDate: '',
        endDate: '',
        ongoing: false,
        achievements: [],
        customDegree: null
      };
      
      // Réinitialiser le formulaire complet
      await reset({
        educations: [emptyEducation]
      }, {
        keepDefaultValues: true,
        keepErrors: false,
        keepDirty: false,
        keepTouched: false,
        keepIsValid: false,
        keepIsSubmitted: false
      });
      
      // Réinitialiser l'état local
      setExpandedItems([0]);
      cvStore.clearFormErrors();
    } catch (error) {
      console.error('Reset error:', error);
    } finally {
      setIsResetting(false);
    }
  }, [reset, cvStore]);

  // Validation du formulaire
  const validateForm = useCallback(async () => {
    console.log('Validating education form');
    if (fields.length === 0) return false;
    
    // Valider toutes les formations
    const result = await trigger('educations', { shouldFocus: true });
    console.log('Validation result:', result, 'Errors:', errors?.educations);
    
    // Si la validation échoue, déployer les cartes avec des erreurs
    if (!result && errors?.educations) {
      const errorIndexes = Object.keys(errors.educations)
        .filter(key => typeof errors.educations[key] === 'object')
        .map(Number);
      
      if (errorIndexes.length > 0) {
        console.log('Expanding cards with errors:', errorIndexes);
        setExpandedItems(prev => [...new Set([...prev, ...errorIndexes])]);
      }
    }
    
    return result;
  }, [fields.length, trigger, errors?.educations]);

  // Gestion de la suppression d'une éducation
  const handleRemove = useCallback((index) => {
    if (fields.length > 1) {
      remove(index);
      // Mettre à jour les éléments déployés en prenant en compte l'index supprimé
      setExpandedItems(prev => prev
        .filter(i => i !== index)
        .map(i => i > index ? i - 1 : i)
      );
    }
  }, [fields.length, remove]);

  // Gestion du déploiement/repli des cartes d'éducation
  const handleToggle = useCallback((index) => {
    setExpandedItems(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return [...prev, index];
    });
  }, []);

  // Fonction utilitaire pour vérifier la présence d'erreurs
  const hasErrors = useCallback((index) => {
    return educationsErrors && educationsErrors[index];
  }, [educationsErrors]);

  // Fonction pour obtenir les messages d'erreur formatés
  const getErrorMessage = useCallback((index) => {
    if (!educationsErrors || !educationsErrors[index]) return '';
    
    const errors = educationsErrors[index];
    const errorMessages = [];
    
    if (errors.schoolName) errorMessages.push(t('education.school.error'));
    if (errors.degree) errorMessages.push(t('education.degree.error'));
    if (errors.customDegree) errorMessages.push(t('education.customDegree.error'));
    if (errors.startDate) errorMessages.push(t('education.dates.startDate.error'));
    if (errors.endDate && !getValues(`educations.${index}.ongoing`)) {
      errorMessages.push(t('education.dates.endDate.error'));
    }
    
    return errorMessages.join(', ');
  }, [educationsErrors, t, getValues]);

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {t('education.main.title')}
      </Typography>

      {fields.map((field, index) => (
        <Box key={field.id} sx={{ mb: 3, position: 'relative' }}>
          {hasErrors(index) && !expandedItems.includes(index) && (
            <Alert 
              severity="error" 
              sx={{ mb: 1 }}
              action={
                <Button 
                  color="error" 
                  size="small"
                  onClick={() => handleToggle(index)}
                >
                  {t('common.showDetails')}
                </Button>
              }
            >
              {getErrorMessage(index)}
            </Alert>
          )}
          <EducationCard
            index={index}
            remove={handleRemove}
            errors={errors}
            isExpanded={expandedItems.includes(index)}
            onToggle={handleToggle}
          />
        </Box>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={handleAddEducation}
        variant="outlined"
        color="primary"
        fullWidth
        sx={{ mt: 2, mb: 4 }}
        disabled={fields.length >= 4}
      >
        {t('education.actions.add')}
      </Button>

      <FormNavigation
        onValidate={validateForm}
        onReset={handleReset}
        showReset={true}
      />
    </Box>
  );
};

export default EducationForm;