'use client';

import { useState, useCallback, memo } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

interface EducationCardProps {
  index: number;
  remove: (index: number) => void;
  isExpanded: boolean;
  onToggle: (index: number) => void;
}

const EducationCard = memo(function EducationCard({ 
  index, 
  remove, 
  isExpanded, 
  onToggle 
}: EducationCardProps) {
  const t = useTranslations('cvform');
  const { register, watch, setValue, control, formState: { errors } } = useFormContext();

  const selectedDegree = watch(`educations.${index}.degree`);
  const isOtherDegree = selectedDegree === 'other';
  const schoolName = watch(`educations.${index}.schoolName`);
  const isOngoing = watch(`educations.${index}.ongoing`);
  const achievements = watch(`educations.${index}.achievements`) || [];

  const educationErrors = (errors?.educations as Record<string, unknown>)?.[index] as Record<string, { message?: string }> | undefined;
  const hasError = Boolean(educationErrors);

  const degreeOptions = [
    { value: 'baccalaureat', label: t('education.degree.options.baccalaureat') },
    { value: 'licence', label: t('education.degree.options.licence') },
    { value: 'bachelor', label: t('education.degree.options.bachelor') },
    { value: 'master', label: t('education.degree.options.master') },
    { value: 'doctorat', label: t('education.degree.options.doctorat') },
    { value: 'other', label: t('education.degree.options.other') }
  ];

  const handleOngoingChange = useCallback((checked: boolean) => {
    setValue(`educations.${index}.ongoing`, checked);
    if (checked) {
      setValue(`educations.${index}.endDate`, '');
    }
  }, [setValue, index]);

  return (
    <Card className={cn(
      "relative transition-shadow duration-200",
      "border-l-4",
      hasError ? "border-l-destructive" : "border-l-geds-blue",
      "hover:shadow-lg"
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-geds-blue" />
            <span className="font-medium text-geds-blue">
              {schoolName || t('education.main.title')} {index + 1}
            </span>
          </div>
          <div className="flex gap-2">
            {index > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
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
              {/* School name and Degree */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('education.school.label')}</Label>
                  <Input
                    {...register(`educations.${index}.schoolName`)}
                    placeholder={t('education.school.placeholder')}
                    className={cn(
                      "bg-gray-50",
                      educationErrors?.schoolName && "border-destructive"
                    )}
                  />
                  {educationErrors?.schoolName && (
                    <p className="text-sm text-destructive">{educationErrors.schoolName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{t('education.degree.label')}</Label>
                  <Select
                    value={selectedDegree || ''}
                    onValueChange={(value) => setValue(`educations.${index}.degree`, value)}
                  >
                    <SelectTrigger className={cn(
                      "bg-gray-50",
                      educationErrors?.degree && "border-destructive"
                    )}>
                      <SelectValue placeholder={t('education.degree.placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {degreeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {educationErrors?.degree && (
                    <p className="text-sm text-destructive">{educationErrors.degree.message}</p>
                  )}
                </div>
              </div>

              {/* Field of study */}
              <div className="space-y-2">
                <Label>{t('education.fieldOfStudy.label')}</Label>
                <Input
                  {...register(`educations.${index}.fieldOfStudy`)}
                  placeholder={t('education.fieldOfStudy.placeholder')}
                  className="bg-gray-50"
                />
              </div>

              {/* Custom degree if "other" selected */}
              {isOtherDegree && (
                <div className="space-y-2">
                  <Label>{t('education.customDegree.label')}</Label>
                  <Input
                    {...register(`educations.${index}.customDegree`)}
                    placeholder={t('education.customDegree.placeholder')}
                    className={cn(
                      "bg-gray-50",
                      educationErrors?.customDegree && "border-destructive"
                    )}
                  />
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('education.dates.startDate.label')}</Label>
                  <Controller
                    name={`educations.${index}.startDate`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/YYYY"
                        maxLength={7}
                        onChange={(e) => {
                          const formatted = formatMonthYearInput(e.target.value);
                          field.onChange(formatted);
                        }}
                        className={cn(
                          "bg-gray-50",
                          educationErrors?.startDate && "border-destructive"
                        )}
                      />
                    )}
                  />
                  {educationErrors?.startDate && (
                    <p className="text-sm text-destructive">{educationErrors.startDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{t('education.dates.endDate.label')}</Label>
                  <Controller
                    name={`educations.${index}.endDate`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/YYYY"
                        maxLength={7}
                        disabled={isOngoing}
                        onChange={(e) => {
                          const formatted = formatMonthYearInput(e.target.value);
                          field.onChange(formatted);
                        }}
                        className={cn(
                          "bg-gray-50",
                          !isOngoing && educationErrors?.endDate && "border-destructive"
                        )}
                      />
                    )}
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <Checkbox
                      id={`ongoing-${index}`}
                      checked={isOngoing}
                      onCheckedChange={handleOngoingChange}
                    />
                    <label 
                      htmlFor={`ongoing-${index}`}
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      {t('education.dates.ongoing')}
                    </label>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-3">
                <Label className="text-geds-blue">{t('education.achievements.label')}</Label>
                <div className="space-y-2">
                  {achievements.map((_: string, achievementIndex: number) => {
                    const achievementError = (educationErrors?.achievements as Record<string, { message?: string }>)?.[achievementIndex];
                    const isEmpty = !achievements[achievementIndex] || achievements[achievementIndex].trim() === '';
                    return (
                      <div key={achievementIndex} className="space-y-1">
                        <div className="flex gap-2">
                          <Input
                            {...register(`educations.${index}.achievements.${achievementIndex}`)}
                            placeholder={t('education.achievements.placeholder')}
                            className={cn(
                              "bg-gray-50 flex-1",
                              (achievementError || isEmpty) && "border-destructive"
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newAchievements = [...achievements];
                              newAchievements.splice(achievementIndex, 1);
                              setValue(`educations.${index}.achievements`, newAchievements);
                            }}
                            className="hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {achievementError && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {achievementError.message}
                          </p>
                        )}
                      </div>
                    );
                  })}
                  {achievements.length < 4 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setValue(`educations.${index}.achievements`, [...achievements, '']);
                      }}
                      className="rounded-full"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      {t('education.achievements.add')}
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

interface EducationFormProps {
  hideFormNavigation?: boolean;
}

export default function EducationForm({ hideFormNavigation }: EducationFormProps) {
  const { control, formState: { errors }, trigger, reset } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'educations'
  });
  const t = useTranslations('cvform');
  const [expandedItems, setExpandedItems] = useState<number[]>([0]);
  const cvStore = useCVStore();

  const handleAddEducation = useCallback(() => {
    if (fields.length < 4) {
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
      setExpandedItems(prev => [...prev, fields.length]);
    }
  }, [fields.length, append]);

  const handleRemove = useCallback((index: number) => {
    if (fields.length > 1) {
      remove(index);
      setExpandedItems(prev => 
        prev.filter(i => i !== index).map(i => i > index ? i - 1 : i)
      );
    }
  }, [fields.length, remove]);

  const handleToggle = useCallback((index: number) => {
    setExpandedItems(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return [...prev, index];
    });
  }, []);

  const validateForm = useCallback(async () => {
    const result = await trigger('educations', { shouldFocus: true });
    
    if (!result && errors?.educations) {
      const educationsErrors = errors.educations as Record<string, unknown>;
      const errorIndexes = Object.keys(educationsErrors)
        .filter(key => typeof educationsErrors[key] === 'object')
        .map(Number);
      
      if (errorIndexes.length > 0) {
        setExpandedItems(prev => [...new Set([...prev, ...errorIndexes])]);
      }
    }
    
    return result;
  }, [trigger, errors?.educations]);

  const handleReset = useCallback(async () => {
    await reset({
      educations: [{
        schoolName: '',
        degree: '',
        startDate: '',
        endDate: '',
        ongoing: false,
        achievements: [],
        customDegree: ''
      }]
    });
    setExpandedItems([0]);
    cvStore.clearFormErrors();
  }, [reset, cvStore]);

  return (
    <FormNavigationWrapper
      onValidate={validateForm}
      onReset={handleReset}
      showReset={true}
      hideFormNavigation={hideFormNavigation}
    >
      <div className="w-full flex flex-col items-center gap-3 sm:gap-4">
        {/* Header compact */}
        <div className="flex items-center gap-2 text-center justify-center">
          <GraduationCap className="w-5 h-5 text-geds-blue" />
          <span className="text-sm text-geds-blue hidden sm:inline">
             {t('education.main.description')}
          </span>
        </div>

        {/* Education cards */}
        <div className="w-full space-y-4">
          {fields.map((field, index) => (
            <EducationCard
              key={field.id}
              index={index}
              remove={handleRemove}
              isExpanded={expandedItems.includes(index)}
              onToggle={handleToggle}
            />
          ))}
        </div>

        {/* Add button */}
        <Button
          type="button"
          onClick={handleAddEducation}
          disabled={fields.length >= 4}
          className="btn-geds-primary rounded-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('education.actions.add')}
        </Button>
      </div>
    </FormNavigationWrapper>
  );
}

