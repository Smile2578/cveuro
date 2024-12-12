"use client";
import React from 'react';
import { useTranslations } from 'next-intl';
import { Box, Typography, Paper, Grid, Divider } from '@mui/material';
import theme from '@/app/theme';

const LiveCV = ({ cvData }) => {
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
        <Typography variant="h5" gutterBottom color={theme.palette.primary.main}>
          {personalInfo.firstname} {personalInfo.lastname}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {personalInfo.email} • {personalInfo.phoneNumber}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {personalInfo.address}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('personalInfo.birthDate')}: {formatDate(personalInfo.dateofBirth)} • 
          {t('personalInfo.birthPlace')}: {personalInfo.placeofBirth} • 
          {t('personalInfo.nationality')}: {personalInfo.nationality}
        </Typography>
      </Box>
    );
  };

  const renderEducation = () => {
    if (!cvData?.education?.length) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom color={theme.palette.primary.main}>
          {t('education.title')}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {cvData.education.map((edu, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Grid container justifyContent="space-between" alignItems="flex-start">
              <Grid item xs={8}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {edu.degree} - {edu.fieldOfStudy}
                </Typography>
                <Typography variant="body1">{edu.schoolName}</Typography>
              </Grid>
              <Grid item xs={4} textAlign="right">
                <Typography variant="body2" color="text.secondary">
                  {formatDate(edu.startDate)} - {edu.ongoing ? t('education.ongoing') : formatDate(edu.endDate)}
                </Typography>
              </Grid>
            </Grid>
            {edu.achievements?.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {edu.achievements.map((achievement, i) => (
                    <li key={i}>
                      <Typography variant="body2">{achievement}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>
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
        <Typography variant="h6" gutterBottom color={theme.palette.primary.main}>
          {t('experience.title')}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {cvData.workExperience.map((exp, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Grid container justifyContent="space-between" alignItems="flex-start">
              <Grid item xs={8}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {exp.position}
                </Typography>
                <Typography variant="body1">
                  {exp.companyName} - {exp.location}
                </Typography>
              </Grid>
              <Grid item xs={4} textAlign="right">
                <Typography variant="body2" color="text.secondary">
                  {formatDate(exp.startDate)} - {exp.ongoing ? t('experience.ongoing') : formatDate(exp.endDate)}
                </Typography>
              </Grid>
            </Grid>
            {exp.responsibilities?.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i}>
                      <Typography variant="body2">{resp}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>
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
        <Typography variant="h6" gutterBottom color={theme.palette.primary.main}>
          {t('skills.title')}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {cvData.skills.map((skill, index) => (
            <Grid item xs={6} sm={4} key={index}>
              <Typography variant="body2">
                {skill.skillName} - {skill.level}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderLanguages = () => {
    if (!cvData?.languages?.length) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom color={theme.palette.primary.main}>
          {t('languages.title')}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {cvData.languages.map((lang, index) => (
            <Grid item xs={6} sm={4} key={index}>
              <Typography variant="body2">
                {lang.language} - {lang.proficiency}
                {lang.testName && (
                  <Typography variant="caption" display="block" color="text.secondary">
                    {lang.testName}: {lang.testScore}
                  </Typography>
                )}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderHobbies = () => {
    if (!cvData?.hobbies?.length) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom color={theme.palette.primary.main}>
          {t('hobbies.title')}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2">
          {cvData.hobbies.join(', ')}
        </Typography>
      </Box>
    );
  };

  if (!cvData) return null;

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      {renderPersonalInfo()}
      {renderWorkExperience()}
      {renderEducation()}
      {renderSkills()}
      {renderLanguages()}
      {renderHobbies()}
    </Paper>
  );
};

export default LiveCV;
