"use client";
import React, { useState, useEffect } from 'react';
import { Formik, Form as FormikForm } from 'formik';
import { useTranslations } from 'next-intl';
import { Button, Box, LinearProgress, Typography, Grid, Snackbar, Alert, Stepper, Step, StepLabel, StepButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material/';
import WarningIcon from '@mui/icons-material/Warning';
import PersonalInfoForm from './PersonalInfoForm'; 
import EducationForm from './EducationForm'; 
import WorkExperienceForm from './WorkExperienceForm'; 
import CombinedForm from './CombinedForm'; 
import { useRouter } from 'next/navigation';  
import theme from '@/app/theme';

const initialValues = {
  firstname: '',
  lastname: '',
  email: '',
  nationality: '',
  phoneNumber: '',
  dateofBirth: '',
  linkedIn: '',
  personalWebsite: '',
  sex: '',
  placeofBirth:'',
  address: '',
  city: '',
  zip: '',
  hasWorkExp: true,
  education: [{
    schoolName: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    ongoing: true,
    achievements: [''],
  }],
  workExperience: [{
    companyName: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    ongoing: true,
    responsibilities: [''],
  }],
  skills: [],
  languages: [],
  hobbies: [],
};

const Form = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState(initialValues);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();
  const t = useTranslations('cvform');
  const v = useTranslations('validation');

  const formSteps = [
    { label: t('steps.personalInfo'), component: PersonalInfoForm, validationFunction: validatePersonalInfo },
    { label: t('steps.education'), component: EducationForm, validationFunction: validateEducation},
    { label: t('steps.workExperience'), component: WorkExperienceForm, validationFunction: validateWorkExperience},
    { label: t('steps.additional'), component: CombinedForm, validationFunction: validateCombinedForm},
  ];

  const [stepStatus, setStepStatus] = useState(formSteps.map(() => ({ validated: false, error: false })));

  useEffect(() => {
    const savedStep = localStorage.getItem('currentFormStep');
    if (savedStep) {
      setCurrentStep(parseInt(savedStep, 10));
    }

    const userId = localStorage.getItem('cvUserId');
    if (userId) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/cvedit/fetchCV?userId=${userId}`);
          if (response.ok) {
            const data = await response.json();
            setFormValues(adaptFormData(data));
            console.log('CV data fetched and adapted from the server:', data);
          } else {
            throw new Error('Failed to fetch CV data');
          }
        } catch (error) {
          console.error("Error fetching CV data:", error);
          const localData = getFormDataFromLocalStorage();
          if (localData) {
            setFormValues(localData);
            console.log('CV data loaded from local storage:', localData);
          }
        }
      };
  
      fetchData();
    } else {
      const localData = getFormDataFromLocalStorage();
      if (localData) {
        setFormValues(localData);
        console.log('CV data loaded from local storage:', localData);
      }
    }
  }, []);

  const saveFormDataToLocalStorage = (formData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('formData', JSON.stringify(formData));
    }
  };
  
  const getFormDataFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('formData');
      return data ? JSON.parse(data) : null;
    }
    return null;
  };

  function validatePersonalInfo(values) {
    let errors = {};
    if (!values.firstname) {
      errors.firstname = v('required.firstName');
    }
    if (!values.lastname) {
      errors.lastname = v('required.lastName');
    }
    if (!values.email) {
      errors.email = v('required.email');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = v('format.email');
    }
    if (!values.address) {
      errors.address = v('required.address');
    }
    if (!values.city) {
      errors.city = v('required.city');
    }
    if (!values.zip) {
      errors.zip = v('required.zipCode');
    }
    if (!values.nationality) {
      errors.nationality = v('required.nationality');
    }
    if (!values.phoneNumber) {
      errors.phoneNumber = v('required.phone');
    }
    if (!values.dateofBirth) {
      errors.dateofBirth = v('required.birthDate');
    }
    if (!values.sex) { 
      errors.sex = v('required.gender');
    }
    return errors;
  }

  function validateEducation(values) {
    let errors = {};
    if (!values.education || values.education.length === 0) {
      errors.education = v('education.required');
    } else {
      const educationErrors = values.education.map(edu => {
        const eduErrors = {};
        if (!edu.schoolName) eduErrors.schoolName = v('education.required.school');
        if (!edu.degree) eduErrors.degree = v('education.required.degree');
        if (!edu.fieldOfStudy) eduErrors.fieldOfStudy = v('education.required.field');
        if (!edu.startDate) eduErrors.startDate = v('education.required.startDate');
        if (edu.endDate && new Date(edu.endDate) < new Date(edu.startDate)) {
          eduErrors.endDate = v('education.dateOrder');
        }
        return Object.keys(eduErrors).length > 0 ? eduErrors : undefined;
      }).filter(Boolean);
      
      if (educationErrors.length > 0) {
        errors.education = educationErrors;
      }
    }
    return errors;
  }

  function validateWorkExperience(values) {
    let errors = {};
    if (values.hasWorkExp) {
      const workErrors = values.workExperience.map((exp, index) => {
        const expErrors = {};
        if (!exp.companyName) {
          expErrors.companyName = v('required.company');
        }
        if (!exp.position) {
          expErrors.position = v('required.position');
        }
        if (!exp.startDate) {
          expErrors.startDate = v('required.startDate');
        }
        if (exp.endDate && new Date(exp.endDate) < new Date(exp.startDate)) {
          expErrors.endDate = v('education.dateOrder');
        }
        return Object.keys(expErrors).length > 0 ? expErrors : undefined;
      }).filter(Boolean);

      if (workErrors.length > 0) {
        errors.workExperience = workErrors;
      }
    }
    return errors;
  }

  function validateCombinedForm(values) {
    const errors = {};
    if (!values.languages || values.languages.length === 0) {
      errors.languages = t('validation.minLanguages');
    }
    return errors;
  }

  const adaptFormData = (data) => {
    const convertDateToYYYYMMDD = (dateStr) => {
      if (!dateStr) return '';
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return '';
    };
  
    const convertDateToYYYYMM = (dateStr) => {
      if (!dateStr || dateStr.toLowerCase() === "en cours") return '';
      const parts = dateStr.split('/');
      if (parts.length === 2) {
        const [month, year] = parts;
        return `${year}-${month.padStart(2, '0')}`;
      }
      return dateStr;
    };

    return {
      ...data.personalInfo,
      placeofBirth: data.personalInfo.placeofBirth || '',
      dateofBirth: convertDateToYYYYMMDD(data.personalInfo.dateofBirth),
      education: data.education.map(edu => ({
        ...edu,
        startDate: convertDateToYYYYMM(edu.startDate),
        endDate: convertDateToYYYYMM(edu.endDate),
        ongoing: !edu.endDate || edu.endDate.toLowerCase() === "en cours",
        achievements: edu.achievements || [''],
      })),
      workExperience: data.workExperience.map(exp => ({
        ...exp,
        startDate: convertDateToYYYYMM(exp.startDate),
        endDate: convertDateToYYYYMM(exp.endDate),
        ongoing: !exp.endDate || exp.endDate.toLowerCase() === "en cours",
        responsibilities: exp.responsibilities || [''],
      })),
      skills: data.skills || [],
      languages: data.languages || [],
      hobbies: data.hobbies || [],
      hasWorkExp: data.workExperience && data.workExperience.length > 0,
    };
  };

  const handleNext = async (values, setSubmitting) => {
    const currentValidationFunction = formSteps[currentStep].validationFunction;
    const errors = currentValidationFunction(values);
    
    if (Object.keys(errors).length === 0) {
      if (currentStep < formSteps.length - 1) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentFormStep', nextStep.toString());
          saveFormDataToLocalStorage(values);
        }
        
        const newStepStatus = [...stepStatus];
        newStepStatus[currentStep] = { validated: true, error: false };
        setStepStatus(newStepStatus);
      } else {
        if (values.languages.length === 0) {
          setSnackbar({
            open: true,
            message: t('validation.minLanguages'),
            severity: 'error'
          });
          return;
        }

        try {
          const userId = localStorage.getItem('cvUserId');
          if (userId) {
            const response = await fetch('/api/cvedit/updateCV', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId, formData: values }),
            });

            if (!response.ok) {
              throw new Error('Failed to update CV');
            }
          }

          saveFormDataToLocalStorage(values);
          setSnackbar({
            open: true,
            message: t('messages.success'),
            severity: 'success'
          });
          router.push('/cvedit');
        } catch (error) {
          console.error('Error saving CV:', error);
          setSnackbar({
            open: true,
            message: t('messages.error'),
            severity: 'error'
          });
        }
      }
    } else {
      const newStepStatus = [...stepStatus];
      newStepStatus[currentStep] = { validated: false, error: true };
      setStepStatus(newStepStatus);
      setSnackbar({
        open: true,
        message: t('messages.fillRequired'),
        severity: 'error'
      });
    }
    setSubmitting(false);
  };

  const handleBack = (values) => {
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentFormStep', prevStep.toString());
      saveFormDataToLocalStorage(values);
    }
  };

  const handleStepClick = (step, values) => {
    setCurrentStep(step);
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentFormStep', step.toString());
      saveFormDataToLocalStorage(values);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenResetDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseResetDialog = () => {
    setOpenDialog(false);
  };

  const handleResetForm = (resetForm) => {
    resetForm();
    setOpenDialog(false);
    setStepStatus(formSteps.map(() => ({ validated: false, error: false })));
    setCurrentStep(0);
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentFormStep', '0');
      localStorage.removeItem('formData');
    }
  };

  return (
    <Formik
      initialValues={formValues}
      onSubmit={(values, { setSubmitting }) => handleNext(values, setSubmitting)}
      validate={(values) => {
        const currentValidationFunction = formSteps[currentStep].validationFunction;
        return currentValidationFunction(values);
      }}
      validateOnChange={true}
      validateOnBlur={true}
      enableReinitialize
    >
      {({ values, isSubmitting, resetForm, errors, touched, handleSubmit }) => (
        <FormikForm onSubmit={handleSubmit}>
          <Box sx={{ width: '100%', mb: 4, overflow: 'hidden' }}>
            <Stepper activeStep={currentStep} alternativeLabel>
              {formSteps.map((step, index) => (
                <Step key={step.label}>
                  <StepButton onClick={() => handleStepClick(index, values)}>
                    <StepLabel error={stepStatus[index].error}>
                      {step.label}
                    </StepLabel>
                  </StepButton>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box sx={{ position: 'relative', mb: 4 }}>
            {isSubmitting && (
              <LinearProgress sx={{ position: 'absolute', top: '-20px', left: 0, right: 0 }} />
            )}

            <Grid container spacing={2} sx={{ px: { xs: 2, sm: 0 } }}>
              {React.createElement(formSteps[currentStep].component, {
                errors,
                touched,
                values,
                currentStep,
                formSteps,
                handleNext,
                setSnackbar
              })}
            </Grid>
          </Box>

          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' }, 
            gap: { xs: 2, sm: 0 },
            mt: 3,
            px: { xs: 2, sm: 0 }
          }}>
            <Button
              onClick={() => handleBack(values)}
              disabled={currentStep === 0}
              startIcon={<ArrowBackIos />}
              fullWidth={true}
              sx={{ display: { xs: 'flex', sm: 'inline-flex' } }}
            >
              {t('buttons.previous')}
            </Button>

            <Button
              onClick={handleOpenResetDialog}
              color="error"
              startIcon={<WarningIcon />}
              fullWidth={true}
              sx={{ display: { xs: 'flex', sm: 'inline-flex' } }}
            >
              {t('buttons.reset')}
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || (currentStep === formSteps.length - 1 && (!values.languages || values.languages.length === 0))}
              endIcon={currentStep === formSteps.length - 1 ? null : <ArrowForwardIos />}
              fullWidth={true}
              sx={{ 
                display: { xs: 'flex', sm: 'inline-flex' },
                '&.Mui-disabled': {
                  backgroundColor: theme.palette.grey[300],
                  color: theme.palette.grey[500]
                }
              }}
            >
              {currentStep === formSteps.length - 1 ? t('buttons.submit') : t('buttons.next')}
            </Button>
          </Box>

          <Dialog open={openDialog} onClose={handleCloseResetDialog}>
            <DialogTitle>{t('messages.resetConfirm')}</DialogTitle>
            <DialogActions>
              <Button onClick={handleCloseResetDialog}>{t('buttons.cancel')}</Button>
              <Button onClick={() => handleResetForm(resetForm)} color="error">
                {t('buttons.reset')}
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar 
            open={snackbar.open} 
            autoHideDuration={6000} 
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </FormikForm>
      )}
    </Formik>
  );
};

export default Form;