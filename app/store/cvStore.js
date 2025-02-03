// app/store/cvStore.js

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { getStorage, initStorage } from '../utils/storage';

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
  skills: [],
  languages: [],
  hobbies: []
};

// Sélecteurs optimisés
const selectors = {
  formData: (state) => state.formData,
  userId: (state) => state.userId,
  isEditing: (state) => state.isEditing,
  currentStep: (state) => state.activeStep,
  formErrors: (state) => state.formErrors,
};

// Initialiser le storage si on est côté client
if (typeof window !== 'undefined') {
  initStorage();
}

const customStorage = typeof window !== 'undefined' ? getStorage() : null;

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

      // Actions optimisées
      setFormData: (data) => {
        const currentData = get().formData;
        console.log('Setting form data:', { current: currentData, new: data });
        
        try {
          // Fusion profonde des données avec validation
          const newData = {
            personalInfo: {
              ...currentData.personalInfo,
              ...data.personalInfo,
              // Validation des champs requis
              firstname: data.personalInfo?.firstname || currentData.personalInfo?.firstname || '',
              lastname: data.personalInfo?.lastname || currentData.personalInfo?.lastname || '',
              email: data.personalInfo?.email || currentData.personalInfo?.email || ''
            },
            educations: data.educations?.length > 0 
              ? data.educations 
              : currentData.educations,
            workExperience: {
              hasWorkExperience: data.workExperience?.hasWorkExperience ?? currentData.workExperience?.hasWorkExperience,
              experiences: data.workExperience?.experiences?.length > 0 
                ? data.workExperience.experiences 
                : currentData.workExperience?.experiences || []
            },
            skills: data.skills?.length > 0 
              ? data.skills 
              : currentData.skills,
            languages: data.languages?.length > 0 
              ? data.languages 
              : currentData.languages,
            hobbies: data.hobbies?.length > 0 
              ? data.hobbies 
              : currentData.hobbies
          };

          // Vérification de l'intégrité des données
          if (JSON.stringify(currentData) !== JSON.stringify(newData)) {
            console.log('Data changed, updating store...');
            set({ 
              formData: newData,
              isFormDirty: true,
              lastSaved: new Date().toISOString()
            });

            // Sauvegarder dans le CustomStorage
            if (customStorage) {
              const dataToSave = JSON.stringify(newData);
              customStorage.setItem('cvFormData', dataToSave);
              console.log('Data saved to storage');
            }
          }
        } catch (error) {
          console.error('Error in setFormData:', error);
          // En cas d'erreur, on sauvegarde au moins en mémoire
          set({ 
            formData: {
              ...currentData,
              ...data
            },
            isFormDirty: true,
            lastSaved: new Date().toISOString()
          });
        }
      },

      updateFormField: (field, value) => {
        const currentValue = get().formData[field];
        // Vérifier si la valeur a réellement changé
        if (JSON.stringify(currentValue) !== JSON.stringify(value)) {
          const newFormData = {
            ...get().formData,
            [field]: value
          };
          
          set({
            formData: newFormData,
            isFormDirty: true,
            lastSaved: new Date().toISOString()
          });

          // Sauvegarder dans le CustomStorage
          if (customStorage) {
            customStorage.setItem('cvFormData', JSON.stringify(newFormData));
          }
        }
      },

      // Navigation optimisée
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
        
        return currentStep > 0 || currentSubStep > 0;
      },

      navigateNext: () => {
        const state = get();
        const { currentStep, currentSubStep } = state.getStepInfo();

        set((state) => {
          if (currentStep === 0 && currentSubStep < PERSONAL_INFO_SUBSTEPS - 1) {
            return { personalInfoStep: state.personalInfoStep + 1 };
          }
          if (currentStep === TOTAL_STEPS - 1 && currentSubStep < COMBINED_FORM_SUBSTEPS - 1) {
            return { combinedFormStep: state.combinedFormStep + 1 };
          }
          if (currentStep < TOTAL_STEPS - 1) {
            return { 
              activeStep: state.activeStep + 1,
              personalInfoStep: 0,
              combinedFormStep: 0
            };
          }
          return state;
        });
      },

      navigatePrevious: () => {
        const state = get();
        const { currentStep, currentSubStep } = state.getStepInfo();

        set((state) => {
          if (currentStep === 0 && currentSubStep > 0) {
            return { personalInfoStep: state.personalInfoStep - 1 };
          }
          if (currentStep === TOTAL_STEPS - 1 && currentSubStep > 0) {
            return { combinedFormStep: state.combinedFormStep - 1 };
          }
          if (currentStep > 0) {
            return { 
              activeStep: state.activeStep - 1,
              personalInfoStep: currentStep === 1 ? PERSONAL_INFO_SUBSTEPS - 1 : 0,
              combinedFormStep: 0
            };
          }
          return state;
        });
      },

      // Autres méthodes optimisées
      setIsEditing: (isEditing) => set({ isEditing }),
      setUserId: (userId) => {
        set({ userId });
        if (customStorage && userId) {
          customStorage.setItem('userId', userId);
        }
      },
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
          formErrors: {}
        });
        if (customStorage) {
          customStorage.removeItem('cvFormData');
          customStorage.removeItem('cv-store');
          customStorage.removeItem('userId');
        }
      },

      // Getters optimisés
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
                        (isInCombinedForm && state.combinedFormStep === COMBINED_FORM_SUBSTEPS - 1)
        };
      },

      getProgress: () => {
        const { currentStep, currentSubStep, totalSubSteps } = get().getStepInfo();
        const mainProgress = (currentStep / (TOTAL_STEPS - 1)) * 100;
        const subProgress = totalSubSteps > 0 
          ? (currentSubStep / totalSubSteps) * (100 / TOTAL_STEPS)
          : 0;
        
        return Math.min(100, Math.round(mainProgress + subProgress));
      }
    }),
    {
      name: 'cv-store',
      storage: createJSONStorage(() => customStorage),
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

// Export des sélecteurs optimisés
export const useFormData = () => useCVStore(selectors.formData, shallow);
export const useUserId = () => useCVStore(selectors.userId);
export const useIsEditing = () => useCVStore(selectors.isEditing);
export const useCurrentStep = () => useCVStore(selectors.currentStep);
export const useFormErrors = () => useCVStore(selectors.formErrors, shallow);

export { useCVStore };