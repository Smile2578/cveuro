'use client';

import { useCallback, memo } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const PROFICIENCY_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native'];

const COMMON_LANGUAGES = [
  'english', 'french', 'spanish', 'german', 'italian',
  'portuguese', 'chinese', 'japanese', 'arabic', 'russian'
];

interface LanguageItemProps {
  index: number;
  onRemove: (index: number) => void;
}

const LanguageItem = memo(function LanguageItem({ index, onRemove }: LanguageItemProps) {
  const t = useTranslations('cvform');
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  
  const currentLevel = watch(`languages.${index}.proficiency`);
  const languageErrors = (errors?.languages as Record<string, Record<string, { message?: string }>>)?.[index];

  return (
    <Card className="p-4 border-l-4 border-l-geds-cyan hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <Label>{t('languages.language.label')}</Label>
          <Input
            {...register(`languages.${index}.language`)}
            placeholder={t('languages.language.placeholder')}
            className={cn("bg-gray-50", languageErrors?.language && "border-destructive")}
          />
          {languageErrors?.language && (
            <p className="text-sm text-destructive">{languageErrors.language.message}</p>
          )}
        </div>

        <div className="w-full sm:w-40 space-y-2">
          <Label>{t('languages.proficiency.label')}</Label>
          <Select
            value={currentLevel || 'B1'}
            onValueChange={(value) => setValue(`languages.${index}.proficiency`, value)}
          >
            <SelectTrigger className="bg-gray-50">
              <SelectValue placeholder={t('languages.proficiency.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              {PROFICIENCY_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {t(`languages.proficiency.options.${level}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          className="hover:text-destructive self-end sm:self-center"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Optional: Test name and score */}
      <div className="mt-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <Label className="text-sm text-gray-500">{t('languages.test.name.label')}</Label>
          <Input
            {...register(`languages.${index}.testName`)}
            placeholder={t('languages.test.name.placeholder')}
            className="bg-gray-50"
          />
        </div>
        <div className="w-full sm:w-32 space-y-2">
          <Label className="text-sm text-gray-500">{t('languages.test.score.label')}</Label>
          <Input
            {...register(`languages.${index}.testScore`)}
            placeholder={t('languages.test.score.placeholder')}
            className="bg-gray-50"
          />
        </div>
      </div>
    </Card>
  );
});

export default function LanguagesForm() {
  const t = useTranslations('cvform');
  const { control, getValues, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'languages'
  });

  const languagesError = (errors?.languages as { message?: string } | undefined)?.message;

  const handleAddLanguage = useCallback(() => {
    if (fields.length < 6) {
      append({ language: '', proficiency: 'B1', testName: '', testScore: '' });
    }
  }, [fields.length, append]);

  const handleRemoveLanguage = useCallback((index: number) => {
    remove(index);
  }, [remove]);

  const handleAddSuggestion = useCallback((langKey: string) => {
    const currentLanguages = getValues('languages') || [];
    const langName = t(`languages.suggestions.items.${langKey}`);
    const exists = currentLanguages.some((l: { language: string }) => l.language === langName);
    
    if (!exists && currentLanguages.length < 6) {
      append({ language: langName, proficiency: 'B2', testName: '', testScore: '' });
    }
  }, [t, getValues, append]);

  return (
    <div className="space-y-4">
      {/* Error alert */}
      {languagesError && (
        <Alert variant="destructive">
          <AlertDescription>{languagesError}</AlertDescription>
        </Alert>
      )}

      {/* Suggestions */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">{t('languages.suggestions.title')}</p>
        <div className="flex flex-wrap gap-2">
          {COMMON_LANGUAGES.map((lang) => (
            <Badge
              key={lang}
              variant="outline"
              className="cursor-pointer hover:bg-geds-cyan/10 transition-colors border-geds-cyan/30"
              onClick={() => handleAddSuggestion(lang)}
            >
              + {t(`languages.suggestions.items.${lang}`)}
            </Badge>
          ))}
        </div>
      </div>

      {/* Languages list */}
      <div className="space-y-3">
        <AnimatePresence>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <LanguageItem index={index} onRemove={handleRemoveLanguage} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add button */}
      {fields.length < 6 ? (
        <Button
          type="button"
          variant="outline"
          onClick={handleAddLanguage}
          className="w-full rounded-full border-geds-cyan/30 text-geds-cyan hover:bg-geds-cyan/10"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('languages.actions.add')}
        </Button>
      ) : (
        <Alert>
          <AlertDescription>{t('languages.actions.maxLength')}</AlertDescription>
        </Alert>
      )}

      {/* Required notice */}
      {fields.length === 0 && (
        <Alert>
          <AlertDescription>{t('languages.errors.required')}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

