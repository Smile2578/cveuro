"use client";
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Tabs,
  Tab,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEditValidators } from '@/app/utils/editValidators';

// Import des formulaires de CVGen
import IdentityForm from '../../cvgen/personal-info/IdentityForm';
import AddressForm from '../../cvgen/personal-info/AddressForm';
import ContactForm from '../../cvgen/personal-info/ContactForm';
import InfoForm from '../../cvgen/personal-info/InfoForm';
import SocialForm from '../../cvgen/personal-info/SocialForm';
import EducationForm from '../../cvgen/education/EducationForm';
import WorkExperienceForm from '../../cvgen/work-experience/WorkExperienceForm';
import LanguagesForm from '../combined-form/LanguagesForm';
import HobbiesForm from '../combined-form/HobbiesForm';
import SkillsForm from '../combined-form/SkillsForm';

const EditDialog = ({ 
  open, 
  onClose, 
  section, 
  data, 
  onSave,
  locale 
}) => {
  const t = useTranslations('cvedit');
  const tValidation = useTranslations('validation');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [personalInfoTab, setPersonalInfoTab] = useState('identity');
  const [initialData, setInitialData] = useState(null);
  const [dirtyFields, setDirtyFields] = useState({});
  const [hasContentChanged, setHasContentChanged] = useState(false);

  const { createPartialSchema } = createEditValidators(tValidation);

  // Restructure les données pour correspondre au format CVGen
  const restructureData = (data) => {
    if (!data) return {};

    let restructured;
    if (section === 'personalInfo') {
      restructured = {
        personalInfo: {
          ...data,
          firstname: data.firstname || '',
          lastname: data.lastname || '',
          sex: data.sex || '',
          dateofBirth: data.dateofBirth || '',
          placeofBirth: data.placeofBirth || '',
          nationality: data.nationality || [],
          address: data.address || '',
          city: data.city || '',
          zip: data.zip || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          linkedIn: data.linkedIn || '',
          personalWebsite: data.personalWebsite || ''
        }
      };
    } else if (section === 'education') {
      const educationData = Array.isArray(data) ? data : [];
      restructured = {
        educations: educationData
      };
    } else if (section === 'workExperience') {
      const workData = Array.isArray(data) ? data : [];
      restructured = {
        workExperience: {
          hasWorkExperience: data?.hasWorkExperience ?? workData.length > 0,
          experiences: workData
        }
      };
    } else if (['skills', 'languages', 'hobbies'].includes(section)) {
      restructured = {
        [section]: Array.isArray(data) ? data : []
      };
    } else {
      restructured = { [section]: data || [] };
    }

    return restructured;
  };

  // Aplatit les données pour les renvoyer au format de l'éditeur
  const flattenData = (formData) => {
    let flattened;
    if (section === 'personalInfo') {
      flattened = formData.personalInfo;
    } else if (section === 'education') {
      flattened = formData.educations;
    } else if (section === 'workExperience') {
      flattened = {
        hasWorkExperience: formData.workExperience.hasWorkExperience,
        experiences: formData.workExperience.experiences
      };
    } else if (['skills', 'languages', 'hobbies'].includes(section)) {
      flattened = formData[section];
    } else {
      flattened = formData[section];
    }

    return flattened;
  };

  const methods = useForm({
    resolver: zodResolver(createPartialSchema(section)),
    defaultValues: restructureData(data),
    mode: 'onBlur',
    criteriaMode: 'all'
  });

  const { formState, trigger, getValues, watch, reset, setError } = methods;
  const { errors, isValid, isDirty } = formState;

  // Réinitialiser le formulaire quand les données changent
  useEffect(() => {
    if (open && data) {
      const restructuredData = restructureData(data);
      reset(restructuredData);
      setInitialData(restructuredData);
      setDirtyFields({});
      setHasContentChanged(false);
    }
  }, [open, data, reset]);

  // Surveiller les changements de champs
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === 'change' && name) {
        // Marquer le champ comme modifié
        const fieldName = name.split('.').pop();
        setDirtyFields(prev => ({
          ...prev,
          [fieldName]: true
        }));
        
        // Vérifier si le contenu a changé
        const currentData = getValues();
        const currentValue = section === 'personalInfo' ? currentData.personalInfo : currentData[section];
        const initialValue = section === 'personalInfo' ? initialData?.personalInfo : initialData?.[section];
        
        setHasContentChanged(JSON.stringify(currentValue) !== JSON.stringify(initialValue));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, section, initialData, getValues]);

  const handleSave = async () => {
    try {
      const formData = getValues();
      let dataToValidate;

      // Préparer les données pour la validation
      if (section === 'personalInfo') {
        dataToValidate = formData.personalInfo;
      } else if (section === 'education') {
        dataToValidate = formData.educations.map(edu => ({
          ...edu,
          endDate: edu.ongoing ? null : edu.endDate || null
        }));
      } else if (section === 'workExperience') {
        dataToValidate = formData.workExperience.experiences.map(exp => ({
          ...exp,
          endDate: exp.ongoing ? null : exp.endDate || null,
          ongoing: exp.ongoing || false
        }));
      } else {
        dataToValidate = formData[section];
      }
      
      // Valider le formulaire complet
      const validationSchema = createPartialSchema(section);
      const validationResult = await validationSchema.safeParseAsync(dataToValidate);

      if (!validationResult.success) {
        // Convertir les erreurs Zod en format compatible avec react-hook-form
        validationResult.error.errors.forEach(error => {
          const fieldPath = error.path;
          let fieldName;
          
          if (section === 'personalInfo') {
            fieldName = `personalInfo.${fieldPath.join('.')}`;
          } else if (section === 'education') {
            fieldName = `educations.${fieldPath.join('.')}`;
          } else if (section === 'workExperience') {
            fieldName = `workExperience.experiences.${fieldPath.join('.')}`;
          } else {
            fieldName = `${section}.${fieldPath.join('.')}`;
          }
            
          setError(fieldName, {
            type: error.code,
            message: error.message
          });
        });
        return;
      }

      const flattenedData = flattenData(formData);
      onSave(flattenedData);
      onClose();
    } catch (error) {
      console.error('=== Save Error ===', error);
    }
  };

  // Vérifier si les données ont réellement changé
  const hasChanges = () => {
    if (!initialData) return false;
    return hasContentChanged;
  };

  const renderPersonalInfoForm = () => {
    const tabs = [
      { value: 'identity', label: t('personalInfo.identity'), component: IdentityForm },
      { value: 'address', label: t('personalInfo.address'), component: AddressForm },
      { value: 'contact', label: t('personalInfo.contact'), component: ContactForm },
      { value: 'info', label: t('personalInfo.info'), component: InfoForm },
      { value: 'social', label: t('personalInfo.social'), component: SocialForm }
    ];

    const CurrentForm = tabs.find(tab => tab.value === personalInfoTab)?.component || IdentityForm;

    return (
      <Stack 
        direction={isMobile ? "column" : "row"} 
        spacing={3}
        sx={{ width: '100%' }}
      >
        <Box
          sx={{
            width: isMobile ? '100%' : '200px',
            borderRight: !isMobile ? '1px solid' : 'none',
            borderBottom: isMobile ? '1px solid' : 'none', 
            borderColor: 'divider',
            pb: isMobile ? 2 : 0,
            pr: !isMobile ? 2 : 0
          }}
        >
          <Tabs
            value={personalInfoTab}
            onChange={(_, newValue) => setPersonalInfoTab(newValue)}
            orientation="vertical"
            variant="scrollable"
            scrollButtons={false}
            sx={{
              '& .MuiTabs-indicator': {
                left: isMobile ? 0 : 'auto',
                right: isMobile ? 'auto' : 0,
                width: 3
              },
              '& .MuiTab-root': {
                alignItems: 'flex-start',
                minHeight: 48,
                px: 2,
                py: 1.5,
                fontSize: '0.875rem',
                fontWeight: 500,
                textAlign: 'left',
                textTransform: 'none',
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'primary.main',
                  backgroundColor: 'action.selected'
                },
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }
            }}
          >
            {tabs.map(tab => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                sx={{
                  borderRadius: 1,
                  width: '100%',
                  justifyContent: 'flex-start'
                }}
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ 
          flex: 1,
          width: isMobile ? '100%' : 'calc(100% - 200px)',
          mt: isMobile ? 2 : 0
        }}>
          <CurrentForm 
            hideNavigation 
            hideFormNavigation 
            disableNavigation 
            errors={formState.errors}
          />
        </Box>
      </Stack>
    );
  };

  const renderForm = () => {
    const formProps = {
      hideNavigation: true,
      hideFormNavigation: true,
      disableNavigation: true,
      noValidate: true,
      errors: formState.errors
    };

    switch (section) {
      case 'personalInfo':
        return renderPersonalInfoForm();
      case 'education':
        return <EducationForm hideFormNavigation={true} />;
      case 'workExperience':
        return <WorkExperienceForm hideFormNavigation={true} />;
      case 'skills':
        return <SkillsForm {...formProps} />;
      case 'languages':
        return <LanguagesForm {...formProps} />;
      case 'hobbies':
        return <HobbiesForm {...formProps} />;
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: isMobile ? '100vh' : '50vh',
          maxHeight: isMobile ? '100vh' : '90vh',
          margin: isMobile ? 0 : 2,
          borderRadius: isMobile ? 0 : 1
        }
      }}
    >
      <DialogTitle sx={{ 
        fontSize: isMobile ? '1.25rem' : '1.5rem',
        py: isMobile ? 2 : 3
      }}>
        {t(`sections.${section}`)}
      </DialogTitle>
      <DialogContent 
        dividers
        sx={{
          p: isMobile ? 2 : 3,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <FormProvider {...methods}>
          {renderForm()}
        </FormProvider>
      </DialogContent>
      <DialogActions sx={{ p: isMobile ? 2 : 3 }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          sx={{ 
            borderRadius: 2,
            minWidth: isMobile ? '45%' : 'auto'
          }}
        >
          {t('common.cancel')}
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          sx={{ 
            borderRadius: 2,
            minWidth: isMobile ? '45%' : 'auto'
          }}
        >
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog; 