'use client';

import React, { useState, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { AlertTriangle } from 'lucide-react';
import { useCVStore } from '@/app/store/cvStore';
import FormNavigationWrapper from '../FormNavigationWrapper';
import { useFormProgress } from '@/app/hooks/useFormProgress';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Step fields definition
const STEP_FIELDS: Record<number, string[]> = {
  0: ['firstname', 'lastname'],
  1: ['email', 'phoneNumber'],
  2: ['dateofBirth', 'nationality', 'sex'],
  3: ['address', 'city', 'zip'],
  4: ['linkedIn', 'personalWebsite']
};

interface PersonalInfoStepperProps {
  children: ReactNode;
}

export default function PersonalInfoStepper({ children }: PersonalInfoStepperProps) {
  const tCvform = useTranslations('cvform');
  const tCommon = useTranslations('common');
  const store = useCVStore();
  const steps = React.Children.toArray(children);
  const { trigger, formState: { errors }, reset } = useFormContext();
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const { currentSubStep } = useFormProgress();
  const [, setValidationAttempted] = useState(false);

  const validateCurrentStep = async () => {
    const currentStepFields = STEP_FIELDS[currentSubStep] || [];
    
    if (!Array.isArray(currentStepFields)) {
      console.error('Invalid step fields format:', currentStepFields);
      return false;
    }

    setValidationAttempted(true);
    const fieldsToValidate = currentStepFields.map(field => `personalInfo.${field}`);
    const result = await trigger(fieldsToValidate, { shouldFocus: true });
    
    if (!result) {
      store.setFormErrors({
        ...store.formErrors,
        personalInfo: errors?.personalInfo
      });
    }
    
    return result;
  };

  const handleReset = async () => {
    setOpenResetDialog(true);
  };

  const handleConfirmReset = async () => {
    try {
      reset({
        personalInfo: {
          firstname: '',
          lastname: '',
          email: '',
          phoneNumber: '',
          dateofBirth: '',
          nationality: [],
          sex: '',
          address: '',
          city: '',
          zip: '',
          linkedIn: '',
          personalWebsite: ''
        }
      });
      store.resetForm();
      setOpenResetDialog(false);
      setValidationAttempted(false);
    } catch (error) {
      console.error('Error during reset:', error);
    }
  };

  return (
    <FormNavigationWrapper
      onValidate={validateCurrentStep}
      onReset={handleReset}
      showReset={true}
    >
      <div className="w-full">
        {/* Stepper dots - mobile style */}
        <div className="flex justify-center gap-2 mb-4 sm:hidden">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === currentSubStep ? "bg-geds-blue" : "bg-gray-200"
              )}
            />
          ))}
        </div>

        {/* Stepper labels - desktop */}
        <div className="hidden sm:flex justify-between mb-6">
          {steps.map((_, index) => (
            <div key={index} className="flex-1 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  index === currentSubStep 
                    ? "bg-geds-blue text-white" 
                    : index < currentSubStep 
                      ? "bg-geds-green text-white"
                      : "bg-gray-100 text-gray-400"
                )}>
                  {index + 1}
                </div>
              </div>
              <span className={cn(
                "text-xs font-medium",
                index === currentSubStep ? "text-geds-blue" : "text-gray-500"
              )}>
                {tCvform(`personalInfo.subSteps.${index}.label`)}
              </span>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="mt-4 sm:mt-6">
          <div className="p-4 sm:p-6 rounded-xl bg-gray-50">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSubStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {steps[currentSubStep]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Reset confirmation dialog */}
        <Dialog open={openResetDialog} onOpenChange={setOpenResetDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                {tCommon('buttons.reset')}
              </DialogTitle>
              <DialogDescription>
                {tCommon('confirmations.reset')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                variant="outline" 
                onClick={() => setOpenResetDialog(false)}
              >
                {tCommon('buttons.cancel')}
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleConfirmReset}
              >
                {tCommon('buttons.reset')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </FormNavigationWrapper>
  );
}

