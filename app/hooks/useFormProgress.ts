// app/hooks/useFormProgress.ts
'use client';

import { useMemo, useCallback } from 'react';
import { useCVStore } from '@/app/store/cvStore';

export interface FormProgressInfo {
  // Step information
  currentStep: number;
  currentSubStep: number | null;
  totalSteps: number;
  totalSubSteps: number;
  isLastStep: boolean;
  isLastSubStep: boolean;
  hasSubSteps: boolean;
  
  // Navigation
  canGoNext: boolean;
  canGoPrevious: boolean;
  
  // Progress
  progress: number;
  
  // Navigation actions
  goNext: () => void;
  goPrevious: () => void;
  goToStep: (step: number) => void;
  
  // Helpers
  isMainStep: boolean;
  isSubStep: boolean;
  
  // Form state
  isSubmitting: boolean;
  formErrors: Record<string, unknown> | null;
}

export const useFormProgress = (): FormProgressInfo => {
  const store = useCVStore();
  
  const {
    currentStep,
    currentSubStep,
    totalSteps,
    totalSubSteps,
    isLastStep,
    isLastSubStep
  } = store.getStepInfo();

  const progress = store.getProgress();
  const canGoNext = store.canNavigateNext();
  const canGoPrevious = store.canNavigatePrevious();

  // Direct navigation to a specific step
  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      store.setActiveStep(step);
      // Reset sub-steps when jumping to a new main step
      if (step === 0) {
        store.setPersonalInfoStep(0);
      } else if (step === 3) {
        store.setCombinedFormStep(0);
      }
    }
  }, [store, totalSteps]);

  const stepInfo = useMemo<FormProgressInfo>(() => ({
    // Step information
    currentStep,
    currentSubStep,
    totalSteps,
    totalSubSteps,
    isLastStep,
    isLastSubStep,
    hasSubSteps: totalSubSteps > 0,
    
    // Navigation
    canGoNext,
    canGoPrevious,
    
    // Progress
    progress,
    
    // Navigation actions
    goNext: store.navigateNext,
    goPrevious: store.navigatePrevious,
    goToStep,
    
    // Helpers
    isMainStep: currentSubStep === null || currentSubStep === 0,
    isSubStep: currentSubStep !== null && currentSubStep > 0,
    
    // Form state
    isSubmitting: store.isSubmitting,
    formErrors: store.formErrors
  }), [
    currentStep,
    currentSubStep,
    totalSteps,
    totalSubSteps,
    isLastStep,
    isLastSubStep,
    canGoNext,
    canGoPrevious,
    progress,
    store.isSubmitting,
    store.formErrors,
    store.navigateNext,
    store.navigatePrevious,
    goToStep
  ]);

  return stepInfo;
};

export default useFormProgress;

