import React, { useState } from 'react';
import { Formik, Form as FormikForm } from 'formik';
import { Button, LinearProgress, Typography, Grid} from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import PersonalInfoForm from './PersonalInfoForm'; 
import EducationForm from './EducationForm'; 
import WorkExperienceForm from './WorkExperienceForm'; 
import CombinedForm from './CombinedForm'; 
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';



const formSteps = [
    { label: "Informations Personnelles", component: PersonalInfoForm, validationFunction: validatePersonalInfo },
    { label: "Éducation", component: EducationForm, validationFunction: validateEducation},
    { label: "Expérience Professionnelle", component: WorkExperienceForm, validationFunction: validateWorkExperience},
    { label: "Langues, Compétences, Loisirs, Références", component: CombinedForm, validationFunction: validateCombinedForm},
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
    if (values.linkedIn && !/^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.linkedIn)) {
      errors.linkedIn = 'L\'URL LinkedIn est invalide';
    }
    if (values.personalWebsite && !/^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.personalWebsite)) {
      errors.personalWebsite = 'L\'URL du site personnel est invalide';
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
    if (values.workExperience && values.workExperience.length > 0) {
      const workExperienceErrors = values.workExperience.map(exp => {
        const expErrors = {};
        if (!exp.companyName) expErrors.companyName = 'Le nom de l\'entreprise est obligatoire';
        if (!exp.position) expErrors.position = 'Le poste est obligatoire';
        if (!exp.startDate) expErrors.startDate = 'La date de début est obligatoire';
        if (exp.endDate && new Date(exp.endDate) < new Date(exp.startDate)) expErrors.endDate = 'La date de fin doit être après la date de début';
        if (!exp.responsibilities || exp.responsibilities.length === 0) expErrors.responsibilities = 'Les responsabilités sont obligatoires';
        return expErrors;
      });
      if (workExperienceErrors.some(e => Object.keys(e).length > 0)) errors.workExperience = workExperienceErrors;
    }
    return errors;
  }
  
  function validateCombinedForm(values) {
    let errors = {};
    if (!values.languages || values.languages.length === 0) {
      errors.languages = 'Au moins une langue est obligatoire';
    } else {
      const languageErrors = values.languages.map(lang => {
        const langErrors = {};
        if (!lang.language) langErrors.language = 'La langue est obligatoire';
        if (!lang.proficiency) langErrors.proficiency = 'La compétence linguistique est obligatoire';
        return langErrors;
      });
      if (languageErrors.some(e => Object.keys(e).length > 0)) errors.languages = languageErrors;
    }
    
    return errors;
  }
  


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
    placeOfBirth:'',
    address: '',
    city: '',
    zip: '',
    // Professional Summary
    professionalSummary: '',
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

  
const Form = () => {
  // Your existing useState hooks
  const [currentStep, setCurrentStep] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  // Your form validation functions remain unchanged

  const handleNext = async (values, actions) => {
      const currentValidationFunc = formSteps[currentStep]?.validationFunction;
      const errors = currentValidationFunc ? currentValidationFunc(values) : {};

      if (Object.keys(errors).length === 0) {
          if (currentStep < formSteps.length - 1) {
              setCurrentStep(currentStep + 1);
          } else {
              // Show the Snackbar immediately after the last step's successful validation
              setOpenSnackbar(true);
              
              // Simulate form submission logic here
              try {
                  // Simulated delay for async operation (e.g., API call)
                  setTimeout(() => {
                      console.log("Form submission logic goes here.");
                      
                      // Assuming form submission is successful
                      // Close the Snackbar and redirect
                      setOpenSnackbar(false); // Close the Snackbar
                      router.push('/cvedit'); // Redirect
                  }, 2000); // Simulate async delay
              } catch (error) {
                  console.error('Submission error:', error);
                  actions.setSubmitting(false);
              }
          }
      }
  };


    return (
      <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleNext}
        enableReinitialize
      >
        {({ isSubmitting, handleSubmit, values }) => (
          <FormikForm onSubmit={handleSubmit}>
            <Typography variant="h5" style={{ color: theme.palette.primary.main }}>
              {formSteps[currentStep].label}
            </Typography>
            <LinearProgress variant="determinate" value={(currentStep / formSteps.length) * 100} className="mb-4" />
  
            {React.createElement(formSteps[currentStep].component, { values })}
  
            <Grid container justifyContent="space-between" spacing={2} className="mt-4">
              {currentStep > 0 && (
                <Grid item>
                  <Button startIcon={<ArrowBackIosNew />} onClick={() => setCurrentStep(currentStep - 1)} disabled={isSubmitting}>
                    Précédent
                  </Button>
                </Grid>
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
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                message="CV submitted successfully! Redirecting..."
            />
    </>
    );
  };
  
  export default Form;