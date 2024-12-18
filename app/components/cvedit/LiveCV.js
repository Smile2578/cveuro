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
  Grid
} from '@mui/material';
import {
  School as SchoolIcon,
  Work as WorkIcon,
  Language as LanguageIcon,
  Psychology as SkillIcon,
  SportsEsports as HobbyIcon
} from '@mui/icons-material';

const LiveCV = ({ data, locale }) => {
  const t = useTranslations('cvedit');
  const theme = useTheme();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    if (dateString === 'En cours') return t('common.ongoing');
    
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const date = new Intl.DateTimeFormat(locale, { 
        year: 'numeric', 
        month: 'long',
        day: 'numeric'
      }).format(new Date(year, month - 1));
      return date.charAt(0).toUpperCase() + date.slice(1);
    } else if (parts.length === 2) {
      const [month, year] = parts;
      const date = new Intl.DateTimeFormat(locale, { 
        year: 'numeric', 
        month: 'long'
      }).format(new Date(year, month - 1));
      return date.charAt(0).toUpperCase() + date.slice(1);
    }
    return dateString;
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    if (phone.match(/^0[67]/)) {
      return phone.replace(/^0/, '+33 ');
    }
    return phone;
  };

  const formatNationality = (nationality, sex) => {
    if (sex === 'male' && locale === 'fr') {
      return nationality.replace(/e$/, '');
    }
    return nationality;
  };

  const renderPersonalInfo = () => {
    if (!data?.personalInfo) return null;
    const { personalInfo } = data;

    return (
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom sx={{ 
          fontWeight: 700,
          letterSpacing: 1,
          mb: 2,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          {personalInfo.firstname} {personalInfo.lastname}
        </Typography>
        <Typography variant="h6" sx={{ 
          mb: 1.5, 
          fontWeight: 500,
          color: theme.palette.text.secondary,
          letterSpacing: 0.5
        }}>
          {personalInfo.email} • {formatPhoneNumber(personalInfo.phoneNumber)}
        </Typography>
        <Typography variant="body1" sx={{ 
          color: theme.palette.text.primary, 
          mb: 1,
          fontWeight: 500
        }}>
          {personalInfo.address}, {personalInfo.city} {personalInfo.zip}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 1 }}>
          {personalInfo.dateofBirth && (
            <Typography variant="body2" sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 500
            }}>
              {formatDate(personalInfo.dateofBirth)}
            </Typography>
          )}
          {personalInfo.sex && (
            <Typography variant="body2" sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 500
            }}>
              {t(`personalInfo.sex.${personalInfo.sex}`)}
            </Typography>
          )}
        </Stack>
        {personalInfo.nationality?.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {personalInfo.nationality.map((nat, index) => (
              <Chip
                key={index}
                label={formatNationality(nat.label, personalInfo.sex)}
                sx={{ 
                  m: 0.5,
                  borderRadius: '4px',
                  fontWeight: 500,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  color: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                  }
                }}
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
        <Typography variant="h5" color="primary.main" sx={{ 
          fontWeight: 600,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <SchoolIcon /> {t('sections.education')}
        </Typography>
        <Stack spacing={4}>
          {data.education.map((edu, index) => (
            <Box key={index}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                    {edu.degree === 'other' ? edu.customDegree : t(`education.degree.options.${edu.degree}`)}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: 'primary.main', mb: 0.5 }}>
                    {edu.schoolName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {edu.fieldOfStudy}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500,
                  minWidth: '150px',
                  textAlign: 'right'
                }}>
                  {formatDate(edu.startDate)} - {edu.ongoing ? t('common.ongoing') : formatDate(edu.endDate)}
                </Typography>
              </Stack>
              {edu.achievements?.length > 0 && renderAchievementsList(edu.achievements)}
              {index < data.education.length - 1 && (
                <Divider sx={{ mt: 2 }} />
              )}
            </Box>
          ))}
        </Stack>
      </Box>
    );
  };

  const renderWorkExperience = () => {
    if (!data?.workExperience?.length) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" color="primary.main" sx={{ 
          fontWeight: 600,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <WorkIcon /> {t('sections.experience')}
        </Typography>
        <Stack spacing={4}>
          {data.workExperience.map((exp, index) => (
            <Box key={index}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                    {exp.position}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: 'primary.main', mb: 0.5 }}>
                    {exp.companyName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {exp.location}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500,
                  minWidth: '150px',
                  textAlign: 'right'
                }}>
                  {formatDate(exp.startDate)} - {exp.ongoing ? t('common.ongoing') : formatDate(exp.endDate)}
                </Typography>
              </Stack>
              {exp.responsibilities?.length > 0 && renderAchievementsList(exp.responsibilities)}
              {index < data.workExperience.length - 1 && (
                <Divider sx={{ mt: 2 }} />
              )}
            </Box>
          ))}
        </Stack>
      </Box>
    );
  };

  const renderSkills = () => {
    if (!data?.skills?.length) return null;

    const getSkillColor = (level) => {
      switch (level) {
        case 'expert': return theme.palette.error.main;
        case 'advanced': return theme.palette.warning.main;
        case 'intermediate': return theme.palette.info.main;
        default: return theme.palette.grey[500];
      }
    };

    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" color="primary.main" sx={{ 
          fontWeight: 600,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <SkillIcon /> {t('sections.skills')}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1,
          pr: { xs: 0, md: 3 }
        }}>
          {data.skills.map((skill, index) => (
            <Chip
              key={index}
              label={`${skill.skillName} (${t(`skills.levels.${skill.level}`)})`}
              sx={{ 
                borderRadius: '4px',
                backgroundColor: `${getSkillColor(skill.level)}15`,
                color: getSkillColor(skill.level),
                border: `1px solid ${getSkillColor(skill.level)}`,
                fontWeight: 500
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
        case 'C2': return theme.palette.error.main;
        case 'C1': return theme.palette.warning.main;
        case 'B2': return theme.palette.info.main;
        default: return theme.palette.grey[500];
      }
    };

    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" color="primary.main" sx={{ 
          fontWeight: 600,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <LanguageIcon /> {t('sections.languages')}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1,
          pr: { xs: 0, md: 3 }
        }}>
          {data.languages.map((lang, index) => (
            <Chip
              key={index}
              label={
                `${lang.language} - ${t(`languages.levels.${lang.proficiency}`)}${
                  lang.testName ? ` (${lang.testName}: ${lang.testScore})` : ''
                }`
              }
              sx={{ 
                borderRadius: '4px',
                backgroundColor: `${getProficiencyColor(lang.proficiency)}15`,
                color: getProficiencyColor(lang.proficiency),
                border: `1px solid ${getProficiencyColor(lang.proficiency)}`,
                fontWeight: 500
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
        <Typography variant="h5" color="primary.main" sx={{ 
          fontWeight: 600,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <HobbyIcon /> {t('sections.hobbies')}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1,
          pr: { xs: 0, md: 3 }
        }}>
          {data.hobbies.map((hobby, index) => (
            <Chip
              key={index}
              label={hobby}
              sx={{ 
                borderRadius: '4px',
                backgroundColor: `${theme.palette.primary.main}15`,
                color: theme.palette.primary.main,
                border: `1px solid ${theme.palette.primary.main}`,
                fontWeight: 500
              }}
            />
          ))}
        </Box>
      </Box>
    );
  };

  const renderAchievementsList = (items) => (
    <Box component="ul" sx={{ 
      mt: 2,
      mb: 1,
      pl: 0,
      listStyle: 'none'
    }}>
      {items.map((item, i) => (
        <Box 
          component="li" 
          key={i}
          sx={{
            position: 'relative',
            pl: 4,
            mb: 1,
            '&::before': {
              content: '""',
              position: 'absolute',
              left: '8px',
              top: '8px',
              width: '4px',
              height: '4px',
              backgroundColor: theme.palette.primary.main,
              borderRadius: '50%'
            }
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {item}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  if (!data) return null;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4,
        backgroundColor: 'background.paper',
        position: 'relative',
        borderRadius: 2,
        minHeight: '297mm',
        maxWidth: '210mm',
        margin: '0 auto'
      }}
    >
      {renderPersonalInfo()}
      <Divider sx={{ 
        my: 3,
        '&::before, &::after': {
          borderColor: theme.palette.primary.main
        }
      }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Stack spacing={4}>
            {renderLanguages()}
            {renderSkills()}
            {renderHobbies()}
          </Stack>
        </Grid>
        <Grid item xs={12} md={8} sx={{ 
          borderLeft: { xs: 'none', md: `2px solid ${theme.palette.divider}` },
          pl: { xs: 2, md: 4 },
          '& > div': {
            pr: { xs: 0, md: 2 }
          }
        }}>
          <Stack spacing={4}>
            {renderEducation()}
            {renderWorkExperience()}
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default LiveCV;
