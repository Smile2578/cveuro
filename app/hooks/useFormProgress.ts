// app/hooks/useFormProgress.ts
'use client';

import { useMemo } from 'react';
import { useCVStore } from '@/app/store/cvStore';

export interface FormProgressInfo {
  // Step information
  currentStep: number;
  currentSubStep: number;
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
    store.navigatePrevious
  ]);

  return stepInfo;
};

export default useFormProgress;

