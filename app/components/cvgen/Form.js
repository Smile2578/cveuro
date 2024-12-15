// app/components/cvgen/Form.js
"use client";

import React, { useEffect, useRef } from 'react';
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

const StepContent = ({ step }) => {
  switch (step) {
    case 0:
      return <PersonalInfoForm />;
    case 1:
      return <EducationForm />;
    case 2:
      return <WorkExperienceForm />;
    case 3:
      return <CombinedForm />;
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

  const { cvSchema } = createValidators(tValidation);

  // Configuration de React Hook Form avec Zod
  const methods = useForm({
    resolver: zodResolver(cvSchema),
    defaultValues: store.formData,
    mode: 'onTouched',
    reValidateMode: 'onBlur'
  });

  // Chargement initial des données depuis le store
  useEffect(() => {
    const loadInitialData = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          store.setUserId(userId);
          store.setIsEditing(true);
          const response = await fetch(`/api/cvgen/fetchCV?userId=${userId}`);
          if (response.ok) {
            const data = await response.json();
            methods.reset(data);
            store.setFormData(data);
          }
        } catch (error) {
          console.error('Erreur lors du chargement des données:', error);
        }
      }
    };
    loadInitialData();
  }, []);

  // Synchronisation des données validées avec le store
  useEffect(() => {
    const subscription = methods.watch((value) => {
      if (!isResetting.current && value) {
        store.setFormData(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [methods.watch]);

  // Soumission finale du formulaire
  const handleSubmit = async (data) => {
    try {
      store.setIsSubmitting(true);
      const userId = store.userId;
      
      const endpoint = userId 
        ? `/api/cvgen/updateCV?userId=${userId}`
        : '/api/cvgen/submitCV';
      
      const method = userId ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la soumission');
      }

      const result = await response.json();
      
      if (!userId && result.data?.userId) {
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
  };

  return (
    <FormProvider {...methods}>
      <Container maxWidth="md" sx={{ overflowX: 'hidden', paddingRight: 'calc(100vw - 100%)' }}>
        <ProgressBar />

        <Box sx={{ minHeight: '60vh' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StepContent step={currentStep} />
            </motion.div>
          </AnimatePresence>
        </Box>
      </Container>
    </FormProvider>
  );
};

export default Form;