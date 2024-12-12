"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { FieldArray, useFormikContext } from 'formik';
import { useTranslations } from 'next-intl';
import {
  TextField, Grid, Button, FormControl, InputLabel, Select, MenuItem,
  FormControlLabel, Checkbox, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, FormHelperText, Paper, Box, Typography
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import theme from '@/app/theme';

const EducationForm = () => {
  const { values, setFieldValue, errors, touched, handleBlur } = useFormikContext();
  const [open, setOpen] = useState(false);
  const [customDegree, setCustomDegree] = useState('');
  const [customDegrees, setCustomDegrees] = useState([]);
  const t = useTranslations('cvform');
  const v = useTranslations('validation');

  const defaultDegrees = useMemo(() => [
    t('education.degrees.bac'),
    t('education.degrees.license'),
    t('education.degrees.bachelor'),
    t('education.degrees.master'),
    t('education.degrees.phd'),
  ], [t]);

  useEffect(() => {
    const existingDegrees = values.education
      .map(edu => edu.degree)
      .filter(degree => degree && !defaultDegrees.includes(degree));
    if (JSON.stringify(existingDegrees) !== JSON.stringify(customDegrees)) {
      setCustomDegrees(existingDegrees);
    }
  }, [values.education, defaultDegrees, customDegrees]);

  const handleOpenCustomDegreeDialog = () => {
    setOpen(true);
  };

  const handleSaveCustomDegree = (index) => {
    if (customDegree) {
      const updatedCustomDegrees = [...customDegrees, customDegree];
      setCustomDegrees(updatedCustomDegrees);
      setFieldValue(`education[${index}].degree`, customDegree);
      setOpen(false);
      setCustomDegree('');
    }
  };

  const handleTextChange = (index, text) => {
    const newText = text.endsWith('\n') ? text : `${text}\n`;
    setFieldValue(`education[${index}].achievements`, newText.split('\n').filter(line => line.trim() !== ''));
  };

  const handleFocus = (index) => {
    const currentText = values.education[index].achievements.join('\n');
    if (!currentText) {
      setFieldValue(`education[${index}].achievements`, ['• ']);
    }
  };

  const handleAchievementsBlur = (index) => {
    const text = values.education[index].achievements.join('\n');
    const cleanedText = text.replace(/\n•\s*$/, '');
    setFieldValue(`education[${index}].achievements`, cleanedText.split('\n'));
  };

  const handleKeyPress = (index, event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      let text = values.education[index].achievements.join('\n');
      text += '\n• ';
      setFieldValue(`education[${index}].achievements`, text.split('\n'));
    }
  };

  const handleAddEducation = () => {
    const newEducation = {
      schoolName: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      ongoing: true,
      achievements: [''],
    };
    setFieldValue('education', [...values.education, newEducation]);
  };

  const handleRemoveEducation = (index) => {
    const filteredEducations = values.education.filter((_, i) => i !== index);
    setFieldValue('education', filteredEducations);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" color="primary" gutterBottom sx={{ mb: 1 }}>
        {t('education.title')}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {t('education.subtitle')}
      </Typography>
      
      <FieldArray name="education">
        {() => (
          <Grid container spacing={3} sx={{ maxWidth: '100%', justifyContent: 'center' }}>
            {values.education.map((education, index) => (
              <Grid item xs={12} key={index}>
                <Paper 
                  elevation={3}
                  sx={{
                    p: 3,
                    position: 'relative',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '12px',
                    '&:hover': {
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  {values.education.length > 1 && (
                    <IconButton
                      onClick={() => handleRemoveEducation(index)}
                      color="error"
                      sx={{
                        position: 'absolute',
                        right: -10,
                        top: -10,
                        backgroundColor: 'background.paper',
                        '&:hover': {
                          backgroundColor: 'error.light',
                          color: 'white',
                        },
                      }}
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  )}

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name={`education[${index}].schoolName`}
                        label={t('education.school')}
                        value={education.schoolName}
                        onChange={(e) => setFieldValue(`education[${index}].schoolName`, e.target.value)}
                        onBlur={handleBlur}
                        fullWidth
                        error={touched.education?.[index]?.schoolName && Boolean(errors.education?.[index]?.schoolName)}
                        helperText={touched.education?.[index]?.schoolName && errors.education?.[index]?.schoolName}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl 
                        fullWidth 
                        error={touched.education?.[index]?.degree && Boolean(errors.education?.[index]?.degree)}
                      >
                        <InputLabel>{t('education.degree')}</InputLabel>
                        <Select
                          name={`education[${index}].degree`}
                          value={education.degree}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === t('education.degrees.other')) {
                              handleOpenCustomDegreeDialog();
                            } else {
                              setFieldValue(`education[${index}].degree`, value);
                            }
                          }}
                          onBlur={handleBlur}
                          label={t('education.degree')}
                        >
                          {[...defaultDegrees, ...customDegrees].map((degree) => (
                            <MenuItem key={degree} value={degree}>{degree}</MenuItem>
                          ))}
                          <MenuItem value={t('education.degrees.other')}>{t('education.degrees.other')}</MenuItem>
                        </Select>
                        <FormHelperText>
                          {touched.education?.[index]?.degree && errors.education?.[index]?.degree}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        name={`education[${index}].fieldOfStudy`}
                        label={t('education.field')}
                        value={education.fieldOfStudy}
                        onChange={(e) => setFieldValue(`education[${index}].fieldOfStudy`, e.target.value)}
                        onBlur={handleBlur}
                        fullWidth
                        error={touched.education?.[index]?.fieldOfStudy && Boolean(errors.education?.[index]?.fieldOfStudy)}
                        helperText={touched.education?.[index]?.fieldOfStudy && errors.education?.[index]?.fieldOfStudy}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        name={`education[${index}].startDate`}
                        label={t('education.startDate')}
                        type="month"
                        value={education.startDate}
                        onChange={(e) => setFieldValue(`education[${index}].startDate`, e.target.value)}
                        onBlur={handleBlur}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={touched.education?.[index]?.startDate && Boolean(errors.education?.[index]?.startDate)}
                        helperText={touched.education?.[index]?.startDate && errors.education?.[index]?.startDate}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        name={`education[${index}].endDate`}
                        label={t('education.endDate')}
                        type="month"
                        value={education.endDate}
                        onChange={(e) => setFieldValue(`education[${index}].endDate`, e.target.value)}
                        onBlur={handleBlur}
                        fullWidth
                        disabled={education.ongoing}
                        InputLabelProps={{ shrink: true }}
                        error={touched.education?.[index]?.endDate && Boolean(errors.education?.[index]?.endDate)}
                        helperText={touched.education?.[index]?.endDate && errors.education?.[index]?.endDate}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name={`education[${index}].ongoing`}
                            checked={education.ongoing}
                            onChange={(e) => setFieldValue(`education[${index}].ongoing`, e.target.checked)}
                            sx={{ color: theme.palette.primary.main }}
                          />
                        }
                        label={t('education.ongoing')}
                        sx={{ mt: 1, color: 'text.secondary' }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        name={`education[${index}].achievements`}
                        label={t('education.achievements')}
                        value={education.achievements.join('\n')}
                        onChange={(e) => handleTextChange(index, e.target.value)}
                        onFocus={() => handleFocus(index)}
                        onBlur={() => handleAchievementsBlur(index)}
                        onKeyDown={(e) => handleKeyPress(index, e)}
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        placeholder={t('education.achievementsPlaceholder')}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                onClick={handleAddEducation}
                startIcon={<AddCircleOutlineIcon />}
                disabled={values.education.length >= 4}
                variant="outlined"
                color="primary"
                sx={{ 
                  mt: 2,
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                  },
                }}
              >
                {t('buttons.addDegree')}
              </Button>
            </Grid>
          </Grid>
        )}
      </FieldArray>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t('education.customDegree.title')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('education.customDegree.label')}
            type="text"
            fullWidth
            value={customDegree}
            onChange={(e) => setCustomDegree(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            {t('buttons.cancel')}
          </Button>
          <Button onClick={() => handleSaveCustomDegree(values.education.length - 1)} color="primary">
            {t('buttons.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EducationForm;