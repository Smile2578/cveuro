"use client";
import React, { useState, useEffect } from 'react';
import { Formik, Form as FormikForm } from 'formik';
import { Button, LinearProgress, Typography, Grid, Snackbar, Alert} from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import PersonalInfoForm from './PersonalInfoForm'; 
import EducationForm from './EducationForm'; 
import WorkExperienceForm from './WorkExperienceForm'; 
import CombinedForm from './CombinedForm'; 
import { useRouter } from 'next/navigation';
import { format, parse, parseISO } from 'date-fns';
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

const formSteps = [
    { label: "Informations Personnelles", component: PersonalInfoForm, validationFunction: validatePersonalInfo },
    { label: "Éducation (maximum 4)", component: EducationForm, validationFunction: validateEducation},
    { label: "Expérience Professionnelle (maximum 4)", component: WorkExperienceForm, validationFunction: validateWorkExperience},
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
  
  const Form = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formValues, setFormValues] = useState(initialValues);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const router = useRouter();
  
    useEffect(() => {
      const userId = localStorage.getItem('cvUserId');
      if (userId) {
        fetchCVData(userId);
      }
    }, []);
  
    const fetchCVData = async (userId) => {
      try {
        const response = await fetch(`/api/cvedit/fetchCV?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch CV data');
        const data = await response.json();
        console.log('CV data fetched:', data);
        const adaptedData = adaptFormData(data);
        console.log('CV adapteddata fetched:', adaptedData);
        setFormValues(adaptedData);
      } catch (error) {
        console.error("Error fetching CV data:", error);
        setSnackbar({ open: true, message: 'Erreur lors de la récupération des données du CV.', severity: 'error' });
      }
    };
  
    const safeFormatDate = (dateString, outputFormat = "yyyy-MM-dd") => {
      if (!dateString) return '';
    
      // List of potential date formats your data might be in
      const inputFormats = ["yyyy-MM-dd", "dd-MM-yyyy", "MM/yyyy"];
    
      let parsedDate;
      for (let format of inputFormats) {
        parsedDate = parse(dateString, format, new Date());
        if (!Number.isNaN(parsedDate.getTime())) {
          break;
        }
      }
    
      if (Number.isNaN(parsedDate.getTime())) {
        console.error(`Error formatting date: Invalid date: ${dateString}`);
        return '';
      } else {
        return format(parsedDate, outputFormat);
      }
    };
    
    const adaptFormData = (data) => {
      const convertDateToYYYYMMDD = (dateStr) => {
        if (!dateStr) return '';
        // Expected input format: DD/MM/YYYY
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          const [day, month, year] = parts;
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return '';
      };
    
      const adaptStartDateAndEndDate = (dateStr) => {
        // If the date is "En cours", return as is to indicate ongoing.
        if (dateStr === "En cours") return dateStr;
    
        // Otherwise, ensure the date is in the expected "YYYY-MM" format for the form inputs.
        // This accounts for dates already in "YYYY-MM" format or empty.
        const regex = /^\d{4}-\d{2}$/;
        if (regex.test(dateStr) || dateStr === '') {
          return dateStr;
        }
        // If the date does not match the expected formats, log an error or handle accordingly.
        console.error(`Unexpected date format: ${dateStr}`);
        return '';
      };
    
      return {
        ...data.personalInfo,
        placeofBirth: data.personalInfo.placeofBirth || '',
        dateofBirth: convertDateToYYYYMMDD(data.personalInfo.dateofBirth),
        education: data.education.map(edu => ({
          ...edu,
          startDate: adaptStartDateAndEndDate(edu.startDate),
          endDate: edu.ongoing ? '' : adaptStartDateAndEndDate(edu.endDate),
        })),
        workExperience: data.workExperience.map(exp => ({
          ...exp,
          startDate: adaptStartDateAndEndDate(exp.startDate),
          endDate: exp.ongoing ? '' : adaptStartDateAndEndDate(exp.endDate),
        })),
        skills: data.skills,
        languages: data.languages,
        hobbies: data.hobbies,
      };
    };

    const handleSubmitForm = async (values, { setSubmitting }) => {
      let userId = localStorage.getItem('cvUserId');
      const method = userId ? 'PUT' : 'POST';
      const url = userId ? `/api/cvgen/updateCV?userId=${userId}` : '/api/cvgen/submitCV';
    
      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
    
        if (!response.ok) throw new Error('Failed to submit CV');
        const responseData = await response.json();
        
        console.log('Server response:', responseData); // Log the entire server response
    
        // Assuming the server response structure matches what's been shown
        if (!userId && responseData.data && responseData.data.userId) {
          userId = responseData.data.userId;
          localStorage.setItem('cvUserId', userId);
          console.log('New userId stored:', userId); // Confirm the userId is captured and stored
        }
    
        setSnackbar({ open: true, message: 'CV enregistré avec succès!', severity: 'success' });
        setSubmitting(false);
        console.log('CV submitted successfully', values, 'userId:', userId);
        router.push('/cvedit');
      } catch (error) {
        console.error('Error submitting CV:', error);
        setSnackbar({ open: true, message: 'Erreur lors de la soumission du CV.', severity: 'error' });
        setSubmitting(false);
      }
    };
    



    const handleNext = async (values, actions, skipWorkExperience = false) => {
      if (skipWorkExperience) {
        values.skipWorkExperience = true;
      }
    
      const currentValidationFunc = formSteps[currentStep]?.validationFunction;
      const validationErrors = currentValidationFunc ? currentValidationFunc(values) : {};
    
      actions.setErrors(validationErrors);
    
      if (Object.keys(validationErrors).length === 0) {
        if (currentStep < formSteps.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          await handleSubmitForm(values, actions);
        }
      }
    };


    return (
      <>
      <Formik
        initialValues={formValues}
        onSubmit={handleNext}
        enableReinitialize
      >
        {({ isSubmitting, handleSubmit, values, setErrors}) => (
          <FormikForm onSubmit={handleSubmit}>
            <Typography variant="h5" style={{ color: theme.palette.primary.main }}>
              {formSteps[currentStep].label}
            </Typography>
            <LinearProgress variant="determinate" value={(currentStep / formSteps.length) * 100} className="mb-4" />
  
            {React.createElement(formSteps[currentStep].component, { 
                onNext: (data) => handleNext(values, { setErrors }, data.skipWorkExperience),
                values 
            })}
  
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