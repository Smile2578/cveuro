// app/components/cvgen/Form.js
"use client";

import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
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
  const [validationErrors, setValidationErrors] = useState(null);

  const { cvSchema } = createValidators(tValidation);

  // Fonction utilitaire pour vérifier si un objet est vide
  const isEmptyObject = (obj) => {
    if (!obj) return true;
    return Object.keys(obj).length === 0;
  };

  // Fonction pour vérifier l'intégrité des données personnelles
  const validatePersonalInfo = (data) => {
    const { firstname, lastname, email } = data?.personalInfo || {};
    return Boolean(firstname?.trim() && lastname?.trim() && email?.trim());
  };

  const methods = useForm({
    resolver: zodResolver(cvSchema),
    defaultValues: store.formData,
    mode: 'onTouched',
    reValidateMode: 'onBlur',
    shouldUnregister: false
  });

  // Effet pour synchroniser les données
  useEffect(() => {
    if (isResetting.current) return;

    const subscription = methods.watch((value, { name, type }) => {
      if (!isResetting.current && value) {
        const hasChanged = JSON.stringify(formStateRef.current[name]) !== JSON.stringify(value[name]);
        
        if ((type === 'change' || type === 'blur') && hasChanged) {
          formStateRef.current[name] = value[name];
          store.setFormData(value);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [methods.watch, store, methods]);

  const handleSubmit = useCallback(async () => {
    try {
      setValidationErrors(null);
      store.setIsSubmitting(true);
      store.setFormErrors(null);
      
      // Fonction déplacée à l'intérieur du useCallback
      const getAllSourcesData = () => {
        let localData = {};
        try {
          const customStorage = window.__customStorage;
          if (customStorage) {
            const storedData = customStorage.getItem('cvFormData');
            if (storedData) {
              localData = JSON.parse(storedData);
            }
          }
        } catch (e) {
          console.warn('Error reading from CustomStorage:', e);
          try {
            const storedData = localStorage.getItem('cvFormData');
            if (storedData) {
              localData = JSON.parse(storedData);
            }
          } catch (e) {
            console.warn('Error reading from localStorage:', e);
          }
        }

        const storeData = store.formData;
        const formData = methods.getValues();

        console.log('Data sources:', {
          localData,
          storeData,
          formData
        });

        return { localData, storeData, formData };
      };

      const { localData, storeData, formData } = getAllSourcesData();

      // Fusion des données avec validation
      const mergedData = {
        personalInfo: {
          ...localData.personalInfo,
          ...storeData.personalInfo,
          ...formData.personalInfo,
        },
        educations: formData.educations?.length > 0 
          ? formData.educations 
          : storeData.educations?.length > 0
            ? storeData.educations
            : localData.educations || [],
        workExperience: {
          hasWorkExperience: formData.workExperience?.hasWorkExperience ?? 
                            storeData.workExperience?.hasWorkExperience ?? 
                            localData.workExperience?.hasWorkExperience ?? false,
          experiences: formData.workExperience?.experiences?.length > 0 
            ? formData.workExperience.experiences
            : storeData.workExperience?.experiences?.length > 0
              ? storeData.workExperience.experiences
              : localData.workExperience?.experiences || []
        },
        skills: formData.skills?.length > 0 
          ? formData.skills 
          : storeData.skills?.length > 0
            ? storeData.skills
            : localData.skills || [],
        languages: formData.languages?.length > 0 
          ? formData.languages 
          : storeData.languages?.length > 0
            ? storeData.languages
            : localData.languages || [],
        hobbies: formData.hobbies?.length > 0 
          ? formData.hobbies 
          : storeData.hobbies?.length > 0
            ? storeData.hobbies
            : localData.hobbies || []
      };

      console.log('Merged data:', mergedData);

      // Validation des données personnelles
      if (!validatePersonalInfo(mergedData)) {
        console.error('Missing or invalid personal info');
        const error = {
          personalInfo: {
            message: 'Les informations personnelles sont incomplètes ou invalides'
          }
        };
        setValidationErrors(error);
        store.setFormErrors(error);
        return;
      }

      // Validation des données d'éducation
      if (!mergedData.educations?.length) {
        console.error('No education entries');
        const error = {
          educations: {
            message: 'Veuillez ajouter au moins une formation'
          }
        };
        setValidationErrors(error);
        store.setFormErrors(error);
        return;
      }

      const transformedData = {
        ...mergedData,
        personalInfo: {
          ...mergedData.personalInfo,
          nationality: Array.isArray(mergedData.personalInfo.nationality) 
            ? mergedData.personalInfo.nationality.map(nat => 
                typeof nat === 'string' 
                  ? { code: nat, label: nat }
                  : nat
              )
            : []
        }
      };

      console.log('Transformed data for validation:', transformedData);

      // Validation complète avec Zod
      const isValid = await methods.trigger(undefined, { values: transformedData });
      
      if (!isValid) {
        console.error('Form validation failed:', methods.formState.errors);
        setValidationErrors(methods.formState.errors);
        store.setFormErrors(methods.formState.errors);
        return;
      }

      // Soumission des données
      const userId = store.userId;
      let response;
      let result;

      if (userId) {
        console.log('Updating existing CV...');
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
          console.error('Error updating CV:', error);
          if (error.message === 'CV_NOT_FOUND') {
            localStorage.removeItem('userId');
            store.setUserId(null);
          } else {
            throw error;
          }
        }
      }

      if (!userId || response?.status === 404) {
        console.log('Creating new CV...');
        response = await fetch('/api/cvgen/submitCV', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transformedData)
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      result = await response.json();
      console.log('Submit response:', result);
      
      if (result.data?.userId) {
        // Sauvegarder l'userId dans le CustomStorage si disponible
        if (window.__customStorage) {
          window.__customStorage.setItem('userId', result.data.userId);
        } else {
          localStorage.setItem('userId', result.data.userId);
        }
        store.setUserId(result.data.userId);
      }

      router.push(`/cvedit?userId=${result.data.userId || userId}`);
      
    } catch (error) {
      console.error('Submit error:', error);
      const errorMessage = {
        submit: error.message || 'Une erreur est survenue lors de la soumission'
      };
      setValidationErrors(errorMessage);
      store.setFormErrors(errorMessage);
    } finally {
      store.setIsSubmitting(false);
    }
  }, [methods, store, router]);

  const MemoizedStepContent = useMemo(() => (
    <StepContent step={currentStep} onSubmit={handleSubmit} />
  ), [currentStep, handleSubmit]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => {
        e.preventDefault();
        if (currentStep === 3) {
          handleSubmit();
        }
      }}>
        {validationErrors && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography color="error" variant="body2">
              {Object.values(validationErrors).map(error => error.message).join(', ')}
            </Typography>
          </Box>
        )}
        <Container 
          maxWidth="md" 
          sx={{ 
            overflowX: 'hidden',
            px: { xs: 2, sm: 3 },
            display: 'flex',
            flexDirection: 'column',
            minHeight: 'auto',
            width: '100%',
            mt: { xs: 1, sm: 3 }
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
              py: { xs: 1, sm: 4 }
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