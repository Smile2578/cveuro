'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useFormContext, Controller } from 'react-hook-form';
import { Info } from 'lucide-react';
import { nationalities } from '../utils/Nationalities';
import FormSection from '../shared/FormSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Fonction pour formater automatiquement la date DD/MM/YYYY
const formatDateInput = (value: string): string => {
  // Supprimer tout ce qui n'est pas un chiffre
  const digits = value.replace(/\D/g, '');
  
  // Limiter à 8 chiffres (DDMMYYYY)
  const limited = digits.slice(0, 8);
  
  // Formater avec les /
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 4) {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  } else {
    return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
  }
};

export default function InfoForm() {
  const t = useTranslations('cvform');
  const locale = useLocale();
  const { control, formState: { errors, touchedFields, isSubmitted } } = useFormContext();

  const genderOptions = [
    { value: 'male', label: t('personalInfo.info.gender.options.male') },
    { value: 'female', label: t('personalInfo.info.gender.options.female') },
    { value: 'other', label: t('personalInfo.info.gender.options.other') }
  ];

  const getFieldError = (fieldPath: string) => {
    const parts = fieldPath.split('.');
    let current: unknown = errors;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = (current as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }
    return (current as { message?: string })?.message;
  };

  const shouldShowError = (fieldPath: string) => {
    const parts = fieldPath.split('.');
    let hasError = errors;
    let isTouched = touchedFields;
    
    for (const part of parts) {
      hasError = hasError?.[part as keyof typeof hasError] as typeof hasError;
      isTouched = isTouched?.[part as keyof typeof isTouched] as typeof isTouched;
    }
    
    return Boolean(hasError) && (Boolean(isTouched) || isSubmitted);
  };

  const currentNationalities = nationalities[locale as keyof typeof nationalities] || nationalities.en;

  return (
    <FormSection
      icon={Info}
      title={t('personalInfo.info.title')}
      description={t('personalInfo.info.description')}
    >
      {/* Date of birth - avec formatage automatique */}
      <div className="space-y-2">
        <Label className="text-sm text-gray-600">
          {t('personalInfo.info.birthDate.label')}
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Controller
          name="personalInfo.dateofBirth"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <div>
              <Input
                {...field}
                type="text"
                inputMode="numeric"
                placeholder={locale === 'fr' ? 'JJ/MM/AAAA' : 'DD/MM/YYYY'}
                autoComplete="bday"
                maxLength={10}
                onChange={(e) => {
                  const formatted = formatDateInput(e.target.value);
                  field.onChange(formatted);
                }}
                className={cn(
                  "h-12 sm:h-14 text-base rounded-lg",
                  "bg-gray-50 border-gray-200",
                  "focus:bg-white focus:border-geds-blue focus:ring-geds-blue",
                  shouldShowError('personalInfo.dateofBirth') && "border-destructive"
                )}
              />
              <div className="min-h-[1.5rem] mt-1.5">
                {shouldShowError('personalInfo.dateofBirth') && (
                  <p className="text-sm text-destructive">
                    {getFieldError('personalInfo.dateofBirth')}
                  </p>
                )}
              </div>
            </div>
          )}
        />
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <Label className="text-sm text-gray-600">
          {t('personalInfo.info.gender.label')}
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Controller
          name="personalInfo.sex"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <div>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger 
                  className={cn(
                    "h-12 sm:h-14 text-base rounded-lg",
                    "bg-gray-50 border-gray-200",
                    "focus:bg-white focus:border-geds-blue focus:ring-geds-blue",
                    shouldShowError('personalInfo.sex') && "border-destructive"
                  )}
                >
                  <SelectValue placeholder={t('personalInfo.info.gender.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="min-h-[1.5rem] mt-1.5">
                {shouldShowError('personalInfo.sex') && (
                  <p className="text-sm text-destructive">
                    {getFieldError('personalInfo.sex')}
                  </p>
                )}
              </div>
            </div>
          )}
        />
      </div>

      {/* Nationality - Multi-select with chips */}
      <div className="space-y-2">
        <Label className="text-sm text-gray-600">
          {t('personalInfo.info.nationality.label')}
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Controller
          name="personalInfo.nationality"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <div>
              <Select
                onValueChange={(value) => {
                  const current = Array.isArray(field.value) ? field.value : [];
                  const nationality = currentNationalities.find(n => n.code === value);
                  if (nationality && !current.some((n: { code: string }) => n.code === value)) {
                    field.onChange([...current, nationality]);
                  }
                }}
              >
                <SelectTrigger 
                  className={cn(
                    "h-12 sm:h-14 text-base rounded-lg",
                    "bg-gray-50 border-gray-200",
                    "focus:bg-white focus:border-geds-blue focus:ring-geds-blue",
                    shouldShowError('personalInfo.nationality') && "border-destructive"
                  )}
                >
                  <SelectValue placeholder={t('personalInfo.info.nationality.placeholder')} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {currentNationalities.map((nationality) => (
                    nationality.separator ? (
                      <div key={nationality.code} className="px-2 py-1.5 text-xs text-muted-foreground select-none pointer-events-none">
                        {nationality.label}
                      </div>
                    ) : (
                      <SelectItem key={nationality.code} value={nationality.code}>
                        {nationality.label}
                      </SelectItem>
                    )
                  ))}
                </SelectContent>
              </Select>
              
              {/* Selected nationalities chips */}
              {Array.isArray(field.value) && field.value.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((nat: { code: string; label: string }) => (
                    <span 
                      key={nat.code}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-geds-blue/10 text-geds-blue rounded-full text-sm"
                    >
                      {nat.label}
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange(field.value.filter((n: { code: string }) => n.code !== nat.code));
                        }}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <div className="min-h-[1.5rem] mt-1.5">
                {shouldShowError('personalInfo.nationality') && (
                  <p className="text-sm text-destructive">
                    {getFieldError('personalInfo.nationality')}
                  </p>
                )}
              </div>
            </div>
          )}
        />
      </div>
    </FormSection>
  );
}

