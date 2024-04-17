"use client";
import React, { useState, useEffect } from 'react';
import { Formik, Form as FormikForm } from 'formik';
import { Button, Box, LinearProgress, Typography, Grid, Snackbar, Alert, Stepper, Step, StepLabel, StepButton} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos  } from '@mui/icons-material';
import PersonalInfoForm from './PersonalInfoForm'; 
import EducationForm from './EducationForm'; 
import WorkExperienceForm from './WorkExperienceForm'; 
import CombinedForm from './CombinedForm'; 
import { useRouter } from 'next/navigation';
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
  hasWorkExp: true,
  // Education
  education: [{
    schoolName: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    ongoing: true,
    achievements: [''],
  }],
  // Work Experience
  workExperience: [{
    companyName: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    ongoing: true,
    responsibilities: [''],
  }],
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
    if (values.hasWorkExp) { // Only validate if hasWorkExp is true
      values.workExperience.forEach((exp, index) => {
        let expErrors = {};
        if (!exp.companyName) {
          expErrors.companyName = 'Le nom de l\'entreprise est obligatoire';
        }
        if (!exp.position) {
          expErrors.position = 'Le poste est obligatoire';
        }
        if (!exp.startDate) {
          expErrors.startDate = 'La date de début est obligatoire';
        }
        if (exp.endDate && new Date(exp.endDate) < new Date(exp.startDate)) {
          expErrors.endDate = 'La date de fin doit être après la date de début';
        }
        if (Object.keys(expErrors).length) {
          if (!errors.workExperience) errors.workExperience = [];
          errors.workExperience[index] = expErrors;
        }
      });
    }
    return errors; // Return an empty object if hasWorkExp is false
  }
  
  

  
  function validateCombinedForm(values) {
    const errors = {};
    if (!values.languages || values.languages.length === 0) {
        errors.languages = { global: 'Au moins une langue est obligatoire' };
    } else {
        const languageErrors = values.languages.map(lang => {
            const langErrors = {};
            if (!lang.language) {
                langErrors.language = 'Le nom de la langue est obligatoire';
            }
            if (!lang.proficiency) {
                langErrors.proficiency = 'Le niveau de maîtrise est obligatoire';
            }
            return langErrors;
        }).filter(langError => Object.keys(langError).length > 0);

        if (languageErrors.length > 0) {
            errors.languages = languageErrors;
        }
    }
    return errors;
}




  
  const Form = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formValues, setFormValues] = useState(initialValues);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [stepStatus, setStepStatus] = useState(formSteps.map(() => ({ validated: false, error: false })));
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
        hasWorkExp: data.workExperience.length > 0,
    };
};

const handleSubmitForm = async (values, { setSubmitting, setErrors }) => {
  let userId = localStorage.getItem('cvUserId');
  const isUpdate = Boolean(userId);
  let endpoint = isUpdate ? `/api/cvgen/updateCV?userId=${userId}` : `/api/cvgen/submitCV`;
  let method = isUpdate ? 'PUT' : 'POST';

  console.log("Final submission values:", values);

  let validationErrors = formSteps[currentStep]?.validationFunction(values);
  if (Object.keys(validationErrors).length !== 0) {
    console.log("Validation errors:", validationErrors);
    setErrors(validationErrors);
    setSnackbar({ open: true, message: 'Veuillez corriger les erreurs avant de soumettre.', severity: 'error' });
    setSubmitting(false);
    return;
  }

  const fetchOptions = {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  };

  try {
    setSubmitting(true);
    let response = await fetch(endpoint, fetchOptions);
    if (!response.ok) {
      // If PUT failed and it was an update attempt, try POST instead
      if (isUpdate) {
        console.log('PUT failed, attempting POST');
        endpoint = `/api/cvgen/submitCV`;
        method = 'POST';
        response = await fetch(endpoint, { ...fetchOptions, method });
      }
      // Re-throw the error if it's still not OK
      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message || 'Failed to submit CV');
      }
    }
    const responseData = await response.json();
    if (!userId && responseData.data && responseData.data.userId) {
      userId = responseData.data.userId;
      localStorage.setItem('cvUserId', userId);
    }
    setSnackbar({ open: true, message: 'CV enregistré avec succès!', severity: 'success' });
    console.log('CV submitted successfully:', responseData.data);
    router.push('/cvedit');
  } catch (error) {
    console.error('Error submitting CV:', error);
    setSnackbar({ open: true, message: 'Erreur lors de la soumission du CV.', severity: 'error' });
  } finally {
    setSubmitting(false);
  }
};



    
const handleNext = async (values, actions) => {
  if (!actions) {
    console.error('Formik actions are not passed to handleNext function.');
    return;
  }

  const { setErrors } = actions;
  saveFormDataToLocalStorage(values); // Save current form state to local storage

  let validationErrors = {};

  // Skip validation for work experience if hasWorkExp is false
  if (currentStep === formSteps.findIndex(step => step.label === "Expérience Professionnelle (max. 4)")) {
    if (values.hasWorkExp) {
      validationErrors = formSteps[currentStep]?.validationFunction(values);
    } else {
      // Clear any existing errors if skipping
      setErrors({});
    }
  } else {
    validationErrors = formSteps[currentStep]?.validationFunction(values);
  }

  setErrors(validationErrors);

  if (Object.keys(validationErrors).length === 0) {
    if (currentStep + 1 < formSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmitForm(values, actions);
    }
  } else {
    setSnackbar({
      open: true,
      message: 'Vous devez remplir tous les champs obligatoires avant de passer à l\'étape suivante.',
      severity: 'error'
    });
  }
};






const handleStepClick = (index) => {
  if (index <= currentStep) {
    setCurrentStep(index);
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
          <Box sx={{ overflow: 'hidden' }}>
          <Stepper activeStep={currentStep} alternativeLabel>
            {formSteps.map((step, index) => (
              <Step key={step.label}>
                <StepButton
                  onClick={() => handleStepClick(index)}
                  style={{ cursor: index <= currentStep ? 'pointer' : 'default' }}
                >
                  <StepLabel error={stepStatus[index].error}>{step.label}</StepLabel>
                </StepButton>
              </Step>
            ))}
          </Stepper>

          </Box>
          <LinearProgress variant="determinate" value={(currentStep / formSteps.length) * 100} className="mb-10" />
          <Typography variant="h5" style={{ color: theme.palette.primary.main }}>
            {formSteps[currentStep].label}
          </Typography>
          <Typography variant="body2" style={{ color: theme.palette.primary.alt, marginBottom: 7 }}>* : champs requis</Typography>
          {currentStep === formSteps.findIndex(step => step.label === "Expérience Professionnelle (max. 4)") ?
              <WorkExperienceForm handleNext={handleNext} setSnackbar={setSnackbar} /> :
              React.createElement(formSteps[currentStep].component, { onNext: handleNext, values, setErrors})
            }

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