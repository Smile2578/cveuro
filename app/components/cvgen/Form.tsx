'use client';

import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { createValidators } from '@/app/utils/validators';
import { useCVStore } from '@/app/store/cvStore';
import { logger } from '@/app/utils/logger';
import PersonalInfoForm from './personal-info/PersonalInfoForm';
import EducationForm from './education/EducationForm';
import WorkExperienceForm from './work-experience/WorkExperienceForm';
import CombinedForm from './combined-form/CombinedForm';
import ProgressBar from './ProgressBar';
import { useFormProgress } from '@/app/hooks/useFormProgress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import AccountBenefitsBanner from '../auth/AccountBenefitsBanner';
import { useAuth } from '@/app/hooks/useAuth';

interface StepContentProps {
  step: number;
  onSubmit: () => Promise<void>;
}

function StepContent({ step, onSubmit }: StepContentProps) {
  switch (step) {
    case 0:
      return <PersonalInfoForm />;
    case 1:
      return <EducationForm />;
    case 2:
      return <WorkExperienceForm />;
    case 3:
      return <CombinedForm onSubmit={onSubmit} />;
    default:
      return null;
  }
}

interface ValidationError {
  message?: string;
  [key: string]: unknown;
}

// Field labels for error messages
const FIELD_LABELS: Record<string, string> = {
  'personalInfo.firstname': 'Prénom',
  'personalInfo.lastname': 'Nom',
  'personalInfo.email': 'Email',
  'personalInfo.phoneNumber': 'Téléphone',
  'personalInfo.dateofBirth': 'Date de naissance',
  'personalInfo.nationality': 'Nationalité',
  'personalInfo.sex': 'Genre',
  'personalInfo.address': 'Adresse',
  'personalInfo.city': 'Ville',
  'personalInfo.zip': 'Code postal',
  'educations': 'Formation',
  'workExperience': 'Expérience professionnelle',
  'skills': 'Compétences',
  'languages': 'Langues',
};

