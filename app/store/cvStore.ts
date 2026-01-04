// app/store/cvStore.ts
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  CVFormData, 
  PersonalInfo, 
  Education, 
  WorkExperienceForm,
  Skill,
  Language,
  CVTemplate
} from '@/types/cv.types';

// ============================================================================
// CONSTANTS
// ============================================================================

const TOTAL_STEPS = 4;
const PERSONAL_INFO_SUBSTEPS = 5;
const COMBINED_FORM_SUBSTEPS = 3;

// ============================================================================
// TYPES
// ============================================================================

interface StepInfo {
  currentStep: number;
  currentSubStep: number | null;
  totalSteps: number;
  totalSubSteps: number;
  isLastStep: boolean;
  isLastSubStep: boolean;
}

interface CVStoreState {
  // Form state
  formData: CVFormData;
  activeStep: number;
  personalInfoStep: number;
  combinedFormStep: number;
  isFormDirty: boolean;
  lastSaved: string | null;
  isEditing: boolean;
  isSubmitting: boolean;
  userId: string | null;
  cvId: string | null;
  template: CVTemplate;
  formErrors: Record<string, string>;

  // Actions
  setFormData: (data: Partial<CVFormData>) => void;
  updateFormField: <K extends keyof CVFormData>(field: K, value: CVFormData[K]) => void;
  setActiveStep: (step: number) => void;
  setPersonalInfoStep: (step: number) => void;
  setCombinedFormStep: (step: number) => void;
  setIsEditing: (isEditing: boolean) => void;
  setUserId: (userId: string | null) => void;
  setCvId: (cvId: string | null) => void;
  setTemplate: (template: CVTemplate) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setFormErrors: (errors: Record<string, string>) => void;
  clearFormErrors: () => void;
  resetForm: () => void;

  // Navigation
  canNavigateNext: () => boolean;
  canNavigatePrevious: () => boolean;
  navigateNext: () => void;
  navigatePrevious: () => void;

  // Getters
  getStepInfo: () => StepInfo;
  getProgress: () => number;
}

// ============================================================================
// DEFAULT DATA
// ============================================================================

const defaultPersonalInfo: PersonalInfo = {
  firstname: '',
  lastname: '',
  email: '',
  phoneNumber: '',
  address: '',
  city: '',
  zip: '',
  nationality: [],
  dateofBirth: '',
  sex: '',
  linkedIn: '',
  personalWebsite: ''
};

const defaultFormData: CVFormData = {
  personalInfo: defaultPersonalInfo,
  educations: [],
  workExperience: {
    hasWorkExperience: false,
    experiences: []
  },
  skills: [],
  languages: [],
  hobbies: []
};

// ============================================================================
// STORAGE
// ============================================================================

const getCustomStorage = () => {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    };
  }
  
  return {
    getItem: (name: string) => {
      try {
        return localStorage.getItem(name);
      } catch {
        return null;
      }
    },
    setItem: (name: string, value: string) => {
      try {
        localStorage.setItem(name, value);
      } catch {
        // Storage full or blocked
      }
    },
    removeItem: (name: string) => {
      try {
        localStorage.removeItem(name);
      } catch {
        // Ignore
      }
    }
  };
};

// ============================================================================
// STORE
// ============================================================================

