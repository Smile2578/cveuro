"use client";
import React from 'react';
import { useTranslations } from 'next-intl';
import { 
  Box, 
  Typography, 
  Paper,
  Stack,
  Divider,
  Chip,
  useTheme,
  Button
} from '@mui/material';
import {
  School as SchoolIcon,
  Work as WorkIcon,
  Language as LanguageIcon,
  Psychology as SkillIcon,
  SportsEsports as HobbyIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const SectionTitle = ({ icon: Icon, title }) => {
  const theme = useTheme();
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mb: 2,
      backgroundColor: theme.palette.primary.light,
      p: 1,
      borderRadius: 1
    }}>
      <Icon sx={{ color: theme.palette.primary.main, mr: 1 }} />
      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Divider sx={{ flex: 1, ml: 2 }} />
    </Box>
  );
};

const LiveCV = ({ data, locale }) => {
  const t = useTranslations('cvedit');
  const theme = useTheme();
  const router = useRouter();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    if (dateString === 'En cours') return t('common.ongoing');
    const [month, year] = dateString.split('/');
    return new Intl.DateTimeFormat(locale, { 
      year: 'numeric', 
      month: 'long' 
    }).format(new Date(year, month - 1));
  };

  const renderPersonalInfo = () => {
    if (!data?.personalInfo) return null;
    const { personalInfo } = data;

    return (
      <Box sx={{ mb: 4, textAlign: 'center', position: 'relative' }}>
        <Typography variant="h3" gutterBottom color="primary.main" sx={{ fontWeight: 'bold' }}>
          {personalInfo.firstname} {personalInfo.lastname}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {personalInfo.email} • {personalInfo.phoneNumber}
        </Typography>
        <Typography variant="body1">
          {personalInfo.address}, {personalInfo.city} {personalInfo.zip}
        </Typography>
        {personalInfo.nationality?.length > 0 && (
          <Box sx={{ mt: 1 }}>
            {personalInfo.nationality.map((nat, index) => (
              <Chip
                key={index}
                label={nat.label}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        )}
      </Box>
    );
  };

  const renderEducation = () => {
    if (!data?.education?.length) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <SectionTitle icon={SchoolIcon} title={t('sections.education')} />
        {data.education.map((edu, index) => (
          <Paper
            key={index}
            elevation={1}
            sx={{ 
              mb: 2, 
              p: 2,
              '&:hover': {
                boxShadow: theme.shadows[4],
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            <Stack 
              direction="row" 
              justifyContent="space-between" 
              alignItems="flex-start"
              spacing={2}
            >
              <Box sx={{ flex: '0 0 66.666%' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {edu.degree} {edu.customDegree && `- ${edu.customDegree}`}
                </Typography>
                <Typography variant="body1">{edu.schoolName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {edu.fieldOfStudy}
                </Typography>
              </Box>
              <Box sx={{ flex: '0 0 33.333%', textAlign: 'right' }}>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(edu.startDate)} - {edu.ongoing ? t('common.ongoing') : formatDate(edu.endDate)}
                </Typography>
              </Box>
            </Stack>
            {edu.achievements?.length > 0 && (
              <Box sx={{ mt: 2, pl: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('education.achievements')}:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {edu.achievements.map((achievement, i) => (
                    <li key={i}>
                      <Typography variant="body2">{achievement}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </Paper>
        ))}
      </Box>
    );
  };

  const renderWorkExperience = () => {
    if (!data?.workExperience?.length) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <SectionTitle icon={WorkIcon} title={t('sections.experience')} />
        {data.workExperience.map((exp, index) => (
          <Paper
            key={index}
            elevation={1}
            sx={{ 
              mb: 2, 
              p: 2,
              '&:hover': {
                boxShadow: theme.shadows[4],
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            <Stack 
              direction="row" 
              justifyContent="space-between" 
              alignItems="flex-start"
              spacing={2}
            >
              <Box sx={{ flex: '0 0 66.666%' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {exp.position}
                </Typography>
                <Typography variant="body1">
                  {exp.companyName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {exp.location}
                </Typography>
              </Box>
              <Box sx={{ flex: '0 0 33.333%', textAlign: 'right' }}>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(exp.startDate)} - {exp.ongoing ? t('common.ongoing') : formatDate(exp.endDate)}
                </Typography>
              </Box>
            </Stack>
            {exp.responsibilities?.length > 0 && (
              <Box sx={{ mt: 2, pl: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('experience.responsibilities')}:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i}>
                      <Typography variant="body2">{resp}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </Paper>
        ))}
      </Box>
    );
  };

  const renderSkills = () => {
    if (!data?.skills?.length) return null;

    const getSkillColor = (level) => {
      switch (level) {
        case 'expert': return 'error';
        case 'advanced': return 'warning';
        case 'intermediate': return 'info';
        default: return 'default';
      }
    };

    return (
      <Box sx={{ mb: 4 }}>
        <SectionTitle icon={SkillIcon} title={t('sections.skills')} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {data.skills.map((skill, index) => (
            <Chip
              key={index}
              label={`${skill.skillName} (${t(`skills.levels.${skill.level}`)})`}
              color={getSkillColor(skill.level)}
              variant="outlined"
              size="small"
              sx={{ 
                p: 1,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}
            />
          ))}
        </Box>
      </Box>
    );
  };

  const renderLanguages = () => {
    if (!data?.languages?.length) return null;

    const getProficiencyColor = (level) => {
      switch (level) {
        case 'Native':
        case 'C2': return 'error';
        case 'C1': return 'warning';
        case 'B2': return 'info';
        default: return 'default';
      }
    };

    return (
      <Box sx={{ mb: 4 }}>
        <SectionTitle icon={LanguageIcon} title={t('sections.languages')} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {data.languages.map((lang, index) => (
            <Chip
              key={index}
              label={
                `${lang.language} - ${lang.proficiency}${
                  lang.testName ? ` (${lang.testName}: ${lang.testScore})` : ''
                }`
              }
              color={getProficiencyColor(lang.proficiency)}
              variant="outlined"
              size="small"
              sx={{ 
                p: 1,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}
            />
          ))}
        </Box>
      </Box>
    );
  };

  const renderHobbies = () => {
    if (!data?.hobbies?.length) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <SectionTitle icon={HobbyIcon} title={t('sections.hobbies')} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {data.hobbies.map((hobby, index) => (
            <Chip
              key={index}
              label={hobby}
              color="default"
              variant="outlined"
              size="small"
              sx={{ 
                p: 1,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}
            />
          ))}
        </Box>
      </Box>
    );
  };

  if (!data) return null;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4,
        backgroundColor: 'background.paper',
        position: 'relative',
        borderRadius: 2,
        '&:hover': {
          boxShadow: theme.shadows[8]
        }
      }}
    >
      {renderPersonalInfo()}
      {renderEducation()}
      {renderWorkExperience()}
      {renderSkills()}
      {renderLanguages()}
      {renderHobbies()}
    </Paper>
  );
};

export default LiveCV;
