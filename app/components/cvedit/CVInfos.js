"use client";
import React from 'react';
import { useTranslations } from 'next-intl';
import { Box, Typography, Divider } from '@mui/material';
import theme from '@/app/theme';

const CVInfos = ({ cvData, setCvData }) => {
  const t = useTranslations('cvedit.infos');

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderPersonalInfo = () => {
    if (!cvData?.personalInfo) return null;
    const { personalInfo } = cvData;

    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" color={theme.palette.primary.main}>
          {t('personalInfo.title')}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography><strong>{t('personalInfo.firstName')}:</strong> {personalInfo.firstname}</Typography>
          <Typography><strong>{t('personalInfo.lastName')}:</strong> {personalInfo.lastname}</Typography>
          <Typography><strong>{t('personalInfo.email')}:</strong> {personalInfo.email}</Typography>
          <Typography><strong>{t('personalInfo.phone')}:</strong> {personalInfo.phoneNumber}</Typography>
          <Typography><strong>{t('personalInfo.address')}:</strong> {personalInfo.address}</Typography>
          <Typography><strong>{t('personalInfo.birthDate')}:</strong> {formatDate(personalInfo.dateofBirth)}</Typography>
          <Typography><strong>{t('personalInfo.birthPlace')}:</strong> {personalInfo.placeofBirth}</Typography>
          <Typography><strong>{t('personalInfo.nationality')}:</strong> {personalInfo.nationality}</Typography>
          <Typography><strong>{t('personalInfo.gender')}:</strong> {personalInfo.sex}</Typography>
        </Box>
      </Box>
    );
  };

  const renderEducation = () => {
    if (!cvData?.education?.length) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" color={theme.palette.primary.main}>
          {t('education.title')}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {cvData.education.map((edu, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography><strong>{t('education.school')}:</strong> {edu.schoolName}</Typography>
            <Typography><strong>{t('education.degree')}:</strong> {edu.degree}</Typography>
            <Typography><strong>{t('education.field')}:</strong> {edu.fieldOfStudy}</Typography>
            <Typography>
              <strong>{t('education.startDate')}:</strong> {formatDate(edu.startDate)}
              {edu.ongoing ? 
                ` - ${t('education.ongoing')}` : 
                ` - ${formatDate(edu.endDate)}`
              }
            </Typography>
            {edu.achievements?.length > 0 && (
              <>
                <Typography><strong>{t('education.achievements')}:</strong></Typography>
                <ul>
                  {edu.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              </>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const renderWorkExperience = () => {
    if (!cvData?.workExperience?.length) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" color={theme.palette.primary.main}>
          {t('experience.title')}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {cvData.workExperience.map((exp, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography><strong>{t('experience.company')}:</strong> {exp.companyName}</Typography>
            <Typography><strong>{t('experience.position')}:</strong> {exp.position}</Typography>
            <Typography><strong>{t('experience.location')}:</strong> {exp.location}</Typography>
            <Typography>
              <strong>{t('experience.startDate')}:</strong> {formatDate(exp.startDate)}
              {exp.ongoing ? 
                ` - ${t('experience.ongoing')}` : 
                ` - ${formatDate(exp.endDate)}`
              }
            </Typography>
            {exp.responsibilities?.length > 0 && (
              <>
                <Typography><strong>{t('experience.responsibilities')}:</strong></Typography>
                <ul>
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const renderSkills = () => {
    if (!cvData?.skills?.length) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" color={theme.palette.primary.main}>
          {t('skills.title')}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {cvData.skills.map((skill, index) => (
          <Box key={index}>
            <Typography>
              <strong>{t('skills.name')}:</strong> {skill.skillName}
              <br />
              <strong>{t('skills.level')}:</strong> {skill.level}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  const renderLanguages = () => {
    if (!cvData?.languages?.length) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" color={theme.palette.primary.main}>
          {t('languages.title')}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {cvData.languages.map((lang, index) => (
          <Box key={index}>
            <Typography>
              <strong>{t('languages.language')}:</strong> {lang.language}
              <br />
              <strong>{t('languages.level')}:</strong> {lang.proficiency}
              {lang.testName && (
                <>
                  <br />
                  <strong>{t('languages.test.name')}:</strong> {lang.testName}
                  <br />
                  <strong>{t('languages.test.score')}:</strong> {lang.testScore}
                </>
              )}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  const renderHobbies = () => {
    if (!cvData?.hobbies?.length) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" color={theme.palette.primary.main}>
          {t('hobbies.title')}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <ul>
          {cvData.hobbies.map((hobby, index) => (
            <li key={index}>{hobby}</li>
          ))}
        </ul>
      </Box>
    );
  };

  if (!cvData) return null;

  return (
    <Box>
      {renderPersonalInfo()}
      {renderEducation()}
      {renderWorkExperience()}
      {renderSkills()}
      {renderLanguages()}
      {renderHobbies()}
    </Box>
  );
};

export default CVInfos;