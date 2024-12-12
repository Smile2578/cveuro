import React, { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { useTranslations } from 'next-intl';
import {
  TextField, Grid, Typography, Divider, IconButton, Chip, Box, Select,
  MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  FormControl, InputLabel, FormHelperText, Checkbox, FormControlLabel, useTheme, useMediaQuery,
  Snackbar, Alert
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import theme from '@/app/theme';

const CombinedForm = () => {
  const { values, setFieldValue, validateForm, setFieldError } = useFormikContext();
  const [isTestTaken, setIsTestTaken] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState({ language: '', proficiency: '', testName: '', testScore: '' });
  const [newSkill, setNewSkill] = useState({ skillName: '', level: '' });
  const [newHobby, setNewHobby] = useState('');
  const [languageError, setLanguageError] = useState('');
  const [levelError, setLevelError] = useState('');
  const [skillNameError, setSkillNameError] = useState('');
  const [skillLevelError, setSkillLevelError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const t = useTranslations('cvform');

  useEffect(() => {
    if (values.languages.length === 0) {
      setFieldError('languages', t('validation.minLanguages'));
      setSnackbarMessage(t('validation.minLanguages'));
      setSnackbarOpen(true);
    } else {
      setFieldError('languages', undefined);
    }
  }, [values.languages, setFieldError, t]);

  const proficiencyLevels = [
    t('additional.languages.levels.a1'),
    t('additional.languages.levels.a2'),
    t('additional.languages.levels.b1'),
    t('additional.languages.levels.b2'),
    t('additional.languages.levels.c1'),
    t('additional.languages.levels.c2'),
    t('additional.languages.levels.native')
  ];

  const skillLevels = [
    t('additional.skills.levels.beginner'),
    t('additional.skills.levels.intermediate'),
    t('additional.skills.levels.advanced'),
    t('additional.skills.levels.expert'),
    t('additional.skills.levels.master')
  ];

  const addValidItem = (item, arrayName) => {
    if (arrayName === 'languages') {
      if (item.language && item.proficiency) {
        const newArray = [...values[arrayName], item];
        setFieldValue(arrayName, newArray);
        resetItemState(arrayName);
      }
    } else if (arrayName === 'skills') {
      if (item.skillName && item.level) {
        const newArray = [...values[arrayName], item];
        setFieldValue(arrayName, newArray);
        resetItemState(arrayName);
      } else if (!item.level) {
        setFieldError('skills.global', t('validation.required.level'));
      }
    } else if (arrayName === 'hobbies' && item.trim()) {
      const newArray = [...values[arrayName], item];
      setFieldValue(arrayName, newArray);
      resetItemState(arrayName);
    }
  };

  const resetItemState = (arrayName) => {
    if (arrayName === 'languages') {
      setCurrentLanguage({ language: '', proficiency: '', testName: '', testScore: '' });
    } else if (arrayName === 'skills') {
      setNewSkill({ skillName: '', level: '' });
      setFieldError('skills.global', undefined);
    } else if (arrayName === 'hobbies') {
      setNewHobby('');
    }
  };

  const handleAddSkill = () => {
    let hasError = false;

    if (!newSkill.skillName) {
      setSkillNameError(t('validation.required.skillName'));
      hasError = true;
    } else {
      setSkillNameError('');
    }

    if (!newSkill.level && newSkill.level !== 0) {
      setSkillLevelError(t('validation.required.level'));
      hasError = true;
    } else {
      setSkillLevelError('');
    }

    if (hasError) {
      setSnackbarMessage(t('validation.skillRequired'));
      setSnackbarOpen(true);
      return;
    }

    const newArray = [...values.skills, newSkill];
    setFieldValue('skills', newArray);
    setNewSkill({ skillName: '', level: '' });
    setSkillNameError('');
    setSkillLevelError('');
  };

  const handleNewItem = (e, item, setItem, fieldName) => {
    e.preventDefault();
    addValidItem(item, fieldName);
  };

  const handleLanguageSubmit = () => {
    let hasError = false;

    if (!currentLanguage.language) {
      setLanguageError(t('validation.required.language'));
      hasError = true;
    } else {
      setLanguageError('');
    }

    if (!currentLanguage.proficiency) {
      setLevelError(t('validation.required.level'));
      hasError = true;
    } else {
      setLevelError('');
    }

    if (hasError) {
      setSnackbarMessage(t('validation.languageRequired'));
      setSnackbarOpen(true);
      return;
    }

    const newArray = [...values.languages, currentLanguage];
    setFieldValue('languages', newArray);
    setCurrentLanguage({ language: '', proficiency: '', testName: '', testScore: '' });
    setLanguageError('');
    setLevelError('');
  };

  const finalizeLanguageAddition = () => {
    const newArray = [...values.languages, currentLanguage];
    setFieldValue('languages', newArray);
    resetLanguageForm();
    setFieldError('languages.global', undefined);
  };

  const resetLanguageForm = () => {
    setCurrentLanguage({ language: '', proficiency: '', testName: '', testScore: '' });
    setIsTestTaken(false);
    setTestDialogOpen(false);
  };

  const handleTestDialogSave = () => {
    finalizeLanguageAddition();
    setTestDialogOpen(false);
  };

  const handleRemoveItem = (fieldName, index) => {
    const updatedItems = values[fieldName].filter((_, i) => i !== index);
    setFieldValue(fieldName, updatedItems);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Grid container spacing={2} onSubmit={(e) => e.preventDefault()}>
        <Grid item xs={12}>
          <Typography variant="h6" color={theme.palette.primary.main}>{t('additional.languages.title')}</Typography>
          <Divider style={{ margin: '1px 0 40px 0', width: '180px' }} />
          {values.languages.length === 0 && (
            <Typography color="error" variant="caption" sx={{ display: 'block', mb: 2 }}>
              {t('validation.minLanguages')}
            </Typography>
          )}
          <Box flexDirection={isMobile ? 'column' : 'row'} display="flex" gap={2} alignItems="center">
            <TextField
              label={t('additional.languages.language')}
              variant="outlined"
              size="small"
              style={{ width: '30%' }}
              value={currentLanguage.language}
              onChange={(e) => {
                setCurrentLanguage({ ...currentLanguage, language: e.target.value });
                setLanguageError('');
              }}
              error={Boolean(languageError)}
              helperText={languageError}
            />

            <FormControl error={Boolean(levelError)} size="small" style={{ width: '30%' }}>
              <InputLabel>{t('additional.languages.level')}</InputLabel>
              <Select
                value={currentLanguage.proficiency}
                onChange={(e) => {
                  setCurrentLanguage({ ...currentLanguage, proficiency: e.target.value });
                  setLevelError('');
                }}
                label={t('additional.languages.level')}
                style={{ width: '105%' }}
              >
                {proficiencyLevels.map((level) => (
                  <MenuItem key={level} value={level}>{level}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{levelError}</FormHelperText>
            </FormControl>

            <FormControlLabel
              control={<Checkbox checked={isTestTaken} onChange={(e) => { setIsTestTaken(e.target.checked); setTestDialogOpen(e.target.checked); }} />}
              label={t('additional.languages.test.label')}
              style={{ marginLeft: '5px' }}
            />
            <IconButton onClick={handleLanguageSubmit} size="small">
              {t('buttons.addLanguage')}
              <AddCircleOutlineIcon style={{ marginLeft: '10px' }}/>
            </IconButton>
          </Box>
          {values.languages.map((language, index) => (
            <Chip
              key={index}
              label={`${language.language} (${language.proficiency}) ${language.testName ? `- ${language.testName}` : ''} ${language.testScore ? `: ${language.testScore}` : ''}`}
              onDelete={() => handleRemoveItem('languages', index)}
              color="primary"
              variant="outlined"
              style={{ margin: '5px' }}
            />
          ))}
        </Grid>

        <Dialog open={testDialogOpen} onClose={() => setTestDialogOpen(false)}>
          <DialogTitle>{t('additional.languages.test.title')}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={t('additional.languages.test.name')}
              type="text"
              fullWidth
              value={currentLanguage.testName}
              onChange={(e) => setCurrentLanguage({ ...currentLanguage, testName: e.target.value })}
            />
            <TextField
              margin="dense"
              label={t('additional.languages.test.score')}
              type="text"
              fullWidth
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleTestDialogSave(); }}}
              value={currentLanguage.testScore}
              onChange={(e) => setCurrentLanguage({ ...currentLanguage, testScore: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTestDialogOpen(false)}>{t('buttons.cancel')}</Button>
            <Button onClick={handleTestDialogSave}>{t('buttons.save')}</Button>
          </DialogActions>
        </Dialog>

        <Grid item xs={12}>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="h6" color={theme.palette.primary.main}>{t('additional.skills.title')}</Typography>
          <Divider style={{ margin: '1px 0 40px 0', width: '140px' }} />
          <Box flexDirection={isMobile ? 'column' : 'row'} display="flex" gap={2} alignItems="center">
            <TextField
              label={t('additional.skills.name')}
              variant="outlined"
              size="small"
              value={newSkill.skillName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              onChange={(e) => {
                setNewSkill({ ...newSkill, skillName: e.target.value });
                setSkillNameError('');
              }}
              error={Boolean(skillNameError)}
              helperText={skillNameError}
              style={{ width: '50%' }}
            />

            <FormControl error={Boolean(skillLevelError)} size="small" style={{ width: 'calc(30% - 10px)' }}>
              <InputLabel>{t('additional.skills.level')}</InputLabel>
              <Select
                value={newSkill.level}
                onChange={(e) => {
                  setNewSkill({ ...newSkill, level: e.target.value });
                  setSkillLevelError('');
                }}
                label={t('additional.skills.level')}
              >
                {skillLevels.map((level, index) => (
                  <MenuItem key={index} value={index}>{level}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{skillLevelError}</FormHelperText>
            </FormControl>

            <IconButton onClick={handleAddSkill} size="small">
              {t('buttons.addSkill')}
              <AddCircleOutlineIcon style={{ marginLeft: '10px' }}/>
            </IconButton>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="h6" color={theme.palette.primary.main}>{t('additional.hobbies.title')}</Typography>
          <Divider style={{ margin: '1px 0 40px 0', width: '100px' }} />
          <Box flexDirection={isMobile ? 'column' : 'row'} display="flex" gap={2} alignItems="center">
            <TextField
              label={t('additional.hobbies.placeholder')}
              variant="outlined"
              size="small"
              value={newHobby}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleNewItem(e, newHobby, setNewHobby, 'hobbies');
                }
              }}
              onChange={(e) => setNewHobby(e.target.value)}
              style={{ width: '50%' }}
            />
            <IconButton onClick={(e) => handleNewItem(e, newHobby, setNewHobby, 'hobbies')} size="small">
              <AddCircleOutlineIcon />
            </IconButton>
          </Box>
          <Box display="flex" flexWrap="wrap" alignItems="center" mt={2}>
            {values.hobbies.map((hobby, index) => (
              <Chip
                key={index}
                label={hobby}
                onDelete={() => handleRemoveItem('hobbies', index)}
                color="primary"
                variant="outlined"
                style={{ margin: '5px' }}
              />
            ))}
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CombinedForm;