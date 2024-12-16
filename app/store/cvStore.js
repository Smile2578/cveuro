// app/store/cvStore.js

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

console.log('cvStore - Initialisation du store');

const TOTAL_STEPS = 4;
const PERSONAL_INFO_SUBSTEPS = 5;
const COMBINED_FORM_SUBSTEPS = 3;

const defaultFormData = {
  personalInfo: {
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
  },
  educations: [],
  workExperience: {
    hasWorkExperience: false,
    experiences: []
  },
  combinedForm: {
    skills: [],
    languages: [],
    hobbies: []
  }
};

const useCVStore = create(
  persist(
    (set, get) => ({
      // États du formulaire
      formData: defaultFormData,
      activeStep: 0,
      personalInfoStep: 0,
      combinedFormStep: 0,
      isFormDirty: false,
      lastSaved: null,
      isEditing: false,
      isSubmitting: false,
      userId: null,
      formErrors: {},

      // Nouvelles méthodes de gestion des étapes
      getStepInfo: () => {
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
                        (isInCombinedForm && state.combinedFormStep === COMBINED_FORM_SUBSTEPS - 1),
          isLastStepAndSubStep: state.activeStep === TOTAL_STEPS - 1 && 
                               state.combinedFormStep === COMBINED_FORM_SUBSTEPS - 1,
          isFinalStep: state.activeStep === TOTAL_STEPS - 1 && 
                      state.combinedFormStep === COMBINED_FORM_SUBSTEPS - 1
        };
      },

      // Navigation améliorée
      canNavigateNext: () => {
        const state = get();
        const { currentStep, currentSubStep, totalSubSteps } = state.getStepInfo();
        
        if (currentStep === 0) {
          return currentSubStep < PERSONAL_INFO_SUBSTEPS - 1 || currentStep < TOTAL_STEPS - 1;
        }
        
        if (currentStep === TOTAL_STEPS - 1) {
          return currentSubStep < COMBINED_FORM_SUBSTEPS - 1;
        }
        
        return currentStep < TOTAL_STEPS - 1;
      },

      canNavigatePrevious: () => {
        const state = get();
        const { currentStep, currentSubStep } = state.getStepInfo();
        
        if (currentStep === 0) {
          return currentSubStep > 0;
        }
        
        if (currentStep === TOTAL_STEPS - 1) {
          return currentSubStep > 0 || currentStep > 0;
        }
        
        return currentStep > 0;
      },

      // Navigation
      navigateNext: () => {
        const state = get();
        const { currentStep, currentSubStep, totalSubSteps } = state.getStepInfo();

        if (currentStep === 0 && currentSubStep < PERSONAL_INFO_SUBSTEPS - 1) {
          set({ personalInfoStep: currentSubStep + 1 });
        } else if (currentStep === TOTAL_STEPS - 1 && currentSubStep < COMBINED_FORM_SUBSTEPS - 1) {
          set({ combinedFormStep: currentSubStep + 1 });
        } else if (currentStep < TOTAL_STEPS - 1) {
          set({ 
            activeStep: currentStep + 1,
            personalInfoStep: 0,
            combinedFormStep: 0
          });
        }
      },

      navigatePrevious: () => {
        const state = get();
        const { currentStep, currentSubStep } = state.getStepInfo();

        if (currentStep === 0 && currentSubStep > 0) {
          set({ personalInfoStep: currentSubStep - 1 });
        } else if (currentStep === TOTAL_STEPS - 1) {
          if (currentSubStep > 0) {
            set({ combinedFormStep: currentSubStep - 1 });
          } else {
            set({ 
              activeStep: currentStep - 1,
              combinedFormStep: 0
            });
          }
        } else if (currentStep > 0) {
          set({ 
            activeStep: currentStep - 1,
            personalInfoStep: currentStep === 1 ? PERSONAL_INFO_SUBSTEPS - 1 : 0,
            combinedFormStep: 0
          });
        }
      },

      // Actions de gestion du formulaire
      setFormData: (data) => {
        set({ 
          formData: data,
          isFormDirty: true,
          lastSaved: new Date().toISOString()
        });
      },
      
      updateFormField: (field, value) => {
        set((state) => ({
          formData: {
            ...state.formData,
            [field]: value
          },
          isFormDirty: true,
          lastSaved: new Date().toISOString()
        }));
      },

      // Gestion de l'édition
      setIsEditing: (isEditing) => set({ isEditing }),
      setUserId: (userId) => set({ userId }),
      setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
      
      // Gestion des erreurs
      setFormErrors: (errors) => set({ formErrors: errors }),
      clearFormErrors: () => set({ formErrors: {} }),
      
      // Reset complet
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
          formErrors: {}
        });
        localStorage.removeItem('cvFormData');
        localStorage.removeItem('cv-store');
      },

      // Calcul de la progression mis à jour
      getProgress: () => {
        const state = get();
        const { currentStep, currentSubStep, totalSubSteps } = state.getStepInfo();
        
        // Chaque étape principale vaut 25%
        const mainProgress = (currentStep / (TOTAL_STEPS - 1)) * 100;
        
        // Calcul de la progression des sous-étapes
        let subProgress = 0;
        if (totalSubSteps > 0) {
          const subStepValue = 25 / totalSubSteps; // 25% divisé par le nombre de sous-étapes
          subProgress = currentSubStep * subStepValue;
        }
        
        return Math.min(100, Math.round(mainProgress + subProgress));
      }
    }),
    {
      name: 'cv-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        formData: state.formData,
        activeStep: state.activeStep,
        personalInfoStep: state.personalInfoStep,
        combinedFormStep: state.combinedFormStep,
        isEditing: state.isEditing,
        userId: state.userId
      })
    }
  )
);

export { useCVStore }; 