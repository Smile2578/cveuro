"use client";
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Box, 
  Typography, 
  Divider, 
  Paper,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import {
  Edit as EditIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Language as LanguageIcon,
  Psychology as SkillIcon,
  SportsEsports as HobbyIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const SectionTitle = ({ icon: Icon, title, onEdit }) => {
  const theme = useTheme();
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mb: 2,
      backgroundColor: theme.palette.grey[100],
      p: 1,
      borderRadius: 1
    }}>
      <Icon sx={{ color: theme.palette.primary.main, mr: 1 }} />
      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Box sx={{ flex: 1 }} />
      {onEdit && (
        <Tooltip title="Modifier">
          <IconButton size="small" onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

const EditDialog = ({ open, onClose, section, data, onSave, t }) => {
  const [editedData, setEditedData] = useState(null);

  useEffect(() => {
    if (open && data) {
      if (['education', 'workExperience', 'skills', 'languages', 'hobbies'].includes(section)) {
        if (!Array.isArray(data)) {
          switch (section) {
            case 'workExperience':
              setEditedData([{
                position: '',
                companyName: '',
                location: '',
                startDate: '',
                endDate: '',
                ongoing: false,
                responsibilities: []
              }]);
              break;
            case 'education':
              setEditedData([{
                schoolName: '',
                degree: '',
                fieldOfStudy: '',
                startDate: '',
                endDate: '',
                ongoing: false,
                achievements: []
              }]);
              break;
            case 'skills':
              setEditedData([{
                skillName: '',
                level: 'beginner'
              }]);
              break;
            case 'languages':
              setEditedData([{
                language: '',
                proficiency: 'A1',
                testName: '',
                testScore: ''
              }]);
              break;
            case 'hobbies':
              setEditedData(['']);
              break;
            default:
              setEditedData([]);
          }
        } else {
          setEditedData([...data]);
        }
      } else {
        setEditedData({...data});
      }
    }
  }, [open, data, section]);

  const handleSave = () => {
    onSave(editedData);
    onClose();
  };


  const renderEditFields = () => {
    switch (section) {
      case 'personalInfo':
        return (
          <Stack spacing={2}>
            <TextField
              label={t('personalInfo.firstname')}
              value={editedData?.firstname || ''}
              onChange={(e) => setEditedData({...editedData, firstname: e.target.value})}
              fullWidth
            />
            <TextField
              label={t('personalInfo.lastname')}
              value={editedData?.lastname || ''}
              onChange={(e) => setEditedData({...editedData, lastname: e.target.value})}
              fullWidth
            />
            <TextField
              label={t('personalInfo.email')}
              value={editedData?.email || ''}
              onChange={(e) => setEditedData({...editedData, email: e.target.value})}
              fullWidth
            />
            <TextField
              label={t('personalInfo.phoneNumber')}
              value={editedData?.phoneNumber || ''}
              onChange={(e) => setEditedData({...editedData, phoneNumber: e.target.value})}
              fullWidth
            />
            <TextField
              label={t('personalInfo.dateOfBirth')}
              value={editedData?.dateofBirth || ''}
              onChange={(e) => setEditedData({...editedData, dateofBirth: e.target.value})}
              placeholder="JJ/MM/AAAA"
              fullWidth
            />
            <TextField
              label={t('personalInfo.address')}
              value={editedData?.address || ''}
              onChange={(e) => setEditedData({...editedData, address: e.target.value})}
              fullWidth
            />
            <TextField
              label={t('personalInfo.city')}
              value={editedData?.city || ''}
              onChange={(e) => setEditedData({...editedData, city: e.target.value})}
              fullWidth
            />
            <TextField
              label={t('personalInfo.zip')}
              value={editedData?.zip || ''}
              onChange={(e) => setEditedData({...editedData, zip: e.target.value})}
              fullWidth
            />
          </Stack>
        );
      case 'education':
        return (
          <Stack spacing={2}>
            {editedData?.map((edu, index) => (
              <Paper key={index} elevation={1} sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <TextField
                    label={t('education.schoolName')}
                    value={edu.schoolName || ''}
                    onChange={(e) => {
                      const newEducations = [...editedData];
                      newEducations[index] = {...edu, schoolName: e.target.value};
                      setEditedData(newEducations);
                    }}
                    fullWidth
                  />
                  <FormControl fullWidth>
                    <InputLabel>{t('education.degree')}</InputLabel>
                    <Select
                      value={edu.degree || ''}
                      onChange={(e) => {
                        const newEducations = [...editedData];
                        newEducations[index] = {...edu, degree: e.target.value};
                        setEditedData(newEducations);
                      }}
                      label={t('education.degree')}
                    >
                      <MenuItem value="bac">Baccalauréat</MenuItem>
                      <MenuItem value="dut">DUT</MenuItem>
                      <MenuItem value="but">BUT</MenuItem>
                      <MenuItem value="licence">Licence</MenuItem>
                      <MenuItem value="master">Master</MenuItem>
                      <MenuItem value="ingenieur">Diplôme d'ingénieur</MenuItem>
                      <MenuItem value="doctorat">Doctorat</MenuItem>
                      <MenuItem value="other">{t('education.customDegree')}</MenuItem>
                    </Select>
                  </FormControl>
                  {edu.degree === 'other' && (
                    <TextField
                      label={t('education.customDegree')}
                      value={edu.customDegree || ''}
                      onChange={(e) => {
                        const newEducations = [...editedData];
                        newEducations[index] = {...edu, customDegree: e.target.value};
                        setEditedData(newEducations);
                      }}
                      fullWidth
                    />
                  )}
                  <TextField
                    label={t('education.fieldOfStudy')}
                    value={edu.fieldOfStudy || ''}
                    onChange={(e) => {
                      const newEducations = [...editedData];
                      newEducations[index] = {...edu, fieldOfStudy: e.target.value};
                      setEditedData(newEducations);
                    }}
                    fullWidth
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label={t('education.startDate')}
                      value={edu.startDate || ''}
                      onChange={(e) => {
                        const newEducations = [...editedData];
                        newEducations[index] = {...edu, startDate: e.target.value};
                        setEditedData(newEducations);
                      }}
                      placeholder="MM/YYYY"
                      fullWidth
                    />
                    <TextField
                      label={t('education.endDate')}
                      value={edu.endDate || ''}
                      onChange={(e) => {
                        const newEducations = [...editedData];
                        newEducations[index] = {...edu, endDate: e.target.value};
                        setEditedData(newEducations);
                      }}
                      disabled={edu.ongoing}
                      placeholder="MM/YYYY"
                      fullWidth
                    />
                  </Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={edu.ongoing || false}
                        onChange={(e) => {
                          const newEducations = [...editedData];
                          newEducations[index] = {...edu, ongoing: e.target.checked};
                          setEditedData(newEducations);
                        }}
                      />
                    }
                    label={t('education.ongoing')}
                  />
                  <Button
                    color="error"
                    onClick={() => {
                      const newEducations = editedData.filter((_, i) => i !== index);
                      setEditedData(newEducations);
                    }}
                  >
                    {t('common.delete')}
                  </Button>
                </Stack>
              </Paper>
            ))}
            <Button
              variant="outlined"
              onClick={() => {
                setEditedData([
                  ...editedData,
                  {
                    schoolName: '',
                    degree: '',
                    fieldOfStudy: '',
                    startDate: '',
                    endDate: '',
                    ongoing: false,
                    achievements: []
                  }
                ]);
              }}
            >
              {t('education.add')}
            </Button>
          </Stack>
        );
      case 'workExperience':
        return (
          <Stack spacing={2}>
            {editedData?.map((exp, index) => (
              <Paper key={index} elevation={1} sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <TextField
                    label={t('experience.position')}
                    value={exp.position || ''}
                    onChange={(e) => {
                      const newExperiences = [...editedData];
                      newExperiences[index] = {...exp, position: e.target.value};
                      setEditedData(newExperiences);
                    }}
                    fullWidth
                  />
                  <TextField
                    label={t('experience.companyName')}
                    value={exp.companyName || ''}
                    onChange={(e) => {
                      const newExperiences = [...editedData];
                      newExperiences[index] = {...exp, companyName: e.target.value};
                      setEditedData(newExperiences);
                    }}
                    fullWidth
                  />
                  <TextField
                    label={t('experience.location')}
                    value={exp.location || ''}
                    onChange={(e) => {
                      const newExperiences = [...editedData];
                      newExperiences[index] = {...exp, location: e.target.value};
                      setEditedData(newExperiences);
                    }}
                    fullWidth
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label={t('experience.startDate')}
                      value={exp.startDate || ''}
                      onChange={(e) => {
                        const newExperiences = [...editedData];
                        newExperiences[index] = {...exp, startDate: e.target.value};
                        setEditedData(newExperiences);
                      }}
                      placeholder="MM/YYYY"
                      fullWidth
                    />
                    <TextField
                      label={t('experience.endDate')}
                      value={exp.endDate || ''}
                      onChange={(e) => {
                        const newExperiences = [...editedData];
                        newExperiences[index] = {...exp, endDate: e.target.value};
                        setEditedData(newExperiences);
                      }}
                      disabled={exp.ongoing}
                      placeholder="MM/YYYY"
                      fullWidth
                    />
                  </Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={exp.ongoing || false}
                        onChange={(e) => {
                          const newExperiences = [...editedData];
                          newExperiences[index] = {...exp, ongoing: e.target.checked};
                          setEditedData(newExperiences);
                        }}
                      />
                    }
                    label={t('experience.ongoing')}
                  />
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">
                      {t('experience.responsibilities')}
                    </Typography>
                    {exp.responsibilities?.map((resp, respIndex) => (
                      <Box key={respIndex} sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          value={resp || ''}
                          onChange={(e) => {
                            const newExperiences = [...editedData];
                            const newResponsibilities = [...exp.responsibilities];
                            newResponsibilities[respIndex] = e.target.value;
                            newExperiences[index] = {
                              ...exp,
                              responsibilities: newResponsibilities
                            };
                            setEditedData(newExperiences);
                          }}
                          fullWidth
                          multiline
                        />
                        <IconButton
                          color="error"
                          onClick={() => {
                            const newExperiences = [...editedData];
                            const newResponsibilities = exp.responsibilities.filter(
                              (_, i) => i !== respIndex
                            );
                            newExperiences[index] = {
                              ...exp,
                              responsibilities: newResponsibilities
                            };
                            setEditedData(newExperiences);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        const newExperiences = [...editedData];
                        const newResponsibilities = [...(exp.responsibilities || []), ''];
                        newExperiences[index] = {
                          ...exp,
                          responsibilities: newResponsibilities
                        };
                        setEditedData(newExperiences);
                      }}
                    >
                      {t('experience.addResponsibility')}
                    </Button>
                  </Stack>
                  <Button
                    color="error"
                    onClick={() => {
                      const newExperiences = editedData.filter((_, i) => i !== index);
                      setEditedData(newExperiences);
                    }}
                  >
                    {t('common.delete')}
                  </Button>
                </Stack>
              </Paper>
            ))}
            <Button
              variant="outlined"
              onClick={() => {
                setEditedData([
                  ...editedData,
                  {
                    position: '',
                    companyName: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    ongoing: false,
                    responsibilities: []
                  }
                ]);
              }}
            >
              {t('experience.add')}
            </Button>
          </Stack>
        );
      case 'skills':
        return (
          <Stack spacing={2}>
            {editedData?.map((skill, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label={t('skills.name')}
                  value={skill.skillName || ''}
                  onChange={(e) => {
                    const newSkills = [...editedData];
                    newSkills[index] = {...skill, skillName: e.target.value};
                    setEditedData(newSkills);
                  }}
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>{t('skills.level')}</InputLabel>
                  <Select
                    value={skill.level || 'beginner'}
                    onChange={(e) => {
                      const newSkills = [...editedData];
                      newSkills[index] = {...skill, level: e.target.value};
                      setEditedData(newSkills);
                    }}
                    label={t('skills.level')}
                  >
                    {['beginner', 'intermediate', 'advanced', 'expert'].map((level) => (
                      <MenuItem key={level} value={level}>
                        {t(`skills.levels.${level}`)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <IconButton
                  color="error"
                  onClick={() => {
                    const newSkills = editedData.filter((_, i) => i !== index);
                    setEditedData(newSkills);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={() => {
                setEditedData([
                  ...editedData,
                  {
                    skillName: '',
                    level: 'beginner'
                  }
                ]);
              }}
            >
              {t('skills.add')}
            </Button>
          </Stack>
        );
      case 'languages':
        return (
          <Stack spacing={2}>
            {editedData?.map((lang, index) => (
              <Paper key={index} elevation={1} sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <TextField
                    label={t('languages.language')}
                    value={lang.language || ''}
                    onChange={(e) => {
                      const newLanguages = [...editedData];
                      newLanguages[index] = {...lang, language: e.target.value};
                      setEditedData(newLanguages);
                    }}
                    fullWidth
                  />
                  <FormControl fullWidth>
                    <InputLabel>{t('languages.proficiency')}</InputLabel>
                    <Select
                      value={lang.proficiency || 'A1'}
                      onChange={(e) => {
                        const newLanguages = [...editedData];
                        newLanguages[index] = {...lang, proficiency: e.target.value};
                        setEditedData(newLanguages);
                      }}
                      label={t('languages.proficiency')}
                    >
                      {['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native'].map((level) => (
                        <MenuItem key={level} value={level}>
                          {t(`languages.levels.${level}`)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label={t('languages.test.name')}
                    value={lang.testName || ''}
                    onChange={(e) => {
                      const newLanguages = [...editedData];
                      newLanguages[index] = {...lang, testName: e.target.value};
                      setEditedData(newLanguages);
                    }}
                    fullWidth
                  />
                  <TextField
                    label={t('languages.test.score')}
                    value={lang.testScore || ''}
                    onChange={(e) => {
                      const newLanguages = [...editedData];
                      newLanguages[index] = {...lang, testScore: e.target.value};
                      setEditedData(newLanguages);
                    }}
                    fullWidth
                  />
                  <Button
                    color="error"
                    onClick={() => {
                      const newLanguages = editedData.filter((_, i) => i !== index);
                      setEditedData(newLanguages);
                    }}
                  >
                    {t('common.delete')}
                  </Button>
                </Stack>
              </Paper>
            ))}
            <Button
              variant="outlined"
              onClick={() => {
                setEditedData([
                  ...editedData,
                  {
                    language: '',
                    proficiency: 'B1',
                    testName: '',
                    testScore: ''
                  }
                ]);
              }}
            >
              {t('languages.add')}
            </Button>
          </Stack>
        );
      case 'hobbies':
        return (
          <Stack spacing={2}>
            {editedData?.map((hobby, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label={t('hobbies.hobby')}
                  value={hobby || ''}
                  onChange={(e) => {
                    const newHobbies = [...editedData];
                    newHobbies[index] = e.target.value;
                    setEditedData(newHobbies);
                  }}
                  fullWidth
                />
                <IconButton
                  color="error"
                  onClick={() => {
                    const newHobbies = editedData.filter((_, i) => i !== index);
                    setEditedData(newHobbies);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={() => {
                setEditedData([...editedData, '']);
              }}
            >
              {t('hobbies.add')}
            </Button>
          </Stack>
        );
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
          minHeight: '50vh',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle>
        {t(`sections.${section || ''}`)}
      </DialogTitle>
      <DialogContent dividers>
        {renderEditFields()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {t('common.cancel')}
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!editedData}
        >
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CVInfos = ({ cvData, onEdit, selectedSection, setSelectedSection, locale }) => {
  const t = useTranslations('cvedit');
  const theme = useTheme();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);

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

  const handleEditClick = (section) => {
    setCurrentSection(section);
    setEditDialogOpen(true);
  };

  const handleSave = (newData) => {
    onEdit(currentSection, newData);
  };

  const renderPersonalInfo = () => {
    if (!cvData?.personalInfo) return null;
    const { personalInfo } = cvData;

    return (
      <Paper elevation={1} sx={{ mb: 4, p: 3 }}>
        <SectionTitle 
          icon={PersonIcon} 
          title={t('sections.personalInfo')} 
          onEdit={() => handleEditClick('personalInfo')}
        />
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('personalInfo.name')}
              </Typography>
              <Typography variant="body1">
                {personalInfo.firstname} {personalInfo.lastname}
              </Typography>
            </Box>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('personalInfo.contact')}
              </Typography>
              <Typography variant="body1">
                {personalInfo.email} • {personalInfo.phoneNumber}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('personalInfo.address')}
              </Typography>
              <Typography variant="body1">
                {personalInfo.address}, {personalInfo.city} {personalInfo.zip}
              </Typography>
            </Box>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('personalInfo.dateofBirth')}
              </Typography>
              <Typography variant="body1">
                {formatDate(personalInfo.dateofBirth)}
              </Typography>
            </Box>
          </Box>
          {personalInfo.nationality?.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {t('personalInfo.nationality')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {personalInfo.nationality.map((nat, index) => (
                  <Chip
                    key={index}
                    label={nat.label}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Stack>
      </Paper>
    );
  };

  const renderEducation = () => {
    if (!cvData?.education?.length) return null;

    return (
      <Paper elevation={1} sx={{ mb: 4, p: 3 }}>
        <SectionTitle 
          icon={SchoolIcon} 
          title={t('sections.education')} 
          onEdit={() => handleEditClick('education')}
        />
        <Stack spacing={3}>
          {cvData.education.map((edu, index) => (
            <Box key={index}>
              <Typography variant="subtitle1" fontWeight="bold">
                {edu.degree === 'other' ? 
                  capitalizeFirst(edu.customDegree) : 
                  capitalizeFirst(edu.degree)}
              </Typography>
              <Typography variant="body1">{edu.schoolName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {edu.fieldOfStudy}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(edu.startDate)} - {edu.ongoing ? t('common.ongoing') : formatDate(edu.endDate)}
              </Typography>
              {edu.achievements?.length > 0 && (
                <Box sx={{ mt: 1 }}>
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
              {index < cvData.education.length - 1 && (
                <Divider sx={{ mt: 2 }} />
              )}
            </Box>
          ))}
        </Stack>
      </Paper>
    );
  };

  const renderWorkExperience = () => {
    if (!cvData?.workExperience?.length) return null;

    return (
      <Paper elevation={1} sx={{ mb: 4, p: 3 }}>
        <SectionTitle 
          icon={WorkIcon} 
          title={t('sections.experience')} 
          onEdit={() => handleEditClick('workExperience')}
        />
        <Stack spacing={3}>
          {cvData.workExperience.map((exp, index) => (
            <Box key={index}>
              <Typography variant="subtitle1" fontWeight="bold">
                {exp.position}
              </Typography>
              <Typography variant="body1">{exp.companyName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {exp.location}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(exp.startDate)} - {exp.ongoing ? t('common.ongoing') : formatDate(exp.endDate)}
              </Typography>
              {exp.responsibilities?.length > 0 && (
                <Box sx={{ mt: 1 }}>
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
              {index < cvData.workExperience.length - 1 && (
                <Divider sx={{ mt: 2 }} />
              )}
            </Box>
          ))}
        </Stack>
      </Paper>
    );
  };

  const renderSkills = () => {
    if (!cvData?.skills?.length) return null;

    const getSkillColor = (level) => {
      switch (level) {
        case 'expert': return 'error';
        case 'advanced': return 'warning';
        case 'intermediate': return 'info';
        default: return 'default';
      }
    };

    return (
      <Paper elevation={1} sx={{ mb: 4, p: 3 }}>
        <SectionTitle 
          icon={SkillIcon} 
          title={t('sections.skills')} 
          onEdit={() => handleEditClick('skills')}
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {cvData.skills.map((skill, index) => (
            <Chip
              key={index}
              label={`${skill.skillName} (${t(`skills.levels.${skill.level}`)})`}
              color={getSkillColor(skill.level)}
              variant="outlined"
              size="small"
              sx={{ p: 1 }}
            />
          ))}
        </Box>
      </Paper>
    );
  };

  const renderLanguages = () => {
    if (!cvData?.languages?.length) return null;

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
      <Paper elevation={1} sx={{ mb: 4, p: 3 }}>
        <SectionTitle 
          icon={LanguageIcon} 
          title={t('sections.languages')} 
          onEdit={() => handleEditClick('languages')}
        />
        <Stack spacing={2}>
          {cvData.languages.map((lang, index) => (
            <Box key={index}>
              <Chip
                label={lang.language}
                color={getProficiencyColor(lang.proficiency)}
                variant="outlined"
                size="small"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2">
                {t(`languages.levels.${lang.proficiency}`)}
              </Typography>
              {lang.testName && (
                <Typography variant="body2" color="text.secondary">
                  {lang.testName}: {lang.testScore}
                </Typography>
              )}
              {index < cvData.languages.length - 1 && (
                <Divider sx={{ mt: 1 }} />
              )}
            </Box>
          ))}
        </Stack>
      </Paper>
    );
  };

  const renderHobbies = () => {
    if (!cvData?.hobbies?.length) return null;

    return (
      <Paper elevation={1} sx={{ mb: 4, p: 3 }}>
        <SectionTitle 
          icon={HobbyIcon} 
          title={t('sections.hobbies')} 
          onEdit={() => handleEditClick('hobbies')}
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {cvData.hobbies.map((hobby, index) => (
            <Chip
              key={index}
              label={hobby}
              color="default"
              variant="outlined"
              size="small"
              sx={{ p: 1 }}
            />
          ))}
        </Box>
      </Paper>
    );
  };
  const router = useRouter();

  if (!cvData) return null;

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push('/cvgen')}
        sx={{ 
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.light
          }
        }}
      >
        {t('editor.backToForm')}
      </Button>
      {renderPersonalInfo()}
      {renderEducation()}
      {renderWorkExperience()}
      {renderSkills()}
      {renderLanguages()}
      {renderHobbies()}

      <EditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        section={currentSection}
        data={currentSection ? cvData[currentSection] : null}
        onSave={handleSave}
        t={t}
      />
    </Box>
  );
};

export default CVInfos;