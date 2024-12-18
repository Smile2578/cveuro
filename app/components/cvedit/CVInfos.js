"use client";
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Box, Button, useTheme } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
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

const CVInfos = ({ cvData, onEdit, selectedSection, setSelectedSection, locale }) => {
  const t = useTranslations('cvedit');
  const theme = useTheme();
  const router = useRouter();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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

  const handleEditClick = (section) => {
    setCurrentSection(section);
    setEditDialogOpen(true);
  };

  const getDataForSection = (section) => {
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

    return cvData[section] || null;
  };

  const handleSave = (newData) => {
    if (currentSection === 'personalInfo') {
      onEdit(currentSection, {
        ...cvData.personalInfo,
        ...newData
      });
    } else {
      onEdit(currentSection, newData);
    }
    setEditDialogOpen(false);
  };

  const handleDeleteConfirm = (section, index) => {
    setCurrentSection(section);
    setItemToDelete(index);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (currentSection && itemToDelete !== null) {
      const newData = [...cvData[currentSection]];
      newData.splice(itemToDelete, 1);
      onEdit(currentSection, newData);
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const capitalizeFirst = (str) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  };

  const formatDate = (dateString) => {
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
      <Box>

        <PersonalInfoSection 
          data={cvData.personalInfo}
          onEdit={() => handleEditClick('personalInfo')}
        />

        <EducationSection 
          education={cvData.education}
          onEdit={handleEditClick}
          onDelete={(index) => handleDeleteConfirm('education', index)}
          t={t}
          formatDate={formatDate}
          capitalizeFirst={capitalizeFirst}
        />

        <WorkExperienceSection 
          workExperience={cvData.workExperience}
          onEdit={handleEditClick}
          onDelete={(index) => handleDeleteConfirm('workExperience', index)}
          t={t}
          formatDate={formatDate}
        />

        <SkillsSection 
          skills={cvData.skills}
          onEdit={handleEditClick}
          onDelete={(index) => handleDeleteConfirm('skills', index)}
          t={t}
        />

        <LanguagesSection 
          languages={cvData.languages}
          onEdit={handleEditClick}
          onDelete={(index) => handleDeleteConfirm('languages', index)}
          t={t}
        />

        <HobbiesSection 
          hobbies={cvData.hobbies}
          onEdit={handleEditClick}
          onDelete={(index) => handleDeleteConfirm('hobbies', index)}
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
      </Box>
    </FormProvider>
  );
};

export default CVInfos;