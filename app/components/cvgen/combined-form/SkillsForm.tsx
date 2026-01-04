'use client';

import { useCallback, memo } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Wrench } from 'lucide-react';
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

const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];

const STUDENT_SKILLS = [
  'office', 'communication', 'teamwork', 'timeManagement', 'research',
  'presentation', 'analysis', 'writing', 'programming', 'socialMedia',
  'adaptability', 'problemSolving', 'organization', 'leadership', 'creativity'
];

interface SkillItemProps {
  index: number;
  onRemove: (index: number) => void;
}

const SkillItem = memo(function SkillItem({ index, onRemove }: SkillItemProps) {
  const t = useTranslations('cvform');
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  
  const currentLevel = watch(`skills.${index}.level`);
  const skillErrors = (errors?.skills as Record<string, Record<string, { message?: string }>>)?.[index];

  return (
    <Card className="p-4 border-l-4 border-l-geds-blue hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 space-y-2 w-full">
          <Label>{t('skills.name.label')}</Label>
          <Input
            {...register(`skills.${index}.skillName`)}
            placeholder={t('skills.name.placeholder')}
            className={cn("bg-gray-50", skillErrors?.skillName && "border-destructive")}
          />
          {skillErrors?.skillName && (
            <p className="text-sm text-destructive">{skillErrors.skillName.message}</p>
          )}
        </div>

        <div className="w-full sm:w-48 space-y-2">
          <Label>{t('skills.level.label')}</Label>
          <Select
            value={currentLevel || 'intermediate'}
            onValueChange={(value) => setValue(`skills.${index}.level`, value)}
          >
            <SelectTrigger className="bg-gray-50">
              <SelectValue placeholder={t('skills.level.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              {SKILL_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {t(`skills.level.options.${level}`)}
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
    </Card>
  );
});

export default function SkillsForm() {
  const t = useTranslations('cvform');
  const { control, formState: { errors }, setValue, getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills'
  });

  const handleAddSkill = useCallback(() => {
    if (fields.length < 10) {
      append({ skillName: '', level: 'intermediate' });
    }
  }, [fields.length, append]);

  const handleRemoveSkill = useCallback((index: number) => {
    remove(index);
  }, [remove]);

  const handleAddSuggestion = useCallback((skillKey: string) => {
    const currentSkills = getValues('skills') || [];
    const skillName = t(`skills.suggestions.items.${skillKey}`);
    const exists = currentSkills.some((s: { skillName: string }) => s.skillName === skillName);
    
    if (!exists && currentSkills.length < 10) {
      append({ skillName, level: 'intermediate' });
    }
  }, [t, getValues, append]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <Wrench className="w-10 h-10 text-geds-blue mx-auto mb-2" />
        <h3 className="text-xl font-semibold text-geds-blue">{t('skills.main.title')}</h3>
        <p className="text-sm text-gray-600 mt-1">{t('skills.main.description')}</p>
      </div>

      {/* Suggestions */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">{t('skills.suggestions.title')}</p>
        <div className="flex flex-wrap gap-2">
          {STUDENT_SKILLS.slice(0, 8).map((skill) => (
            <Badge
              key={skill}
              variant="outline"
              className="cursor-pointer hover:bg-geds-blue/10 transition-colors"
              onClick={() => handleAddSuggestion(skill)}
            >
              + {t(`skills.suggestions.items.${skill}`)}
            </Badge>
          ))}
        </div>
      </div>

      {/* Skills list */}
      <div className="space-y-3">
        <AnimatePresence>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SkillItem index={index} onRemove={handleRemoveSkill} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add button */}
      {fields.length < 10 ? (
        <Button
          type="button"
          variant="outline"
          onClick={handleAddSkill}
          className="w-full rounded-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('skills.actions.add')}
        </Button>
      ) : (
        <Alert>
          <AlertDescription>{t('skills.actions.maxLength')}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