const useCVStore = create<CVStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      formData: defaultFormData,
      activeStep: 0,
      personalInfoStep: 0,
      combinedFormStep: 0,
      isFormDirty: false,
      lastSaved: null,
      isEditing: false,
      isSubmitting: false,
      userId: null,
      cvId: null,
      template: 'light',
      formErrors: {},

      // Form data actions
      setFormData: (data) => {
        const currentData = get().formData;
        
        const newData: CVFormData = {
          personalInfo: {
            ...currentData.personalInfo,
            ...data.personalInfo
          },
          educations: data.educations ?? currentData.educations,
          workExperience: {
            hasWorkExperience: data.workExperience?.hasWorkExperience ?? currentData.workExperience.hasWorkExperience,
            experiences: data.workExperience?.experiences ?? currentData.workExperience.experiences
          },
          skills: data.skills ?? currentData.skills,
          languages: data.languages ?? currentData.languages,
          hobbies: data.hobbies ?? currentData.hobbies
        };

        set({ 
          formData: newData,
          isFormDirty: true,
          lastSaved: new Date().toISOString()
        });
      },

      updateFormField: (field, value) => {
        const newFormData = {
          ...get().formData,
          [field]: value
        };
        
        set({
          formData: newFormData,
          isFormDirty: true,
          lastSaved: new Date().toISOString()
        });
      },

      // Step actions
      setActiveStep: (step) => set({ activeStep: step }),
      setPersonalInfoStep: (step) => set({ personalInfoStep: step }),
      setCombinedFormStep: (step) => set({ combinedFormStep: step }),

      // Other actions
      setIsEditing: (isEditing) => set({ isEditing }),
      setUserId: (userId) => set({ userId }),
      setCvId: (cvId) => set({ cvId }),
      setTemplate: (template) => set({ template }),
      setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
      setFormErrors: (errors) => set({ formErrors: errors }),
      clearFormErrors: () => set({ formErrors: {} }),

      resetForm: () => {
        set({ 
          formData: defaultFormData,
          activeStep: 0,
          personalInfoStep: 0,
          combinedFormStep: 0,
          isFormDirty: false,
          lastSaved: null,
          isEditing: false,
          isSubmitting: false,
          userId: null,
          cvId: null,
          template: 'light',
          formErrors: {}
        });
      },

      // Navigation
      canNavigateNext: () => {
        const state = get();
        const { currentStep, currentSubStep, totalSubSteps } = state.getStepInfo();
        
        if (currentStep === 0) {
          return (currentSubStep ?? 0) < PERSONAL_INFO_SUBSTEPS - 1 || currentStep < TOTAL_STEPS - 1;
        }
        
        if (currentStep === TOTAL_STEPS - 1) {
          return (currentSubStep ?? 0) < COMBINED_FORM_SUBSTEPS - 1;
        }
        
        return currentStep < TOTAL_STEPS - 1;
      },

      canNavigatePrevious: () => {
        const state = get();
        const { currentStep, currentSubStep } = state.getStepInfo();
        
        return currentStep > 0 || (currentSubStep ?? 0) > 0;
      },

      navigateNext: () => {
        const state = get();
        const { currentStep, currentSubStep } = state.getStepInfo();

        if (currentStep === 0 && (currentSubStep ?? 0) < PERSONAL_INFO_SUBSTEPS - 1) {
          set({ personalInfoStep: state.personalInfoStep + 1 });
          return;
        }
        
        if (currentStep === TOTAL_STEPS - 1 && (currentSubStep ?? 0) < COMBINED_FORM_SUBSTEPS - 1) {
          set({ combinedFormStep: state.combinedFormStep + 1 });
          return;
        }
        
        if (currentStep < TOTAL_STEPS - 1) {
          set({ 
            activeStep: state.activeStep + 1,
            personalInfoStep: 0,
            combinedFormStep: 0
          });
        }
      },

      navigatePrevious: () => {
        const state = get();
        const { currentStep, currentSubStep } = state.getStepInfo();

        if (currentStep === 0 && (currentSubStep ?? 0) > 0) {
          set({ personalInfoStep: state.personalInfoStep - 1 });
          return;
        }
        
        if (currentStep === TOTAL_STEPS - 1 && (currentSubStep ?? 0) > 0) {
          set({ combinedFormStep: state.combinedFormStep - 1 });
          return;
        }
        
        if (currentStep > 0) {
          set({ 
            activeStep: state.activeStep - 1,
            personalInfoStep: currentStep === 1 ? PERSONAL_INFO_SUBSTEPS - 1 : 0,
            combinedFormStep: 0
          });
        }
      },

      // Getters
      getStepInfo: (): StepInfo => {
        const state = get();
        const isInPersonalInfo = state.activeStep === 0;
        const isInCombinedForm = state.activeStep === TOTAL_STEPS - 1;
        
        return {
          currentStep: state.activeStep,
          currentSubStep: isInPersonalInfo 
            ? state.personalInfoStep 
            : isInCombinedForm 
              ? state.combinedFormStep 
              : null,
          totalSteps: TOTAL_STEPS,
          totalSubSteps: isInPersonalInfo 
            ? PERSONAL_INFO_SUBSTEPS 
            : isInCombinedForm 
              ? COMBINED_FORM_SUBSTEPS 
              : 0,
          isLastStep: state.activeStep === TOTAL_STEPS - 1,
          isLastSubStep: (isInPersonalInfo && state.personalInfoStep === PERSONAL_INFO_SUBSTEPS - 1) ||
                        (isInCombinedForm && state.combinedFormStep === COMBINED_FORM_SUBSTEPS - 1)
        };
      },

      getProgress: (): number => {
        const { currentStep, currentSubStep, totalSubSteps } = get().getStepInfo();
        const mainProgress = (currentStep / (TOTAL_STEPS - 1)) * 100;
        const subProgress = totalSubSteps > 0 
          ? ((currentSubStep ?? 0) / totalSubSteps) * (100 / TOTAL_STEPS)
          : 0;
        
        return Math.min(100, Math.round(mainProgress + subProgress));
      }
    }),
    {
      name: 'cv-store',
      storage: createJSONStorage(getCustomStorage),
      partialize: (state) => ({
        formData: state.formData,
        activeStep: state.activeStep,
        personalInfoStep: state.personalInfoStep,
        combinedFormStep: state.combinedFormStep,
        isEditing: state.isEditing,
        userId: state.userId,
        cvId: state.cvId,
        template: state.template
      })
    }
  )
);

// ============================================================================
// SELECTORS (for optimized re-renders)
// ============================================================================

export const useFormData = () => useCVStore((state) => state.formData);
export const useUserId = () => useCVStore((state) => state.userId);
export const useIsEditing = () => useCVStore((state) => state.isEditing);
export const useCurrentStep = () => useCVStore((state) => state.activeStep);
export const useFormErrors = () => useCVStore((state) => state.formErrors);
export const useTemplate = () => useCVStore((state) => state.template);

export { useCVStore };

