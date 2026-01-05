'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useCVStore } from '@/app/store/cvStore';
import FormNavigationWrapper from '../FormNavigationWrapper';
import { useFormProgress } from '@/app/hooks/useFormProgress';
import SkillsForm from './SkillsForm';
import HobbiesForm from './HobbiesForm';
import LanguagesForm from './LanguagesForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CombinedFormProps {
  onSubmit: () => Promise<void>;
}

export default function CombinedForm({ onSubmit }: CombinedFormProps) {
  const t = useTranslations('cvform');
  const tCommon = useTranslations('common');
  const store = useCVStore();
  const { currentSubStep: rawCurrentSubStep } = useFormProgress();
  const { 
    trigger, 
    getValues, 
    reset, 
    clearErrors,
    formState: { touchedFields } 
  } = useFormContext();
  const [openResetDialog, setOpenResetDialog] = useState(false);

  const currentSubStep = typeof rawCurrentSubStep === 'number' ? 
    Math.min(Math.max(0, rawCurrentSubStep), 2) : 0;

  const steps = [
    {
      label: t('steps.skills'),
      component: <SkillsForm />,
      validate: () => trigger('skills')
    },
    {
      label: t('steps.hobbies'),
      component: <HobbiesForm />,
      validate: () => trigger('hobbies')
    },
    {
      label: t('steps.languages'),
      component: <LanguagesForm />,
      validate: () => trigger('languages')
    }
  ];

  const handleReset = async () => {
    setOpenResetDialog(true);
  };

  const handleConfirmReset = async () => {
    try {
      const currentData = getValues();
      const newData = { ...currentData };
      
      switch (currentSubStep) {
        case 0:
          newData.skills = [];
          break;
        case 1:
          newData.hobbies = [];
          break;
        case 2:
          newData.languages = [];
          break;
      }
      
      store.setFormData(newData);
      reset(newData);
      
      setOpenResetDialog(false);
    } catch (error) {
      console.error('Error during reset:', error);
    }
  };

  const validateCurrentStep = async () => {
    const currentStep = steps[currentSubStep];
    if (!currentStep?.validate) return true;
    
    if (currentSubStep === 2) {
      const languages = getValues('languages') || [];

      if (languages.length === 0) {
        const errorMessage = t('languages.errors.required');
        store.setFormErrors({
          languages: errorMessage
        });
        trigger('languages');
        return false;
      }

      const touched = touchedFields as Record<string, unknown>;
      const hasBeenTouched = Object.keys((touched.languages as Record<string, unknown>) || {}).length > 0;
      if (!hasBeenTouched && languages.length > 0) {
        clearErrors('languages');
        return true;
      }
    }
    
    const result = await currentStep.validate();
    return result;
  };

  return (
    <FormNavigationWrapper
      onValidate={validateCurrentStep}
      onReset={handleReset}
      onSubmit={onSubmit}
      showReset={true}
    >
      <div className="w-full px-2 sm:px-4 rounded-xl bg-white">
        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                index === currentSubStep 
                  ? 'bg-geds-blue text-white' 
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {step.label}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSubStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {steps[currentSubStep].component}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Reset dialog */}
        <Dialog open={openResetDialog} onOpenChange={setOpenResetDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{tCommon('buttons.reset')}</DialogTitle>
              <DialogDescription>
                {tCommon('confirmations.reset')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenResetDialog(false)}>
                {tCommon('buttons.cancel')}
              </Button>
              <Button variant="destructive" onClick={handleConfirmReset}>
                {tCommon('buttons.reset')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </FormNavigationWrapper>
  );
}

