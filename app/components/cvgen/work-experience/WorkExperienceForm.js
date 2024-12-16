// app/components/cvgen/work-experience/WorkExperienceForm.js
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
  Alert,
  Switch,
  Tooltip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Work as WorkIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { useCVStore } from '@/app/store/cvStore';
import FormNavigation from '../FormNavigation';
import { useFormProgress } from '@/app/hooks/useFormProgress';

const StyledTextField = React.forwardRef(({ error, helperText, ...props }, ref) => {
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

const ExperienceCard = React.memo(({ 
  index, 
  remove, 
  errors, 
  isExpanded, 
  onToggle,
  onRemove,
  defaultValues 
}) => {
  const t = useTranslations('validation');
  const tForm = useTranslations('cvform');
  const theme = useTheme();
  const { register, watch, setValue, trigger } = useFormContext();

  const formatDateForValidation = useCallback((date) => {
    return date ? dayjs(date).format('MM/YYYY') : '';
  }, []);

  const formatDateForDisplay = useCallback((date) => {
    return date ? dayjs(date, 'MM/YYYY') : null;
  }, []);

  const watchedFields = watch([
    `workExperience.experiences.${index}.companyName`,
    `workExperience.experiences.${index}.position`,
    `workExperience.experiences.${index}.ongoing`,
    `workExperience.experiences.${index}.endDate`,
    `workExperience.experiences.${index}.startDate`,
    `workExperience.experiences.${index}.responsibilities`
  ]);

  const [
    companyName,
    position,
    isOngoing,
    endDate,
    startDate,
    responsibilities
  ] = watchedFields;

  useEffect(() => {
    if (isOngoing) {
      setValue(`workExperience.experiences.${index}.endDate`, '', { 
        shouldValidate: false
      });
    }
  }, [isOngoing, setValue, index]);

  const hasFieldErrors = !!errors?.workExperience?.experiences?.[index];

  useEffect(() => {
    if (hasFieldErrors && !isExpanded) {
      onToggle(index);
    }
  }, [hasFieldErrors, isExpanded, onToggle, index]);

  const handleDateChange = useCallback(async (field, date) => {
    setValue(
      `workExperience.experiences.${index}.${field}`,
      formatDateForValidation(date),
      { shouldValidate: false }
    );
  }, [setValue, index, formatDateForValidation]);

  const handleResponsibilityChange = useCallback((respIndex, action) => {
    const currentResponsibilities = responsibilities || [];
    let newResponsibilities;

    if (action === 'add') {
      newResponsibilities = [...currentResponsibilities, ''];
    } else {
      newResponsibilities = currentResponsibilities.filter((_, idx) => idx !== respIndex);
    }

    setValue(
      `workExperience.experiences.${index}.responsibilities`,
      newResponsibilities,
      { shouldValidate: false }
    );
  }, [responsibilities, setValue, index]);

  return (
    <Paper
      elevation={2}
      sx={{ 
        p: 3, 
        mb: 3, 
        position: 'relative',
        borderLeft: `4px solid ${
          hasFieldErrors ? theme.palette.error.main : theme.palette.primary.main
        }`,
        '&:hover': {
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WorkIcon color="primary" />
          <Typography variant="subtitle1" color="primary">
            {companyName || position ? 
              `${companyName}${position ? ` - ${position}` : ''}` 
              : `${tForm('experience.main.title')} ${index + 1}`}
          </Typography>
          {hasFieldErrors && !isExpanded && (
            <Alert 
              severity="error" 
              sx={{ ml: 2 }}
              action={
                <Button 
                  color="error" 
                  size="small"
                  onClick={() => onToggle(index)}
                >
                  {tForm('common.showDetails')}
                </Button>
              }
            >
              {tForm('experience.errors.hasErrors')}
            </Alert>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={tForm('experience.actions.remove')}>
            <IconButton 
              onClick={() => onRemove(index)} 
              size="small"
              aria-label={tForm('experience.actions.remove')}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <IconButton 
            onClick={() => onToggle(index)} 
            size="small"
            aria-label={isExpanded ? tForm('common.hideDetails') : tForm('common.showDetails')}
          >
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={isExpanded}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <StyledTextField
              {...register(`workExperience.experiences.${index}.companyName`)}
              fullWidth
              label={tForm('experience.company.label')}
              placeholder={tForm('experience.company.placeholder')}
              error={!!errors?.workExperience?.experiences?.[index]?.companyName}
              helperText={errors?.workExperience?.experiences?.[index]?.companyName?.message}
            />
            <StyledTextField
              {...register(`workExperience.experiences.${index}.position`)}
              fullWidth
              label={tForm('experience.position.label')}
              placeholder={tForm('experience.position.placeholder')}
              error={!!errors?.workExperience?.experiences?.[index]?.position}
              helperText={errors?.workExperience?.experiences?.[index]?.position?.message}
            />
          </Stack>

          <StyledTextField
            {...register(`workExperience.experiences.${index}.location`)}
            fullWidth
            label={tForm('experience.location.label')}
            placeholder={tForm('experience.location.placeholder')}
            error={!!errors?.workExperience?.experiences?.[index]?.location}
            helperText={errors?.workExperience?.experiences?.[index]?.location?.message}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <Box sx={{ width: '100%' }}>
              <DatePicker
                label={tForm('experience.dates.startDate.label')}
                views={['year', 'month']}
                value={formatDateForDisplay(startDate)}
                onChange={(date) => handleDateChange('startDate', date)}
                format="MMMM YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!errors?.workExperience?.experiences?.[index]?.startDate,
                    helperText: errors?.workExperience?.experiences?.[index]?.startDate?.message,
                    placeholder: tForm('experience.dates.startDate.placeholder')
                  }
                }}
              />
            </Box>

            <Box sx={{ width: '100%' }}>
              <DatePicker
                label={tForm('experience.dates.endDate.label')}
                views={['year', 'month']}
                value={formatDateForDisplay(endDate)}
                onChange={(date) => handleDateChange('endDate', date)}
                disabled={isOngoing}
                format="MMMM YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: !isOngoing,
                    error: !isOngoing && !!errors?.workExperience?.experiences?.[index]?.endDate,
                    helperText: !isOngoing ? errors?.workExperience?.experiences?.[index]?.endDate?.message : '',
                    placeholder: tForm('experience.dates.endDate.placeholder')
                  }
                }}
              />
            </Box>
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isOngoing}
                  onChange={(e) => {
                    setValue(`workExperience.experiences.${index}.ongoing`, e.target.checked, {
                      shouldValidate: false
                    });
                  }}
                />
              }
              label={tForm('experience.dates.ongoing')}
              labelPlacement="start"
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {tForm('experience.responsibilities.label')}
            </Typography>
            <Stack spacing={2}>
              {(responsibilities || []).map((_, respIndex) => (
                <Box key={respIndex} sx={{ display: 'flex', gap: 1 }}>
                  <StyledTextField
                    {...register(`workExperience.experiences.${index}.responsibilities.${respIndex}`)}
                    fullWidth
                    multiline
                    rows={2}
                    placeholder={tForm('experience.responsibilities.placeholder')}
                    error={!!errors?.workExperience?.experiences?.[index]?.responsibilities?.[respIndex]}
                    helperText={errors?.workExperience?.experiences?.[index]?.responsibilities?.[respIndex]?.message}
                  />
                  <IconButton 
                    onClick={() => handleResponsibilityChange(respIndex, 'remove')}
                    aria-label={tForm('common.delete')}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              {(!responsibilities || responsibilities.length < 5) && (
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleResponsibilityChange(null, 'add')}
                  variant="outlined"
                  size="small"
                >
                  {tForm('experience.responsibilities.add')}
                </Button>
              )}
              {responsibilities?.length >= 5 && (
                <Alert severity="info">
                  {t('experience.responsibilities.maxItems')}
                </Alert>
              )}
            </Stack>
          </Box>
        </Stack>
      </Collapse>
    </Paper>
  );
});

ExperienceCard.displayName = 'ExperienceCard';

const WorkExperienceForm = () => {
  const { 
    control, 
    formState: { errors, isSubmitted }, 
    watch, 
    setValue, 
    trigger,
    getValues 
  } = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "workExperience.experiences"
  });
  
  const t = useTranslations('cvform');
  const store = useCVStore();
  const [expandedItems, setExpandedItems] = useState([0]);
  const [showNoExpDialog, setShowNoExpDialog] = useState(false);
  const { isMainStep } = useFormProgress();

  const hasWorkExperience = watch('workExperience.hasWorkExperience', false);

  // Effet d'initialisation pour synchroniser avec le localStorage
  useEffect(() => {
    const formData = store.formData;
    console.log('WorkExperienceForm - Initialisation', {
      storeData: formData?.workExperience,
      currentFields: fields,
      hasWorkExperience
    });

    // Vérifier s'il y a des expériences dans le store
    const hasExistingExperiences = formData?.workExperience?.experiences?.length > 0;
    const shouldInitialize = hasExistingExperiences && 
                           (!hasWorkExperience || fields.length === 0) && 
                           !fields.some(field => field.companyName); // Vérifie si les champs sont vides

    if (shouldInitialize) {
      console.log('WorkExperienceForm - Restauration des données et activation du switch');
      // Activer le switch
      setValue('workExperience.hasWorkExperience', true, { 
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false
      });

      // Nettoyer les champs existants avant d'ajouter
      remove();

      // Ajouter les expériences existantes
      formData.workExperience.experiences.forEach(exp => {
        append(exp, { shouldFocus: false });
      });
    }
  }, [store.formData, fields.length, setValue, append, hasWorkExperience, remove]);

  // Effet pour synchroniser les erreurs avec le store uniquement quand nécessaire
  useEffect(() => {
    const hasErrors = !!errors?.workExperience;
    const currentErrors = store.formErrors?.workExperience;
    
    // Ne mettre à jour que si l'état des erreurs a changé
    if (hasErrors !== !!currentErrors) {
      if (hasErrors) {
        store.setFormErrors({
          workExperience: errors.workExperience
        });
      } else {
        store.clearFormErrors();
      }
    }
  }, [errors?.workExperience, store]);

  const handleToggle = useCallback((index) => {
    setExpandedItems(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return [...prev, index];
    });
  }, []);

  const handleAddExperience = useCallback(async () => {
    console.log('handleAddExperience - Début', {
      fieldsLength: fields.length,
      currentExperiences: getValues('workExperience.experiences')
    });

    if (fields.length < 4) {
      // Vérifier si le store a des expériences mais que fields est vide
      // Cela signifie qu'on ajoute la première expérience après une réinitialisation
      const currentExperiences = getValues('workExperience.experiences');
      if (fields.length === 0 && currentExperiences && currentExperiences.length > 0) {
        // Réinitialiser complètement avant d'ajouter
        store.setFormData({
          ...getValues(),
          workExperience: {
            hasWorkExperience: true,
            experiences: []
          }
        });
        remove();
      }

      const newExperience = {
        companyName: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        ongoing: false,
        responsibilities: []
      };
      
      console.log('handleAddExperience - Avant append', { newExperience });
      append(newExperience, { shouldFocus: false });
      console.log('handleAddExperience - Après append');
      
      setExpandedItems(prev => [...prev, fields.length]);

      if (fields.length === 0) {
        console.log('handleAddExperience - Activation du switch car première expérience');
        setValue('workExperience.hasWorkExperience', true, { 
          shouldValidate: false,
          shouldDirty: false,
          shouldTouch: false
        });
      }
    }
  }, [fields.length, append, setValue, getValues, store, remove]);

  const handleExperienceToggle = useCallback(async (event) => {
    const newValue = event.target.checked;
    console.log('handleExperienceToggle', { 
      newValue, 
      fieldsLength: fields.length,
      currentExperiences: getValues('workExperience.experiences')
    });

    if (!newValue && fields.length > 0) {
      setShowNoExpDialog(true);
    } else {
      setValue('workExperience.hasWorkExperience', newValue, { 
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false
      });
    }
  }, [fields.length, setValue, getValues]);

  const handleRemoveExperience = useCallback(async (index) => {
    console.log('handleRemoveExperience - Début', { 
      index,
      fieldsLength: fields.length,
      currentExperiences: getValues('workExperience.experiences')
    });

    remove(index);
    setExpandedItems(prev => prev.filter(i => i !== index).map(i => i > index ? i - 1 : i));
    
    if (fields.length === 1) {
      console.log('handleRemoveExperience - Dernière expérience supprimée');
      
      // Réinitialiser le formulaire avec les valeurs actuelles sauf workExperience
      const currentFormData = getValues();
      const newFormData = {
        ...currentFormData,
        workExperience: {
          hasWorkExperience: false,
          experiences: []
        }
      };
      
      // Réinitialiser le store et le formulaire
      store.setFormData(newFormData);
      store.clearFormErrors();
      
      // Réinitialiser React Hook Form
      setValue('workExperience', {
        hasWorkExperience: false,
        experiences: []
      }, { 
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false
      });

      // Forcer la réinitialisation du useFieldArray
      remove();
      
      console.log('handleRemoveExperience - Store et formulaire mis à jour');
    }
  }, [remove, fields.length, setValue, store, getValues]);

  const handleReset = useCallback(async () => {
    try {
      setValue('workExperience.hasWorkExperience', false, { 
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false
      });
      setValue('workExperience.experiences', [], { 
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false
      });
      setExpandedItems([]);
    } catch (error) {
      console.error('Erreur lors du reset:', error);
    }
  }, [setValue]);

  const validateForm = useCallback(async () => {
    if (!hasWorkExperience) return true;
    
    const result = await trigger(['workExperience.hasWorkExperience', 'workExperience.experiences']);
    
    if (!result && errors?.workExperience?.experiences) {
      const errorIndexes = Object.keys(errors.workExperience.experiences).map(Number);
      setExpandedItems(prev => [...new Set([...prev, ...errorIndexes])]);
    }
    
    return result;
  }, [hasWorkExperience, trigger, errors?.workExperience?.experiences]);

  const confirmNoExperience = useCallback(async () => {
    console.log('confirmNoExperience - Début', {
      currentExperiences: getValues('workExperience.experiences')
    });

    setValue('workExperience.hasWorkExperience', false, { 
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false
    });
    setValue('workExperience.experiences', [], { 
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false
    });
    setShowNoExpDialog(false);
    console.log('confirmNoExperience - Fin');
  }, [setValue, getValues]);

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">
            {t('experience.main.title')}
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={hasWorkExperience}
                onChange={handleExperienceToggle}
                color="primary"
              />
            }
            label={t('experience.main.hasExperience')}
          />
        </Box>

        {hasWorkExperience && errors?.workExperience && (
          <Alert severity="error">
            {errors.workExperience.message || t('experience.errors.checkFields')}
          </Alert>
        )}

        <AnimatePresence mode="wait">
          {hasWorkExperience && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Stack spacing={2}>
                {fields.map((field, index) => (
                  <Box key={field.id} sx={{ mb: 3, position: 'relative' }}>
                    <ExperienceCard
                      index={index}
                      onRemove={handleRemoveExperience}
                      errors={errors}
                      isExpanded={expandedItems.includes(index)}
                      onToggle={handleToggle}
                      defaultValues={field}
                    />
                  </Box>
                ))}

                {fields.length < 4 && (
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddExperience}
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 4 }}
                  >
                    {fields.length === 0
                      ? t('experience.actions.addFirst')
                      : t('experience.actions.add')}
                  </Button>
                )}

                {fields.length >= 4 && (
                  <Alert severity="info">
                    {t('experience.actions.maxLength')}
                  </Alert>
                )}
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>

        {!hasWorkExperience && (
          <Alert severity="info">
            {t('experience.main.noExperienceMessage')}
          </Alert>
        )}
      </Stack>

      <Dialog
        open={showNoExpDialog}
        onClose={() => setShowNoExpDialog(false)}
      >
        <DialogTitle>
          {t('experience.main.confirmNoExperienceTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('experience.main.confirmNoExperience')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNoExpDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={confirmNoExperience} color="primary">
            {t('common.confirm')}
          </Button>
        </DialogActions>
      </Dialog>

      <FormNavigation
        onValidate={validateForm}
        onReset={handleReset}
        showReset={hasWorkExperience}
      />
    </Box>
  );
};

export default WorkExperienceForm;