export default function Form() {
  const router = useRouter();
  const store = useCVStore();
  const tValidation = useTranslations('validation');
  const tForm = useTranslations('cvform');
  const isResetting = useRef(false);
  const { currentStep } = useFormProgress();
  const formStateRef = useRef<Record<string, unknown>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, ValidationError> | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
  
  // Get authentication state
  const { isGuest, isAuthenticated } = useAuth();

  const { cvSchema, personalInfoSchema } = createValidators(tValidation);

  const methods = useForm({
    resolver: zodResolver(cvSchema),
    defaultValues: store.formData,
    mode: 'onTouched',
    reValidateMode: 'onBlur',
    shouldUnregister: false
  });

  // Track if store has been hydrated
  const [isHydrated, setIsHydrated] = useState(false);
  const lastSyncedRef = useRef<string>('');

  // Hydrate form from store after mount (handles page refresh)
  useEffect(() => {
    // Wait for Zustand store to hydrate from localStorage
    const unsubscribe = useCVStore.persist.onFinishHydration(() => {
      const storeData = useCVStore.getState().formData;
      const currentFormData = methods.getValues();
      
      // Only reset if store has meaningful data that differs from current form
      const storeHasData = storeData.personalInfo?.firstname || 
                          storeData.personalInfo?.lastname ||
                          storeData.personalInfo?.email;
      
      if (storeHasData) {
        const storeJson = JSON.stringify(storeData);
        const formJson = JSON.stringify(currentFormData);
        
        if (storeJson !== formJson) {
          isResetting.current = true;
          methods.reset(storeData);
          isResetting.current = false;
          logger.info('Form restored from localStorage', 'FormPersistence');
        }
      }
      
      setIsHydrated(true);
    });

    // If already hydrated, check immediately
    if (useCVStore.persist.hasHydrated()) {
      const storeData = useCVStore.getState().formData;
      const storeHasData = storeData.personalInfo?.firstname || 
                          storeData.personalInfo?.lastname ||
                          storeData.personalInfo?.email;
      
      if (storeHasData) {
        isResetting.current = true;
        methods.reset(storeData);
        isResetting.current = false;
      }
      setIsHydrated(true);
    }

    return () => unsubscribe?.();
  }, [methods]);

  // Sync form changes to store (debounced)
  useEffect(() => {
    if (!isHydrated || isResetting.current) return;

    const subscription = methods.watch((value) => {
      if (!value || isResetting.current) return;
      
      // Debounce sync with a simple check
      const valueJson = JSON.stringify(value);
      if (valueJson === lastSyncedRef.current) return;
      lastSyncedRef.current = valueJson;
      
      // Sync to store
      store.setFormData(value as Record<string, unknown>);
    });

    return () => subscription.unsubscribe();
  }, [methods, store, isHydrated]);

  const handleSubmit = useCallback(async () => {
    try {
      setValidationErrors(null);
      store.setIsSubmitting(true);
      store.clearFormErrors();
      
      const getAllSourcesData = () => {
        let localData: Record<string, unknown> = {};
        try {
          const storedData = localStorage.getItem('cvFormData');
          if (storedData) {
            localData = JSON.parse(storedData);
          }
        } catch {
          // Silent fail on localStorage read
        }

        const storeData = store.formData;
        const formData = methods.getValues();

        return { localData, storeData, formData };
      };

      const { localData, storeData, formData } = getAllSourcesData();

      const mergedData = {
        personalInfo: {
          ...((localData.personalInfo as object) || {}),
          ...((storeData.personalInfo as object) || {}),
          ...((formData.personalInfo as object) || {}),
        },
        educations: (formData.educations as unknown[])?.length > 0 
          ? formData.educations 
          : (storeData.educations as unknown[])?.length > 0
            ? storeData.educations
            : (localData.educations as unknown[]) || [],
        workExperience: {
          hasWorkExperience: (formData.workExperience as { hasWorkExperience?: boolean })?.hasWorkExperience 
            ?? (storeData.workExperience as { hasWorkExperience?: boolean })?.hasWorkExperience 
            ?? (localData.workExperience as { hasWorkExperience?: boolean })?.hasWorkExperience 
            ?? false,
          experiences: ((formData.workExperience as { experiences?: unknown[] } | undefined)?.experiences?.length ?? 0) > 0 
            ? (formData.workExperience as { experiences: unknown[] }).experiences
            : ((storeData.workExperience as { experiences?: unknown[] } | undefined)?.experiences?.length ?? 0) > 0
              ? (storeData.workExperience as { experiences: unknown[] }).experiences
              : (localData.workExperience as { experiences?: unknown[] } | undefined)?.experiences ?? []
        },
        skills: (formData.skills as unknown[])?.length > 0 
          ? formData.skills 
          : (storeData.skills as unknown[])?.length > 0
            ? storeData.skills
            : (localData.skills as unknown[]) || [],
        languages: (formData.languages as unknown[])?.length > 0 
          ? formData.languages 
          : (storeData.languages as unknown[])?.length > 0
            ? storeData.languages
            : (localData.languages as unknown[]) || [],
        hobbies: (formData.hobbies as unknown[])?.length > 0 
          ? formData.hobbies 
          : (storeData.hobbies as unknown[])?.length > 0
            ? storeData.hobbies
            : (localData.hobbies as unknown[]) || []
      };

      // Transform nationality to correct format before validation
      const personalInfo = mergedData.personalInfo as { nationality?: string | string[] | { code: string; label: string }[] };
      const transformedData = {
        ...mergedData,
        personalInfo: {
          ...personalInfo,
          nationality: Array.isArray(personalInfo.nationality) 
            ? personalInfo.nationality.map(nat => 
                typeof nat === 'string' 
                  ? { code: nat, label: nat }
                  : nat
              )
            : []
        }
      };

      // Validate using Zod schema directly for detailed error messages
      const validationResult = cvSchema.safeParse(transformedData);
      
      if (!validationResult.success) {
        const zodErrors = validationResult.error.flatten();
        const fieldErrors: Record<string, ValidationError> = {};
        const messages: string[] = [];

        // Process field errors
        for (const [field, errors] of Object.entries(zodErrors.fieldErrors)) {
          if (errors && errors.length > 0) {
            const label = FIELD_LABELS[field] || field;
            fieldErrors[field] = { message: errors[0] };
            messages.push(`${label}: ${errors[0]}`);
          }
        }

        // Process form errors (like missing education)
        if (zodErrors.formErrors.length > 0) {
          messages.push(...zodErrors.formErrors);
        }

        // Check for nested errors in personalInfo
        if (validationResult.error.issues) {
          for (const issue of validationResult.error.issues) {
            const path = issue.path.join('.');
            const label = FIELD_LABELS[path] || path;
            if (!messages.some(m => m.startsWith(label))) {
              messages.push(`${label}: ${issue.message}`);
            }
            
            // Build nested error structure
            if (issue.path.length > 0) {
              let current: Record<string, unknown> = fieldErrors;
              for (let i = 0; i < issue.path.length - 1; i++) {
                const key = String(issue.path[i]);
                if (!current[key]) {
                  current[key] = {};
                }
                current = current[key] as Record<string, unknown>;
              }
              const lastKey = String(issue.path[issue.path.length - 1]);
              current[lastKey] = { message: issue.message };
            }
          }
        }

        // Log validation errors for admin tracking
        logger.validationError('CVForm', {
          step: currentStep,
          errors: validationResult.error.issues.map(issue => ({
            path: issue.path.join('.'),
            code: issue.code,
            message: issue.message,
          })),
        });

        setValidationErrors(fieldErrors);
        setErrorMessages(messages);
        // Convert ValidationError objects to strings for the store
        const stringErrors: Record<string, string> = {};
        for (const [key, value] of Object.entries(fieldErrors)) {
          if (typeof value === 'object' && value !== null && 'message' in value) {
            stringErrors[key] = (value as { message: string }).message;
          }
        }
        store.setFormErrors(stringErrors);
        return;
      }

      // Clear errors on successful validation
      setErrorMessages([]);

      const userId = store.userId;
      let response: Response | undefined;
      let result: { data?: { userId?: string } };

      if (userId) {
        try {
          response = await fetch(`/api/cvgen/updateCV?userId=${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transformedData)
          });

          if (response.status === 404) {
            throw new Error('CV_NOT_FOUND');
          }
        } catch (error) {
          if (error instanceof Error && error.message === 'CV_NOT_FOUND') {
            localStorage.removeItem('userId');
            store.setUserId(null);
          } else {
            throw error;
          }
        }
      }

      if (!userId || response?.status === 404) {
        response = await fetch('/api/cvgen/submitCV', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transformedData)
        });
      }

      if (!response?.ok) {
        throw new Error(`HTTP error! status: ${response?.status}`);
      }

      result = await response.json();
      
      if (result.data?.userId) {
        localStorage.setItem('userId', result.data.userId);
        store.setUserId(result.data.userId);
      }

      const redirectUrl = `/cvedit?userId=${result.data?.userId || userId}`;
      
      // Use auth state to check if guest (isGuest from useAuth hook)
      if (isGuest) {
        // Show account benefits modal for guest users
        setPendingRedirect(redirectUrl);
        setShowAccountModal(true);
      } else {
        // Authenticated users go directly to edit
        router.push(redirectUrl);
      }
      
    } catch (error) {
      // Log submission errors for admin tracking
      logger.error(
        'Form submission failed',
        'CVForm',
        {
          step: currentStep,
          errorType: error instanceof Error ? error.name : 'Unknown',
          errorMessage: error instanceof Error ? error.message : String(error),
        }
      );

      const errorText = error instanceof Error ? error.message : 'Une erreur est survenue lors de la soumission';
      const errorMessage = {
        submit: { message: errorText }
      };
      setValidationErrors(errorMessage);
      setErrorMessages([errorText]);
      store.setFormErrors({ submit: errorText });
    } finally {
      store.setIsSubmitting(false);
    }
  }, [methods, store, router, cvSchema, currentStep, isGuest]);

  const MemoizedStepContent = useMemo(() => (
    <StepContent step={currentStep} onSubmit={handleSubmit} />
  ), [currentStep, handleSubmit]);

  // Handler for when account modal is dismissed
  const handleAccountModalDismiss = useCallback(() => {
    setShowAccountModal(false);
    if (pendingRedirect) {
      router.push(pendingRedirect);
    }
  }, [pendingRedirect, router]);

  return (
    <FormProvider {...methods}>
      {/* Account benefits modal for guest users */}
      {showAccountModal && (
        <AccountBenefitsBanner 
          variant="modal" 
          onDismiss={handleAccountModalDismiss}
        />
      )}

      <form onSubmit={(e) => {
        e.preventDefault();
        if (currentStep === 3) {
          handleSubmit();
        }
      }}>
        {/* Validation errors alert */}
        {(validationErrors || errorMessages.length > 0) && (
          <Alert variant="destructive" className="mb-4 mx-2 sm:mx-4">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <AlertDescription className="ml-2">
              <div className="font-medium mb-1">{tForm('validation.errorsFound')}</div>
              {errorMessages.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {errorMessages.slice(0, 5).map((message, index) => (
                    <li key={index}>{message}</li>
                  ))}
                  {errorMessages.length > 5 && (
                    <li className="text-muted-foreground">
                      +{errorMessages.length - 5} {tForm('validation.moreErrors')}
                    </li>
                  )}
                </ul>
              ) : (
                <p className="text-sm">
                  {Object.values(validationErrors || {}).map(error => error.message).filter(Boolean).join(', ')}
                </p>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Main form container */}
        <div className="w-full px-2 sm:px-4 flex flex-col min-h-auto mt-2 sm:mt-4">
          <ProgressBar />
          
          <div className="flex-1 flex flex-col items-center justify-start w-full py-2 sm:py-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {MemoizedStepContent}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

