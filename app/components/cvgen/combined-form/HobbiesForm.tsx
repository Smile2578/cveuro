'use client';

import { useCallback, memo } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

const COMMON_HOBBIES = [
  'reading', 'sports', 'music', 'travel', 'photography',
  'cooking', 'gardening', 'volunteering', 'arts', 'theater'
];

interface HobbyItemProps {
  index: number;
  onRemove: (index: number) => void;
}

const HobbyItem = memo(function HobbyItem({ index, onRemove }: HobbyItemProps) {
  const t = useTranslations('cvform');
  const { register, formState: { errors } } = useFormContext();
  
  const hobbiesErrors = errors?.hobbies as Record<string, { message?: string }> | undefined;
  const hobbyError = hobbiesErrors?.[index];

  return (
    <Card className="p-4 border-l-4 border-l-geds-green hover:shadow-md transition-shadow">
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            {...register(`hobbies.${index}`)}
            placeholder={t('hobbies.hobby.placeholder')}
            className={cn("bg-gray-50", hobbyError && "border-destructive")}
          />
          {hobbyError && (
            <p className="text-sm text-destructive mt-1">{hobbyError.message}</p>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          className="hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
});

export default function HobbiesForm() {
  const t = useTranslations('cvform');
  const { control, getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'hobbies'
  });

  const handleAddHobby = useCallback(() => {
    if (fields.length < 8) {
      append('');
    }
  }, [fields.length, append]);

  const handleRemoveHobby = useCallback((index: number) => {
    remove(index);
  }, [remove]);

  const handleAddSuggestion = useCallback((hobbyKey: string) => {
    const currentHobbies = getValues('hobbies') || [];
    const hobbyName = t(`hobbies.suggestions.items.${hobbyKey}`);
    const exists = currentHobbies.includes(hobbyName);
    
    if (!exists && currentHobbies.length < 8) {
      append(hobbyName);
    }
  }, [t, getValues, append]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <Gamepad2 className="w-10 h-10 text-geds-green mx-auto mb-2" />
        <h3 className="text-xl font-semibold text-geds-green">{t('hobbies.main.title')}</h3>
        <p className="text-sm text-gray-600 mt-1">{t('hobbies.main.description')}</p>
      </div>

      {/* Suggestions */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">{t('hobbies.suggestions.title')}</p>
        <div className="flex flex-wrap gap-2">
          {COMMON_HOBBIES.map((hobby) => (
            <Badge
              key={hobby}
              variant="outline"
              className="cursor-pointer hover:bg-geds-green/10 transition-colors border-geds-green/30"
              onClick={() => handleAddSuggestion(hobby)}
            >
              + {t(`hobbies.suggestions.items.${hobby}`)}
            </Badge>
          ))}
        </div>
      </div>

      {/* Hobbies list */}
      <div className="space-y-3">
        <AnimatePresence>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <HobbyItem index={index} onRemove={handleRemoveHobby} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add button */}
      {fields.length < 8 ? (
        <Button
          type="button"
          variant="outline"
          onClick={handleAddHobby}
          className="w-full rounded-full border-geds-green/30 text-geds-green hover:bg-geds-green/10"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('hobbies.actions.add')}
        </Button>
      ) : (
        <Alert>
          <AlertDescription>{t('hobbies.actions.maxLength')}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

