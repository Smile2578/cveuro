'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm, FormProvider } from 'react-hook-form';

// Import des sections
import PersonalInfoSection from './sections/PersonalInfoSection';
import EducationSection from './sections/EducationSection';
import WorkExperienceSection from './sections/WorkExperienceSection';
import SkillsSection from './sections/SkillsSection';
import LanguagesSection from './sections/LanguagesSection';
import HobbiesSection from './sections/HobbiesSection';

// Import des dialogues
import EditDialog from './dialogs/EditDialog';
import DeleteConfirmDialog from './dialogs/DeleteConfirmDialog';

interface CVData {
  personalInfo?: {
    firstname?: string;
    lastname?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    zip?: string;
    sex?: string;
    dateofBirth?: string;
    placeofBirth?: string;
    nationality?: { code: string; label: string }[];
    linkedIn?: string;
    personalWebsite?: string;
    [key: string]: unknown;
  };
  education?: Array<{
    schoolName: string;
    degree: string;
    customDegree?: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    ongoing?: boolean;
    achievements?: string[];
  }>;
  workExperience?: Array<{
    companyName: string;
    position: string;
    location: string;
    startDate: string;
    endDate?: string;
    ongoing?: boolean;
    responsibilities?: string[];
  }>;
  skills?: Array<{
    skillName: string;
    level: string;
  }>;
  languages?: Array<{
    language: string;
    proficiency: string;
    testName?: string;
    testScore?: string;
  }>;
  hobbies?: string[];
  [key: string]: unknown;
}

interface CVInfosProps {
  cvData: CVData;
  onEdit: (section: string, data: unknown) => void;
  selectedSection: string | null;
  setSelectedSection: (section: string | null) => void;
  locale: string;
}

export default function CVInfos({ cvData, onEdit, selectedSection, setSelectedSection, locale }: CVInfosProps) {
  const t = useTranslations('cvedit');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  // Configuration du formulaire global
  const methods = useForm({
    defaultValues: {
      personalInfo: cvData?.personalInfo || {},
      educations: cvData?.education || [],
      workExperiences: cvData?.workExperience || [],
      skills: cvData?.skills || [],
      languages: cvData?.languages || [],
      hobbies: cvData?.hobbies || []
    }
  });

  const handleEditClick = (section: string) => {
    setCurrentSection(section);
    setEditDialogOpen(true);
  };

  const getDataForSection = (section: string | null) => {
    if (!cvData || !section) return null;

    if (section === 'personalInfo') {
      return {
        firstname: cvData.personalInfo?.firstname || '',
        lastname: cvData.personalInfo?.lastname || '',
        sex: cvData.personalInfo?.sex || '',
        dateofBirth: cvData.personalInfo?.dateofBirth || '',
        placeofBirth: cvData.personalInfo?.placeofBirth || '',
        nationality: cvData.personalInfo?.nationality || '',
        address: cvData.personalInfo?.address || '',
        city: cvData.personalInfo?.city || '',
        zip: cvData.personalInfo?.zip || '',
        email: cvData.personalInfo?.email || '',
        phoneNumber: cvData.personalInfo?.phoneNumber || '',
        linkedIn: cvData.personalInfo?.linkedIn || '',
        personalWebsite: cvData.personalInfo?.personalWebsite || ''
      };
    }

    return cvData[section as keyof CVData] || null;
  };

  const handleSave = (newData: unknown) => {
    if (!currentSection) return;
    
    if (currentSection === 'personalInfo') {
      onEdit(currentSection, {
        ...cvData.personalInfo,
        ...(newData as Record<string, unknown>)
      });
    } else {
      onEdit(currentSection, newData);
    }
    setEditDialogOpen(false);
  };

  const handleDeleteConfirm = (section: string, index: number) => {
    setCurrentSection(section);
    setItemToDelete(index);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (currentSection && itemToDelete !== null) {
      const sectionData = cvData[currentSection as keyof CVData];
      if (Array.isArray(sectionData)) {
        const newData = [...sectionData];
        newData.splice(itemToDelete, 1);
        onEdit(currentSection, newData);
      }
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const capitalizeFirst = (str: string) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    if (dateString === 'En cours') return t('common.ongoing');
    const [month, year] = dateString.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    if (isNaN(date.getTime())) return dateString;
    
    const formatter = new Intl.DateTimeFormat(locale || 'fr-FR', { 
      year: 'numeric', 
      month: 'long' 
    });
    const formatted = formatter.format(date);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  if (!cvData) return null;

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <PersonalInfoSection 
          data={cvData.personalInfo || null}
          onEdit={() => handleEditClick('personalInfo')}
        />

        <EducationSection 
          education={cvData.education || []}
          onEdit={handleEditClick}
          onDelete={(index: number) => handleDeleteConfirm('education', index)}
          t={t}
          formatDate={formatDate}
          capitalizeFirst={capitalizeFirst}
        />

        <WorkExperienceSection 
          workExperience={cvData.workExperience || []}
          onEdit={handleEditClick}
          onDelete={(index: number) => handleDeleteConfirm('workExperience', index)}
          t={t}
          formatDate={formatDate}
        />

        <SkillsSection 
          skills={cvData.skills || []}
          onEdit={handleEditClick}
          onDelete={(index: number) => handleDeleteConfirm('skills', index)}
          t={t}
        />

        <LanguagesSection 
          languages={cvData.languages || []}
          onEdit={handleEditClick}
          onDelete={(index: number) => handleDeleteConfirm('languages', index)}
          t={t}
        />

        <HobbiesSection 
          hobbies={cvData.hobbies || []}
          onEdit={handleEditClick}
          onDelete={(index: number) => handleDeleteConfirm('hobbies', index)}
          t={t}
        />

        <EditDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          section={currentSection}
          data={getDataForSection(currentSection)}
          onSave={handleSave}
          locale={locale}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDelete}
        />
      </div>
    </FormProvider>
  );
}

