'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createEditValidators, type SectionType } from '@/app/utils/editValidators';

// Import des formulaires de CVGen
import IdentityForm from '../../cvgen/personal-info/IdentityForm';
import AddressForm from '../../cvgen/personal-info/AddressForm';
import ContactForm from '../../cvgen/personal-info/ContactForm';
import InfoForm from '../../cvgen/personal-info/InfoForm';
import SocialForm from '../../cvgen/personal-info/SocialForm';
import EducationForm from '../../cvgen/education/EducationForm';
import WorkExperienceForm from '../../cvgen/work-experience/WorkExperienceForm';
import LanguagesForm from '../../cvgen/combined-form/LanguagesForm';
import HobbiesForm from '../../cvgen/combined-form/HobbiesForm';
import SkillsForm from '../../cvgen/combined-form/SkillsForm';

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  section: string | null;
  data: unknown;
  onSave: (data: unknown) => void;
  locale: string;
}

export default function EditDialog({ 
  open, 
  onClose, 
  section, 
  data, 
  onSave,
  locale 
}: EditDialogProps) {
  const t = useTranslations('cvedit');
  const tValidation = useTranslations('validation');
  const [personalInfoTab, setPersonalInfoTab] = useState('identity');
  const [initialData, setInitialData] = useState<unknown>(null);
  const [hasContentChanged, setHasContentChanged] = useState(false);

  const { createPartialSchema } = createEditValidators(tValidation);

  // Restructure les données pour correspondre au format CVGen
  const restructureData = (inputData: unknown) => {
    if (!inputData) return {};

    let restructured;
    if (section === 'personalInfo') {
      const d = inputData as Record<string, unknown>;
      restructured = {
        personalInfo: {
          ...d,
          firstname: d.firstname || '',
          lastname: d.lastname || '',
          sex: d.sex || '',
          dateofBirth: d.dateofBirth || '',
          placeofBirth: d.placeofBirth || '',
          nationality: d.nationality || [],
          address: d.address || '',
          city: d.city || '',
          zip: d.zip || '',
          email: d.email || '',
          phoneNumber: d.phoneNumber || '',
          linkedIn: d.linkedIn || '',
          personalWebsite: d.personalWebsite || ''
        }
      };
    } else if (section === 'education') {
      const educationData = Array.isArray(inputData) ? inputData : [];
      restructured = {
        educations: educationData
      };
    } else if (section === 'workExperience') {
      const workData = Array.isArray(inputData) ? inputData : [];
      const d = inputData as { hasWorkExperience?: boolean };
      restructured = {
        workExperience: {
          hasWorkExperience: d?.hasWorkExperience ?? workData.length > 0,
          experiences: workData
        }
      };
    } else if (section && ['skills', 'languages', 'hobbies'].includes(section)) {
      restructured = {
        [section]: Array.isArray(inputData) ? inputData : []
      };
    } else if (section) {
      restructured = { [section]: inputData || [] };
    } else {
      restructured = {};
    }

    return restructured;
  };

  // Aplatit les données pour les renvoyer au format de l'éditeur
  const flattenData = (formData: Record<string, unknown>) => {
    let flattened;
    if (section === 'personalInfo') {
      flattened = formData.personalInfo;
    } else if (section === 'education') {
      flattened = formData.educations;
    } else if (section === 'workExperience') {
      const workExp = formData.workExperience as { hasWorkExperience: boolean; experiences: unknown[] };
      flattened = {
        hasWorkExperience: workExp.hasWorkExperience,
        experiences: workExp.experiences
      };
    } else if (section && ['skills', 'languages', 'hobbies'].includes(section)) {
      flattened = formData[section];
    } else if (section) {
      flattened = formData[section];
    }

    return flattened;
  };

  const methods = useForm({
    resolver: section ? zodResolver(createPartialSchema(section as SectionType)) : undefined,
    defaultValues: restructureData(data) as Record<string, unknown>,
    mode: 'onBlur',
    criteriaMode: 'all'
  });

  const { formState, getValues, watch, reset, setError } = methods;

  // Réinitialiser le formulaire quand les données changent
  useEffect(() => {
    if (open && data) {
      const restructuredData = restructureData(data);
      reset(restructuredData);
      setInitialData(restructuredData);
      setHasContentChanged(false);
    }
  }, [open, data, reset, section]);

  // Surveiller les changements de champs
  useEffect(() => {
    const subscription = watch((value, { type }) => {
      if (type === 'change') {
        const currentData = getValues();
        const currentValue = section === 'personalInfo' 
          ? currentData.personalInfo 
          : currentData[section as string];
        const initData = initialData as Record<string, unknown> | null;
        const initialValue = section === 'personalInfo' 
          ? initData?.personalInfo 
          : initData?.[section as string];
        
        setHasContentChanged(JSON.stringify(currentValue) !== JSON.stringify(initialValue));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, section, initialData, getValues]);

  const handleSave = async () => {
    if (!section) return;
    
    try {
      const formData = getValues();
      let dataToValidate;

      // Préparer les données pour la validation
      if (section === 'personalInfo') {
        dataToValidate = formData.personalInfo;
      } else if (section === 'education') {
        dataToValidate = (formData.educations as Array<{ ongoing?: boolean; endDate?: string }>).map(edu => ({
          ...edu,
          endDate: edu.ongoing ? null : edu.endDate || null
        }));
      } else if (section === 'workExperience') {
        const workExp = formData.workExperience as { experiences: Array<{ ongoing?: boolean; endDate?: string }> };
        dataToValidate = workExp.experiences.map(exp => ({
          ...exp,
          endDate: exp.ongoing ? null : exp.endDate || null,
          ongoing: exp.ongoing || false
        }));
      } else {
        dataToValidate = formData[section];
      }
      
      // Valider le formulaire complet
      const validationSchema = createPartialSchema(section as SectionType);
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
      <Tabs value={personalInfoTab} onValueChange={setPersonalInfoTab} className="w-full">
        <TabsList className="w-full flex-wrap h-auto gap-1 mb-4">
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-xs sm:text-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value}>
            <tab.component />
          </TabsContent>
        ))}
      </Tabs>
    );
  };

  const renderForm = () => {
    switch (section) {
      case 'personalInfo':
        return renderPersonalInfoForm();
      case 'education':
        return <EducationForm />;
      case 'workExperience':
        return <WorkExperienceForm />;
      case 'skills':
        return <SkillsForm />;
      case 'languages':
        return <LanguagesForm />;
      case 'hobbies':
        return <HobbiesForm />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {section && t(`sections.${section}`)}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <FormProvider {...methods}>
            <div className="py-4">
              {renderForm()}
            </div>
          </FormProvider>
        </ScrollArea>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave}>
            {t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

