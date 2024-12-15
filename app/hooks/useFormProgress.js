'use client';

import { useMemo } from 'react';
import { useCVStore } from '@/app/store/cvStore';

export const useFormProgress = () => {
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

  const stepInfo = useMemo(() => ({
    // Informations sur les étapes
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
    
    // Progression
    progress,
    
    // Actions de navigation
    goNext: store.navigateNext,
    goPrevious: store.navigatePrevious,
    
    // Helpers
    isMainStep: currentSubStep === null,
    isSubStep: currentSubStep !== null,
    
    // État du formulaire
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
    store.formErrors
  ]);

  return stepInfo;
};

export default useFormProgress; 