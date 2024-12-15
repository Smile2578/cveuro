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
        shouldValidate: true,
        shouldDirty: true 
      });
    }
  }, [isOngoing, setValue, index]);

  const hasFieldErrors = !!errors?.workExperience?.experiences?.[index];

  useEffect(() => {
    if (hasFieldErrors && !isExpanded) {
      onToggle(index);
    }
  }, [hasFieldErrors, isExpanded, onToggle]);

  const handleDateChange = useCallback(async (field, date) => {
    setValue(
      `workExperience.experiences.${index}.${field}`,
      formatDateForValidation(date),
      { shouldValidate: true }
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
      { shouldValidate: true }
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
                      shouldValidate: true
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
    formState: { errors }, 
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

  // Effet pour synchroniser les erreurs avec le store
  useEffect(() => {
    if (errors?.workExperience) {
      store.setFormErrors({
        ...store.formErrors,
        workExperience: errors.workExperience
      });
    } else {
      store.clearFormErrors();
    }
  }, [errors?.workExperience]);

  useEffect(() => {
    if (isSubmitted && hasWorkExperience) {
      trigger(['workExperience.hasWorkExperience', 'workExperience.experiences']);
    }
  }, [isSubmitted, trigger, hasWorkExperience]);

  useEffect(() => {
    if (errors?.workExperience?.experiences) {
      const errorIndexes = Object.keys(errors.workExperience.experiences).map(Number);
      if (errorIndexes.length > 0) {
        setExpandedItems(prev => [...new Set([...prev, ...errorIndexes])]);
      }
    }
  }, [errors?.workExperience?.experiences]);

  const handleToggle = useCallback((index) => {
    setExpandedItems(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return [...prev, index];
    });
  }, []);

  const handleAddExperience = useCallback(async () => {
    if (fields.length < 4) {
      append({
        companyName: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        ongoing: false,
        responsibilities: []
      });
      setExpandedItems(prev => [...prev, fields.length]);
    }
  }, [fields.length, append]);

  const handleExperienceToggle = useCallback(async (event) => {
    const newValue = event.target.checked;
    if (!newValue && fields.length > 0) {
      setShowNoExpDialog(true);
    } else {
      await setValue('workExperience.hasWorkExperience', newValue, { shouldValidate: true });
      if (newValue && fields.length === 0) {
        await handleAddExperience();
      } else {
        await trigger(['workExperience.hasWorkExperience', 'workExperience.experiences']);
      }
    }
  }, [fields.length, setValue, handleAddExperience, trigger]);

  const handleRemoveExperience = useCallback(async (index) => {
    remove(index);
    if (fields.length === 1) {
      await setValue('workExperience.hasWorkExperience', false, { shouldValidate: true });
      await setValue('workExperience.experiences', [], { shouldValidate: true });
    }
    await trigger(['workExperience.hasWorkExperience', 'workExperience.experiences']);
  }, [remove, fields.length, setValue, trigger]);

  const handleReset = async () => {
    try {
      await setValue('workExperience.hasWorkExperience', false, { shouldValidate: true });
      await setValue('workExperience.experiences', [], { shouldValidate: true });
      setExpandedItems([]);
    } catch (error) {
      console.error('Erreur lors du reset:', error);
    }
  };

  const validateForm = async () => {
    if (!hasWorkExperience) return true;
    
    // Valider tous les champs de toutes les expériences
    const result = await trigger(['workExperience.hasWorkExperience', 'workExperience.experiences']);
    return result;
  };

  const confirmNoExperience = useCallback(async () => {
    await setValue('workExperience.hasWorkExperience', false, { shouldValidate: true });
    await setValue('workExperience.experiences', [], { shouldValidate: true });
    setShowNoExpDialog(false);
    await trigger(['workExperience.hasWorkExperience', 'workExperience.experiences']);
  }, [setValue, trigger]);

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

        <AnimatePresence>
          {hasWorkExperience && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Stack spacing={2}>
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
                        {t('experience.errors.hasErrors')}
                      </Alert>
                    )}
                    <ExperienceCard
                      key={field.id}
                      index={index}
                      remove={handleRemoveExperience}
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