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
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Work as WorkIcon,
  Error as ErrorIcon,
  WorkHistory as WorkHistoryIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { useCVStore } from '@/app/store/cvStore';
import FormNavigationWrapper from '../FormNavigationWrapper';
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
        width: '100%',
        '& .MuiOutlinedInput-root': {
          transition: 'all 0.3s ease',
          '&:hover, &.Mui-focused': {
            backgroundColor: theme.palette.action.hover
          },
          ...(error && {
            '& fieldset': {
              borderColor: theme.palette.error.main
            }
          })
        },
        '& .MuiFormHelperText-root': {
          marginLeft: 0,
          marginRight: 0
        }
      }}
    />
  );
});

StyledTextField.displayName = 'StyledTextField';

const ExperienceCard = React.memo(({ 
  index,  
  errors, 
  isExpanded, 
  onToggle,
  onRemove,
}) => {
  const t = useTranslations('validation');
  const tForm = useTranslations('cvform');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { register, watch, setValue } = useFormContext();

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
        p: { xs: 2, sm: 3 }, 
        mb: 3, 
        position: 'relative',
        borderLeft: `4px solid ${
          hasFieldErrors ? theme.palette.error.main : theme.palette.primary.main
        }`,
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: 2,
        mb: 2 
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          width: { xs: '100%', sm: 'auto' }
        }}>
          <WorkIcon color="primary" />
          <Typography 
            variant="subtitle1" 
            color="primary"
            sx={{ 
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {companyName || position ? 
              `${companyName}${position ? ` - ${position}` : ''}` 
              : `${tForm('experience.main.title')} ${index + 1}`}
          </Typography>
        </Box>

        {hasFieldErrors && !isExpanded && (
          <Alert 
            severity="error" 
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              py: 0
            }}
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

        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          ml: { xs: 0, sm: 2 },
          alignSelf: { xs: 'flex-end', sm: 'center' }
        }}>
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
              label={tForm('experience.company.label')}
              placeholder={tForm('experience.company.placeholder')}
              error={!!errors?.workExperience?.experiences?.[index]?.companyName}
              helperText={errors?.workExperience?.experiences?.[index]?.companyName?.message}
            />
            <StyledTextField
              {...register(`workExperience.experiences.${index}.position`)}
              label={tForm('experience.position.label')}
              placeholder={tForm('experience.position.placeholder')}
              error={!!errors?.workExperience?.experiences?.[index]?.position}
              helperText={errors?.workExperience?.experiences?.[index]?.position?.message}
            />
          </Stack>

          <StyledTextField
            {...register(`workExperience.experiences.${index}.location`)}
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
                    placeholder: tForm('experience.dates.startDate.placeholder'),
                    size: isMobile ? 'small' : 'medium'
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
                    placeholder: tForm('experience.dates.endDate.placeholder'),
                    size: isMobile ? 'small' : 'medium'
                  }
                }}
              />
            </Box>
          </Stack>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: { xs: 'flex-start', sm: 'flex-end' },
            mt: { xs: 1, sm: 0 }
          }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isOngoing}
                  onChange={(e) => {
                    setValue(`workExperience.experiences.${index}.ongoing`, e.target.checked, {
                      shouldValidate: false
                    });
                  }}
                  size={isMobile ? 'small' : 'medium'}
                />
              }
              label={tForm('experience.dates.ongoing')}
              labelPlacement="start"
            />
          </Box>

          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="subtitle2" color="secondary" gutterBottom align="center">
              {tForm('experience.responsibilities.label')}
            </Typography>
            <Stack spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
              {(responsibilities || []).map((_, respIndex) => (
                <Box key={respIndex} sx={{ 
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 1,
                  width: '100%',
                  justifyContent: 'center'
                }}>
                  <StyledTextField
                    {...register(`workExperience.experiences.${index}.responsibilities.${respIndex}`)}
                    multiline
                    rows={2}
                    placeholder={tForm('experience.responsibilities.placeholder')}
                    error={!!errors?.workExperience?.experiences?.[index]?.responsibilities?.[respIndex]}
                    helperText={errors?.workExperience?.experiences?.[index]?.responsibilities?.[respIndex]?.message}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{ width: '100%' }}
                  />
                  <IconButton 
                    onClick={() => handleResponsibilityChange(respIndex, 'remove')}
                    aria-label={tForm('common.delete')}
                    sx={{ alignSelf: { xs: 'flex-end', sm: 'center' } }}
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
                  size={isMobile ? 'small' : 'medium'}
                  sx={{ borderRadius: 6 }}
                >
                  {tForm('experience.responsibilities.add')}
                </Button>
              )}
              {responsibilities?.length >= 5 && (
                <Alert severity="info" sx={{ mt: 2, width: '100%' }}>
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

const WorkExperienceForm = ({ hideFormNavigation }) => {
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const currentExperiences = getValues('workExperience.experiences');
    if (currentExperiences && currentExperiences.length > 0) {
      setValue('workExperience.hasWorkExperience', true, { 
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false
      });
    }
  }, [setValue, getValues]);

  const hasWorkExperience = watch('workExperience.hasWorkExperience', false);

  useEffect(() => {
    const formData = store.formData?.workExperience;
    const hasExistingExperiences = formData?.experiences?.length > 0;
    const shouldInitialize = hasExistingExperiences && 
                           fields.length === 0 && 
                           formData.hasWorkExperience;

    if (shouldInitialize) {
      setValue('workExperience.hasWorkExperience', true, { 
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false
      });

      formData.experiences.forEach(exp => {
        append(exp, { shouldFocus: false });
      });
    }
  }, [store.formData?.workExperience, fields.length, setValue, append]);

  useEffect(() => {
    const hasErrors = !!errors?.workExperience;
    const currentErrors = store.formErrors?.workExperience;
    
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
    if (fields.length < 4) {
      const currentExperiences = getValues('workExperience.experiences');
      if (fields.length === 0 && currentExperiences && currentExperiences.length > 0) {
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
      
      append(newExperience, { shouldFocus: false });
      setExpandedItems(prev => [...prev, fields.length]);

      if (fields.length === 0) {
        setValue('workExperience.hasWorkExperience', true, { 
          shouldValidate: false,
          shouldDirty: false,
          shouldTouch: false
        });
      }
    }
  }, [fields.length, append, setValue, getValues, store, remove]);

  const confirmExperienceChange = useCallback((newValue) => {
    setValue('workExperience.hasWorkExperience', newValue, { 
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false
    });
    
    if (!newValue) {
      store.setFormData({
        ...getValues(),
        workExperience: {
          hasWorkExperience: false,
          experiences: []
        }
      });
      remove(undefined, { shouldDirty: false });
    }
  }, [setValue, store, getValues, remove]);

  const handleExperienceToggle = useCallback((event) => {
    const newValue = event.target.checked;
    if (!newValue && fields.length > 0) {
      setShowNoExpDialog(true);
    } else {
      confirmExperienceChange(newValue);
    }
  }, [fields.length, confirmExperienceChange]);

  const handleRemoveExperience = useCallback((index) => {
    const isLastExperience = fields.length === 1;
    
    if (isLastExperience) {
      confirmExperienceChange(false);
    } else {
      remove(index);
      setExpandedItems(prev => 
        prev.filter(i => i !== index)
           .map(i => i > index ? i - 1 : i)
      );
      
      // Update store with current state after removal
      const currentExperiences = getValues('workExperience.experiences');
      store.setFormData({
        ...getValues(),
        workExperience: {
          hasWorkExperience: true,
          experiences: currentExperiences.filter((_, i) => i !== index)
        }
      });
    }
  }, [remove, fields.length, confirmExperienceChange, getValues, store]);

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
  }, [setValue]);

  return (
    <FormNavigationWrapper
      onValidate={validateForm}
      onReset={handleReset}
      showReset={true}
      hideFormNavigation={hideFormNavigation}
    >
      <Box sx={{ 
        width: '100%', 
        mb: 4,
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 4 }
      }}>
        <Stack spacing={3}>
        <Box sx={{ 
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 2, sm: 3 }
      }}>
        
          <WorkHistoryIcon 
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.125rem' },
              color: 'primary.main'
            }}
          />
            <Typography 
              variant="h5" 
              sx={{ 
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                fontWeight: 600,
                color: 'primary.main',
                textAlign: 'center'
              }}
            >
              {t('experience.main.title')}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                mt: 0.5,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              {t('experience.main.description')}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={hasWorkExperience}
                  onChange={handleExperienceToggle}
                  color="primary"
                  size={isMobile ? 'small' : 'medium'}
                />
              }
              label={t('experience.main.hasExperience')}
              sx={{ m: 0 }}
            />
          </Box>

          {hasWorkExperience && errors?.workExperience && (
            <Alert 
              severity="error"
              sx={{ 
                '& .MuiAlert-message': {
                  width: '100%'
                }
              }}
            >
              {errors.workExperience.message || t('experience.errors.checkFields')}
            </Alert>
          )}

          <AnimatePresence mode="wait">
            {hasWorkExperience && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Stack spacing={2}>
                  {fields.map((field, index) => (
                    <Box key={field.id} sx={{ position: 'relative' }}>
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
                      variant="contained"
                      fullWidth
                      size={isMobile ? 'small' : 'medium'}
                      sx={{ 
                        mb: 4,
                        p: 4,
                        height: { xs: 40, sm: 48 },
                        borderRadius: 6
                      }}
                    >
                      {fields.length === 0
                        ? t('experience.actions.addFirst')
                        : t('experience.actions.add')}
                    </Button>
                  )}

                  {fields.length >= 4 && (
                    <Alert 
                      severity="info"
                      sx={{ 
                        '& .MuiAlert-message': {
                          width: '100%'
                        }
                      }}
                    >
                      {t('experience.actions.maxLength')}
                    </Alert>
                  )}
                </Stack>
              </motion.div>
            )}
          </AnimatePresence>

          {!hasWorkExperience && (
            <Alert 
              severity="info"
              sx={{ 
                '& .MuiAlert-message': {
                  width: '100%'
                }
              }}
            >
              {t('experience.main.noExperienceMessage')}
            </Alert>
          )}
        </Stack>

        <Dialog
          open={showNoExpDialog}
          onClose={() => setShowNoExpDialog(false)}
          PaperProps={{
            sx: {
              width: { xs: '90%', sm: 'auto' },
              minWidth: { sm: 400 }
            }
          }}
        >
          <DialogTitle>
            {t('experience.main.confirmNoExperienceTitle')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('experience.main.confirmNoExperience')}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button 
              onClick={() => setShowNoExpDialog(false)}
              size={isMobile ? 'small' : 'medium'}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={confirmNoExperience} 
              color="primary"
              variant="contained"
              size={isMobile ? 'small' : 'medium'}
            >
              {t('common.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </FormNavigationWrapper>
  );
};

export default WorkExperienceForm;