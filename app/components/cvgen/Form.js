// app/components/cvgen/Form.js
"use client";

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { Box, Container } from '@mui/material';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { createValidators } from '@/app/utils/validators';
import { useCVStore } from '@/app/store/cvStore';
import PersonalInfoForm from './personal-info/PersonalInfoForm';
import EducationForm from './education/EducationForm';
import WorkExperienceForm from './work-experience/WorkExperienceForm';
import CombinedForm from './combined-form/CombinedForm';
import ProgressBar from './ProgressBar';
import { useFormProgress } from '@/app/hooks/useFormProgress';

const StepContent = ({ step, onSubmit }) => {
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
};

const Form = () => {
  const router = useRouter();
  const store = useCVStore();
  const tValidation = useTranslations('validation');
  const isResetting = useRef(false);
  const { currentStep } = useFormProgress();
  const formStateRef = useRef({});

  const { cvSchema } = createValidators(tValidation);

  // Configuration optimisée de React Hook Form
  const methods = useForm({
    resolver: zodResolver(cvSchema),
    defaultValues: store.formData,
    mode: 'onTouched',
    reValidateMode: 'onBlur',
    shouldUnregister: false // Empêche la perte des données lors du changement d'étape
  });

  // Synchronisation optimisée avec le store
  useEffect(() => {
    if (isResetting.current) return;

    const subscription = methods.watch((value, { name, type }) => {
      if (!isResetting.current && value) {
        // Éviter les mises à jour inutiles en comparant avec l'état précédent
        const hasChanged = JSON.stringify(formStateRef.current[name]) !== JSON.stringify(value[name]);
        
        if ((type === 'change' || type === 'blur') && hasChanged) {
          formStateRef.current[name] = value[name];
          store.setFormData(value);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [methods.watch, store]);

  // Soumission optimisée du formulaire
  const handleSubmit = useCallback(async () => {
    try {
      store.setIsSubmitting(true);
      store.setFormErrors(null);
      
      const isValid = await methods.trigger();
      if (!isValid) {
        store.setFormErrors(methods.formState.errors);
        return;
      }

      const formData = methods.getValues();
      const userId = store.userId;
      
      let response;
      let result;

      if (userId) {
        try {
          response = await fetch(`/api/cvgen/updateCV?userId=${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });

          if (response.status === 404) {
            throw new Error('CV_NOT_FOUND');
          }
        } catch (error) {
          if (error.message === 'CV_NOT_FOUND') {
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
          body: JSON.stringify(formData)
        });
      }

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      result = await response.json();
      
      if (result.data?.userId) {
        localStorage.setItem('userId', result.data.userId);
        store.setUserId(result.data.userId);
      }

      router.push(`/cvedit?userId=${result.data.userId || userId}`);
      
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      store.setFormErrors({ submit: error.message });
    } finally {
      store.setIsSubmitting(false);
    }
  }, [methods, store, router]);

  // Composant StepContent mémorisé
  const MemoizedStepContent = useMemo(() => (
    <StepContent step={currentStep} onSubmit={handleSubmit} />
  ), [currentStep, handleSubmit]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => e.preventDefault()}>
        <Container 
          maxWidth="md" 
          sx={{ 
            overflowX: 'hidden',
            px: { xs: 2, sm: 3 },
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            width: '100%'
          }}
        >
          <ProgressBar />
          <Box 
            sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '100%',
              py: { xs: 2, sm: 4 }
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%' }}
              >
                {MemoizedStepContent}
              </motion.div>
            </AnimatePresence>
          </Box>
        </Container>
      </form>
    </FormProvider>
  );
};

export default Form;