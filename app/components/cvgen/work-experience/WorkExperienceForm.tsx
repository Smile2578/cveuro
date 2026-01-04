'use client';

import { useState, useCallback, memo } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCVStore } from '@/app/store/cvStore';
import FormNavigationWrapper from '../FormNavigationWrapper';
import { cn } from '@/lib/utils';

// Fonction pour formater automatiquement la date MM/YYYY
const formatMonthYearInput = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  const limited = digits.slice(0, 6);
  
  if (limited.length <= 2) {
    return limited;
  } else {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  }
};

interface ExperienceCardProps {
  index: number;
  onRemove: (index: number) => void;
  isExpanded: boolean;
  onToggle: (index: number) => void;
}

const ExperienceCard = memo(function ExperienceCard({ 
  index, 
  onRemove, 
  isExpanded, 
  onToggle 
}: ExperienceCardProps) {
  const tForm = useTranslations('cvform');
  const { register, watch, setValue, control, formState: { errors } } = useFormContext();

  const companyName = watch(`workExperience.experiences.${index}.companyName`);
  const position = watch(`workExperience.experiences.${index}.position`);
  const isOngoing = watch(`workExperience.experiences.${index}.ongoing`);
  const responsibilities = watch(`workExperience.experiences.${index}.responsibilities`) || [];

  const experienceErrors = (errors?.workExperience as Record<string, unknown>)?.experiences as Record<string, Record<string, { message?: string }>> | undefined;
  const fieldErrors = experienceErrors?.[index];
  const hasError = Boolean(fieldErrors);

  const handleOngoingChange = useCallback((checked: boolean) => {
    setValue(`workExperience.experiences.${index}.ongoing`, checked);
    if (checked) {
      setValue(`workExperience.experiences.${index}.endDate`, '');
    }
  }, [setValue, index]);

  const handleResponsibilityChange = useCallback((respIndex: number | null, action: 'add' | 'remove') => {
    const currentResponsibilities = responsibilities || [];
    let newResponsibilities;

    if (action === 'add') {
      newResponsibilities = [...currentResponsibilities, ''];
    } else {
      newResponsibilities = currentResponsibilities.filter((_: string, idx: number) => idx !== respIndex);
    }

    setValue(`workExperience.experiences.${index}.responsibilities`, newResponsibilities);
  }, [responsibilities, setValue, index]);

  return (
    <Card className={cn(
      "relative transition-shadow duration-200",
      "border-l-4",
      hasError ? "border-l-destructive" : "border-l-geds-blue",
      "hover:shadow-lg"
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-geds-blue" />
            <span className="font-medium text-geds-blue truncate">
              {companyName || position 
                ? `${companyName}${position ? ` - ${position}` : ''}`
                : `${tForm('experience.main.title')} ${index + 1}`}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
              className="hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onToggle(index)}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="space-y-4 pt-2">
              {/* Company and Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{tForm('experience.company.label')}</Label>
                  <Input
                    {...register(`workExperience.experiences.${index}.companyName`)}
                    placeholder={tForm('experience.company.placeholder')}
                    className={cn("bg-gray-50", fieldErrors?.companyName && "border-destructive")}
                  />
                  {fieldErrors?.companyName && (
                    <p className="text-sm text-destructive">{fieldErrors.companyName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{tForm('experience.position.label')}</Label>
                  <Input
                    {...register(`workExperience.experiences.${index}.position`)}
                    placeholder={tForm('experience.position.placeholder')}
                    className={cn("bg-gray-50", fieldErrors?.position && "border-destructive")}
                  />
                  {fieldErrors?.position && (
                    <p className="text-sm text-destructive">{fieldErrors.position.message}</p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>{tForm('experience.location.label')}</Label>
                <Input
                  {...register(`workExperience.experiences.${index}.location`)}
                  placeholder={tForm('experience.location.placeholder')}
                  className="bg-gray-50"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{tForm('experience.dates.startDate.label')}</Label>
                  <Controller
                    name={`workExperience.experiences.${index}.startDate`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/YYYY"
                        maxLength={7}
                        onChange={(e) => {
                          const formatted = formatMonthYearInput(e.target.value);
                          field.onChange(formatted);
                        }}
                        className={cn("bg-gray-50", fieldErrors?.startDate && "border-destructive")}
                      />
                    )}
                  />
                  {fieldErrors?.startDate && (
                    <p className="text-sm text-destructive">{fieldErrors.startDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{tForm('experience.dates.endDate.label')}</Label>
                  <Controller
                    name={`workExperience.experiences.${index}.endDate`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/YYYY"
                        maxLength={7}
                        disabled={isOngoing}
                        onChange={(e) => {
                          const formatted = formatMonthYearInput(e.target.value);
                          field.onChange(formatted);
                        }}
                        className={cn("bg-gray-50", !isOngoing && fieldErrors?.endDate && "border-destructive")}
                      />
                    )}
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <Checkbox
                      id={`exp-ongoing-${index}`}
                      checked={isOngoing}
                      onCheckedChange={handleOngoingChange}
                    />
                    <label 
                      htmlFor={`exp-ongoing-${index}`}
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      {tForm('experience.dates.ongoing')}
                    </label>
                  </div>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="space-y-3">
                <Label className="text-geds-blue">{tForm('experience.responsibilities.label')}</Label>
                <div className="space-y-2">
                  {responsibilities.map((_: string, respIndex: number) => (
                    <div key={respIndex} className="flex gap-2">
                      <Input
                        {...register(`workExperience.experiences.${index}.responsibilities.${respIndex}`)}
                        placeholder={tForm('experience.responsibilities.placeholder')}
                        className="bg-gray-50 flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleResponsibilityChange(respIndex, 'remove')}
                        className="hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {responsibilities.length < 5 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleResponsibilityChange(null, 'add')}
                      className="rounded-full"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      {tForm('experience.responsibilities.add')}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
});

interface WorkExperienceFormProps {
  hideFormNavigation?: boolean;
}

export default function WorkExperienceForm({ hideFormNavigation }: WorkExperienceFormProps) {
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
    name: 'workExperience.experiences'
  });
  
  const t = useTranslations('cvform');
  const store = useCVStore();
  const [expandedItems, setExpandedItems] = useState<number[]>([0]);
  const [showNoExpDialog, setShowNoExpDialog] = useState(false);

  const hasWorkExperience = watch('workExperience.hasWorkExperience', false);

  const handleToggle = useCallback((index: number) => {
    setExpandedItems(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return [...prev, index];
    });
  }, []);

  const handleAddExperience = useCallback(() => {
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

      if (fields.length === 0) {
        setValue('workExperience.hasWorkExperience', true);
      }
    }
  }, [fields.length, append, setValue]);

  const confirmExperienceChange = useCallback((newValue: boolean) => {
    setValue('workExperience.hasWorkExperience', newValue);
    
    if (!newValue) {
      store.setFormData({
        ...getValues(),
        workExperience: {
          hasWorkExperience: false,
          experiences: []
        }
      });
      remove();
    }
  }, [setValue, store, getValues, remove]);

  const handleExperienceToggle = useCallback((checked: boolean) => {
    if (!checked && fields.length > 0) {
      setShowNoExpDialog(true);
    } else {
      confirmExperienceChange(checked);
    }
  }, [fields.length, confirmExperienceChange]);

  const handleRemoveExperience = useCallback((index: number) => {
    if (fields.length === 1) {
      confirmExperienceChange(false);
    } else {
      remove(index);
      setExpandedItems(prev => 
        prev.filter(i => i !== index).map(i => i > index ? i - 1 : i)
      );
    }
  }, [remove, fields.length, confirmExperienceChange]);

  const handleReset = useCallback(async () => {
    setValue('workExperience.hasWorkExperience', false);
    setValue('workExperience.experiences', []);
    setExpandedItems([]);
  }, [setValue]);

  const validateForm = useCallback(async () => {
    if (!hasWorkExperience) return true;
    
    const result = await trigger(['workExperience.hasWorkExperience', 'workExperience.experiences']);
    
    if (!result) {
      const workExpErrors = errors?.workExperience as Record<string, unknown> | undefined;
      const expErrors = workExpErrors?.experiences as Record<string, unknown> | undefined;
      if (expErrors) {
        const errorIndexes = Object.keys(expErrors).map(Number);
        setExpandedItems(prev => [...new Set([...prev, ...errorIndexes])]);
      }
    }
    
    return result;
  }, [hasWorkExperience, trigger, errors?.workExperience]);

  const confirmNoExperience = useCallback(() => {
    setValue('workExperience.hasWorkExperience', false);
    setValue('workExperience.experiences', []);
    setShowNoExpDialog(false);
  }, [setValue]);

  return (
    <FormNavigationWrapper
      onValidate={validateForm}
      onReset={handleReset}
      showReset={true}
      hideFormNavigation={hideFormNavigation}
    >
      <div className="w-full px-4 sm:px-6 py-4 sm:py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <Briefcase className="w-10 h-10 text-geds-blue mx-auto" />
            <h2 className="text-xl sm:text-2xl font-semibold text-geds-blue">
              {t('experience.main.title')}
            </h2>
            <p className="text-sm text-gray-600">
              {t('experience.main.description')}
            </p>
            
            {/* Toggle switch */}
            <div className="flex items-center justify-center gap-3">
              <Label htmlFor="has-experience" className="cursor-pointer">
                {t('experience.main.hasExperience')}
              </Label>
              <Switch
                id="has-experience"
                checked={hasWorkExperience}
                onCheckedChange={handleExperienceToggle}
              />
            </div>
          </div>

          {/* Experience cards */}
          <AnimatePresence mode="wait">
            {hasWorkExperience && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {fields.map((field, index) => (
                  <ExperienceCard
                    key={field.id}
                    index={index}
                    onRemove={handleRemoveExperience}
                    isExpanded={expandedItems.includes(index)}
                    onToggle={handleToggle}
                  />
                ))}

                {fields.length < 4 && (
                  <Button
                    type="button"
                    onClick={handleAddExperience}
                    className="w-full btn-geds-primary rounded-full h-12"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {fields.length === 0
                      ? t('experience.actions.addFirst')
                      : t('experience.actions.add')}
                  </Button>
                )}

                {fields.length >= 4 && (
                  <Alert>
                    <AlertDescription>{t('experience.actions.maxLength')}</AlertDescription>
                  </Alert>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!hasWorkExperience && (
            <Alert>
              <AlertDescription>{t('experience.main.noExperienceMessage')}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Confirm no experience dialog */}
        <Dialog open={showNoExpDialog} onOpenChange={setShowNoExpDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('experience.main.confirmNoExperienceTitle')}</DialogTitle>
              <DialogDescription>
                {t('experience.main.confirmNoExperience')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNoExpDialog(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={confirmNoExperience}>
                {t('common.confirm')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </FormNavigationWrapper>
  );
}

