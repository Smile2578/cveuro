"use client";
import React, { useState } from 'react';
import { FieldArray, useFormikContext } from 'formik';
import { useTranslations } from 'next-intl';
import {
  TextField,
  Grid,
  Button,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Box,
  Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import theme from '@/app/theme';

const WorkExperienceForm = () => {
  const { values, setFieldValue, errors, touched, handleBlur } = useFormikContext();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const t = useTranslations('cvform');
  const v = useTranslations('validation');

  const handleTextChange = (index, event) => {
    const newText = event.target.value;
    const newResponsibilities = newText.split('\n').filter(line => line.trim() !== '');
    setFieldValue(`workExperience[${index}].responsibilities`, newResponsibilities);
  };

  const handleKeyPress = (index, event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const responsibilities = values.workExperience[index].responsibilities;
      const newText = responsibilities.join('\n') + '\n• ';
      setFieldValue(`workExperience[${index}].responsibilities`, newText.split('\n'));
    }
  };

  const handleFocus = (index) => {
    const responsibilities = values.workExperience[index].responsibilities;
    if (!responsibilities.length || responsibilities[0] === '') {
      setFieldValue(`workExperience[${index}].responsibilities`, ['• ']);
    }
  };

  const handleResponsibilitiesBlur = (index) => {
    const responsibilities = values.workExperience[index].responsibilities;
    const cleanedResponsibilities = responsibilities.filter(line => line.trim() !== '');
    if (!cleanedResponsibilities.length) {
      setFieldValue(`workExperience[${index}].responsibilities`, []);
    } else {
      setFieldValue(`workExperience[${index}].responsibilities`, cleanedResponsibilities);
    }
  };

  const handleAddWorkExperience = () => {
    const newExperience = {
      companyName: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      ongoing: true,
      responsibilities: [''],
    };
    setFieldValue('workExperience', [...values.workExperience, newExperience]);
    setFieldValue('hasWorkExp', true);
  };

  const handleRemoveWorkExperience = (index) => {
    const updatedWorkExperience = values.workExperience.filter((_, i) => i !== index);
    setFieldValue('workExperience', updatedWorkExperience);
  };

  const handleConfirmSkip = () => {
    setFieldValue('hasWorkExp', false);
    setFieldValue('workExperience', []);
    setOpenConfirmDialog(false);
  };

  const handleSkipConfirmation = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenConfirmDialog(false);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" color="primary" gutterBottom sx={{ mb: 1 }}>
        {t('workExperience.title')}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {t('workExperience.subtitle')}
      </Typography>

      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button
          variant="outlined"
          onClick={handleSkipConfirmation}
          disabled={values.isSubmitting}
          sx={{
            '&:hover': {
              backgroundColor: 'primary.light',
              color: 'white',
            },
          }}
        >
          {t('workExperience.noExperience')}
        </Button>
      </Box>

      {values.hasWorkExp && (
        <FieldArray name="workExperience">
          {() => (
            <Grid container spacing={3} sx={{ maxWidth: '100%', justifyContent: 'center' }}>
              {values.workExperience.map((experience, index) => (
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
                    {values.workExperience.length > 1 && (
                      <IconButton
                        onClick={() => handleRemoveWorkExperience(index)}
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
                          name={`workExperience[${index}].companyName`}
                          label={t('workExperience.company')}
                          value={experience.companyName}
                          onChange={(e) => setFieldValue(`workExperience[${index}].companyName`, e.target.value)}
                          onBlur={handleBlur}
                          fullWidth
                          error={touched.workExperience?.[index]?.companyName && Boolean(errors.workExperience?.[index]?.companyName)}
                          helperText={touched.workExperience?.[index]?.companyName && t(`validation.required.company`)}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          name={`workExperience[${index}].position`}
                          label={t('workExperience.position')}
                          value={experience.position}
                          onChange={(e) => setFieldValue(`workExperience[${index}].position`, e.target.value)}
                          onBlur={handleBlur}
                          fullWidth
                          error={touched.workExperience?.[index]?.position && Boolean(errors.workExperience?.[index]?.position)}
                          helperText={touched.workExperience?.[index]?.position && t(`validation.required.position`)}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          name={`workExperience[${index}].location`}
                          label={t('workExperience.location')}
                          value={experience.location}
                          onChange={(e) => setFieldValue(`workExperience[${index}].location`, e.target.value)}
                          onBlur={handleBlur}
                          fullWidth
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          name={`workExperience[${index}].startDate`}
                          label={t('workExperience.startDate')}
                          type="month"
                          value={experience.startDate}
                          onChange={(e) => setFieldValue(`workExperience[${index}].startDate`, e.target.value)}
                          onBlur={handleBlur}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          error={touched.workExperience?.[index]?.startDate && Boolean(errors.workExperience?.[index]?.startDate)}
                          helperText={touched.workExperience?.[index]?.startDate && t(`validation.required.startDate`)}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          name={`workExperience[${index}].endDate`}
                          label={t('workExperience.endDate')}
                          type="month"
                          value={experience.endDate}
                          onChange={(e) => setFieldValue(`workExperience[${index}].endDate`, e.target.value)}
                          onBlur={handleBlur}
                          fullWidth
                          disabled={experience.ongoing}
                          InputLabelProps={{ shrink: true }}
                          error={touched.workExperience?.[index]?.endDate && Boolean(errors.workExperience?.[index]?.endDate)}
                          helperText={touched.workExperience?.[index]?.endDate && errors.workExperience?.[index]?.endDate}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              name={`workExperience[${index}].ongoing`}
                              checked={experience.ongoing}
                              onChange={(e) => setFieldValue(`workExperience[${index}].ongoing`, e.target.checked)}
                              sx={{ color: theme.palette.primary.main }}
                            />
                          }
                          label={t('workExperience.ongoing')}
                          sx={{ mt: 1, color: 'text.secondary' }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          name={`workExperience[${index}].responsibilities`}
                          label={t('workExperience.responsibilities')}
                          value={experience.responsibilities.join('\n')}
                          onChange={(e) => handleTextChange(index, e)}
                          onFocus={() => handleFocus(index)}
                          onBlur={() => handleResponsibilitiesBlur(index)}
                          onKeyDown={(e) => handleKeyPress(index, e)}
                          multiline
                          rows={4}
                          fullWidth
                          variant="outlined"
                          placeholder={t('workExperience.responsibilitiesPlaceholder')}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  onClick={handleAddWorkExperience}
                  startIcon={<AddCircleOutlineIcon />}
                  disabled={values.workExperience.length >= 4}
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
                  {t('buttons.addExperience')}
                </Button>
              </Grid>
            </Grid>
          )}
        </FieldArray>
      )}

      <Dialog open={openConfirmDialog} onClose={handleCloseDialog}>
        <DialogTitle>{t('workExperience.skipConfirm.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('workExperience.skipConfirm.message')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            {t('buttons.cancel')}
          </Button>
          <Button onClick={handleConfirmSkip} color="primary">
            {t('buttons.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkExperienceForm;