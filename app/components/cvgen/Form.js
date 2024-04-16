"use client";
import React, { useState, useEffect } from 'react';
import { Formik, Form as FormikForm } from 'formik';
import { Button, Box, LinearProgress, Typography, Grid, Snackbar, Alert, Stepper, Step, StepLabel} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos  } from '@mui/icons-material';
import PersonalInfoForm from './PersonalInfoForm'; 
import EducationForm from './EducationForm'; 
import WorkExperienceForm from './WorkExperienceForm'; 
import CombinedForm from './CombinedForm'; 
import { useRouter } from 'next/navigation';
import { format, parse } from 'date-fns';
import theme from '@/app/theme';


const initialValues = {
  // Personal Information
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
  // Education
  education: [{
    schoolName: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    ongoing: false,
    achievements: [''],
  }],
  // Work Experience
  workExperience: [{
    companyName: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    ongoing: false,
    responsibilities: [''],
  }],
  noExperience: false,
  // Combined Form
  skills: [],
  languages: [],
  hobbies: [],
};

const formSteps = [
    { label: "Informations Personnelles", component: PersonalInfoForm, validationFunction: validatePersonalInfo },
    { label: "Éducation (max. 4)", component: EducationForm, validationFunction: validateEducation},
    { label: "Expérience Professionnelle (max. 4)", component: WorkExperienceForm, validationFunction: validateWorkExperience},
    { label: "Langues, Compétences, Loisirs", component: CombinedForm, validationFunction: validateCombinedForm},
];

function validatePersonalInfo(values) {
    let errors = {};
    if (!values.firstname) {
      errors.firstname = 'Le prénom est obligatoire';
    }
    if (!values.lastname) {
      errors.lastname = 'Le nom est obligatoire';
    }
    if (!values.email) {
      errors.email = 'L\'email est obligatoire';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'L\'email est invalide';
    }
    if (!values.address) {
      errors.address = 'L\'adresse est obligatoire';
    }
    if (!values.city) {
      errors.city = 'La ville est obligatoire';
    }
    if (!values.zip) {
      errors.zip = 'Le code postal est obligatoire';
    }
    if (!values.nationality) {
      errors.nationality = 'La nationalité est obligatoire';
    }
    if (!values.phoneNumber) {
      errors.phoneNumber = 'Le numéro de téléphone est obligatoire';
    }
    if (!values.dateofBirth) {
      errors.dateofBirth = 'La date de naissance est obligatoire';
    }
    if (!values.sex) { 
      errors.sex = 'Le sexe est obligatoire';
    }
    return errors;
  }

  function validateEducation(values) {
    let errors = {};
    if (!values.education || values.education.length === 0) {
      errors.education = 'Au moins une formation est obligatoire';
    } else {
      const educationErrors = values.education.map(edu => {
        const eduErrors = {};
        if (!edu.schoolName) eduErrors.schoolName = 'Le nom de l\'école est obligatoire';
        if (!edu.degree) eduErrors.degree = 'Le diplôme est obligatoire';
        if (!edu.fieldOfStudy) eduErrors.fieldOfStudy = 'Le domaine d\'étude est obligatoire';
        if (!edu.startDate) eduErrors.startDate = 'La date de début est obligatoire';
        if (edu.endDate && new Date(edu.endDate) < new Date(edu.startDate)) eduErrors.endDate = 'La date de fin doit être après la date de début';
        return eduErrors;
      });
      if (educationErrors.some(e => Object.keys(e).length > 0)) errors.education = educationErrors;
    }
    return errors;
  }

  
  function validateWorkExperience(values) {
    let errors = {};
    if (values.skipWorkExperience) {
      return errors;
    }
    if (values.workExperience && values.workExperience.length > 0) {
      const workExperienceErrors = values.workExperience.map(exp => {
        const expErrors = {};
        if (!exp.companyName) expErrors.companyName = 'Le nom de l\'entreprise est obligatoire';
        if (!exp.position) expErrors.position = 'Le poste est obligatoire';
        if (!exp.startDate) expErrors.startDate = 'La date de début est obligatoire';
        if (exp.endDate && new Date(exp.endDate) < new Date(exp.startDate)) expErrors.endDate = 'La date de fin doit être après la date de début';

        return expErrors;
      });
      if (workExperienceErrors.some(e => Object.keys(e).length > 0)) errors.workExperience = workExperienceErrors;
    }
    return errors;
  }
  
  function validateCombinedForm(values) {
    const errors = {};
    if (!values.languages || values.languages.length === 0) {
        errors.languages = 'Au moins une langue est obligatoire';
    } else {
        const languageErrors = values.languages.map(lang => {
            if (!lang.language || !lang.proficiency) {
                return 'Toutes les langues doivent inclure le niveau de maîtrise';
            }
            return '';
        }).filter(error => error !== '');

        if (languageErrors.length > 0) {
            errors.languages = languageErrors.join(', ');
        }
    }
    return errors;
}

  
  const Form = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formValues, setFormValues] = useState(initialValues);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const router = useRouter();

    const saveFormDataToLocalStorage = (formData) => {
      localStorage.setItem('formData', JSON.stringify(formData));
    };
    
    const getFormDataFromLocalStorage = () => {
      const data = localStorage.getItem('formData');
      return data ? JSON.parse(data) : null;
    };


    useEffect(() => {
      const userId = localStorage.getItem('cvUserId');
      if (userId) {
        const fetchData = async () => {
          try {
            const response = await fetch(`/api/cvedit/fetchCV?userId=${userId}`);
            if (response.ok) {
              const data = await response.json();
              setFormValues(adaptFormData(data));  // Assuming data needs to be adapted as per your existing function
              console.log('CV data fetched and adapted from the server:', data);
            } else {
              throw new Error('Failed to fetch CV data');
            }
          } catch (error) {
            console.error("Error fetching CV data:", error);
            const localData = getFormDataFromLocalStorage(); // Fallback to local storage if fetch fails
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
        return dateStr; // In case the date is already in the correct format or different handling is needed
    };

    return {
        ...data.personalInfo,
        placeofBirth: data.personalInfo.placeofBirth || '',
        dateofBirth: convertDateToYYYYMMDD(data.personalInfo.dateofBirth),
        education: data.education.map(edu => ({
            ...edu,
            startDate: convertDateToYYYYMM(edu.startDate),
            endDate: edu.ongoing ? '' : convertDateToYYYYMM(edu.endDate),
        })),
        workExperience: data.workExperience.map(exp => ({
            ...exp,
            startDate: convertDateToYYYYMM(exp.startDate),
            endDate: exp.ongoing ? '' : convertDateToYYYYMM(exp.endDate),
        })),
        skills: data.skills,
        languages: data.languages,
        hobbies: data.hobbies,
    };
};

const handleSubmitForm = async (values, { setSubmitting }) => {
  let userId = localStorage.getItem('cvUserId');
  const isUpdate = Boolean(userId); // Check if it's an update operation
  const endpoint = isUpdate ? `/api/cvgen/updateCV?userId=${userId}` : '/api/cvgen/submitCV';
  const method = isUpdate ? 'PUT' : 'POST';

  try {
      setSubmitting(true); // Set submitting state before async operation
      const response = await fetch(endpoint, {
          method: method,
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
      });

      const responseData = await response.json();
      if (!response.ok) {
          if (response.status === 404 && isUpdate) {
              // Handle specific case where update may fall through
              console.error('Creating new CV entry');
              localStorage.removeItem('cvUserId'); // Remove outdated userId
              return handleSubmitForm(values, { setSubmitting }); // Recursive call as a new submission
          }
          throw new Error(responseData.message || 'Failed to submit CV');
      }

      if (!userId && responseData.data && responseData.data.userId) {
          userId = responseData.data.userId; // Set new userId if received
          localStorage.setItem('cvUserId', userId); // Store new userId in localStorage
          console.log('New userId stored:', userId);
      }

      setSnackbar({ open: true, message: 'CV enregistré avec succès!', severity: 'success' });
      router.push('/cvedit'); // Redirect on success
  } catch (error) {
      console.error('Error submitting CV:', error);
      setSnackbar({ open: true, message: 'Erreur lors de la soumission du CV.', severity: 'error' });
  } finally {
      setSubmitting(false); // Reset submitting state after operation
  }
};

    
    
    
const handleNext = async (values, actions, additionalData = {}) => {
  const { setErrors } = actions;
  if (additionalData.skipWorkExperience) {
      values.skipWorkExperience = true;
      saveFormDataToLocalStorage(values);
      if (currentStep + 1 < formSteps.length) {
          setCurrentStep(currentStep + 1);
      }
      return;
  }

  let validationErrors = formSteps[currentStep]?.validationFunction ? formSteps[currentStep].validationFunction(values) : {};
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length === 0) {
      saveFormDataToLocalStorage(values);
      if (currentStep + 1 < formSteps.length) {
          setCurrentStep(currentStep + 1);
      } else {
          handleSubmitForm(values, actions); // Consider adding a final submission handling here
      }
  } else {
      setSnackbar({
          open: true,
          message: 'Vous devez remplir tous les champs obligatoires avant de passer à l\'étape suivante.',
          severity: 'error'
      });
  }
};
  
    

const handleBack = () => {
  saveFormDataToLocalStorage(formValues);
  setCurrentStep(currentStep - 1);
};



return (
  <>
    <Formik
      initialValues={formValues}
      onSubmit={(values, actions) => handleNext(values, actions)}
      enableReinitialize
    >
      {({ isSubmitting, handleSubmit, values, setErrors }) => (
        <FormikForm onSubmit={handleSubmit}>
          <Box sx={{ overflowX: 'auto' }}>
            <Stepper activeStep={currentStep} alternativeLabel>
              {formSteps.map((step, index) => (
                <Step key={step.label} onClick={() => setCurrentStep(index)}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          <LinearProgress variant="determinate" value={(currentStep / formSteps.length) * 100} className="mb-10" />
          <Typography variant="h5" style={{ color: theme.palette.primary.main }}>
            {formSteps[currentStep].label}
          </Typography>
          <Typography variant="body2" style={{ color: theme.palette.primary.alt, marginBottom: 7 }}>* : champs requis</Typography>
          {React.createElement(formSteps[currentStep].component, { onNext: handleNext, values })}

          <Grid container justifyContent="space-between" spacing={2} className="mt-4">
            {currentStep > 0 && (
              <Button onClick={handleBack} disabled={isSubmitting} startIcon={<ArrowBackIos />}>
                Précédent
              </Button>
            )}
            <Grid item style={{ marginLeft: 'auto' }}>
              <Button
                endIcon={<ArrowForwardIos />}
                type="submit"
                variant="contained"
                style={{ backgroundColor: theme.palette.primary.main, color: '#FFFFFF' }}
                disabled={isSubmitting}
              >
                {currentStep === formSteps.length - 1 ? 'Soumettre' : 'Suivant'}
              </Button>
            </Grid>
          </Grid>
        </FormikForm>
      )}
    </Formik>
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  </>
);
};

export default Form;