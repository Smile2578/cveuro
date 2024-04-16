"use client";
import React, { useState, useEffect } from 'react';
import { useFormikContext, FieldArray, } from 'formik';
import {
  TextField,
  Grid,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';


const WorkExperienceForm = ({ onNext }) => { 
  const { values, setFieldValue, touched, errors } = useFormikContext();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  useEffect(() => {
    // Make sure responsibilities are always treated as arrays
    values.workExperience.forEach((exp, index) => {
      if (typeof exp.responsibilities === 'string' || !exp.responsibilities) {
        setFieldValue(`workExperience[${index}].responsibilities`, exp.responsibilities ? exp.responsibilities.split('\n') : ['• ']);
      }
    });
  }, [values.workExperience, setFieldValue]);

  const handleAddWorkExperience = () => {
    if (values.workExperience.length < 4) {
    const newExperience = {
      companyName: '',
      location: '',
      position: '',
      startDate: '',
      endDate: '',
      responsibilities: [''],
      ongoing: false,
    };
    setFieldValue('workExperience', [...values.workExperience, newExperience]);
  };
};

  const handleRemoveWorkExperience = (index) => {
    const updatedWorkExperience = values.workExperience.filter((_, i) => i !== index);
    setFieldValue('workExperience', updatedWorkExperience);
  };

  const handleSkipConfirmation = () => {
    setOpenConfirmDialog(true);
};

const handleConfirmSkip = () => {
  setOpenConfirmDialog(false);
  onNext({ skipWorkExperience: true }); // Pass this object correctly
};


    const handleCloseDialog = () => {
        setOpenConfirmDialog(false);
    };


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

  const handleBlur = (index) => {
    const responsibilities = values.workExperience[index].responsibilities;
    const cleanedResponsibilities = responsibilities.filter(line => line.trim() !== '');
    if (!cleanedResponsibilities.length) {
      setFieldValue(`workExperience[${index}].responsibilities`, []);
    } else {
      setFieldValue(`workExperience[${index}].responsibilities`, cleanedResponsibilities);
    }
  };

  return (
    <>
      <FieldArray name="workExperience">
        {() => (
          <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> 
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => handleNext(formik.values, formikBag, { skipWorkExperience: true })}
                disabled={isSubmitting}
                sx={{ m: 2 }}
              >
                Je n&apos;ai pas encore d&apos;expérience professionnelle
              </Button>
            </Grid>
            {values.workExperience.map((exp, index) => (
              <React.Fragment key={index}>
                <Paper 
                    elevation={1} 
                    style={{
                      padding: 16, 
                      margin: '8px', 
                      position: 'relative',
                      border: '3px solid #e0e0e0',  // Light grey border
                      boxShadow: '3 2px 4px rgba(0,0,0,0.1)' 
                    }}
                  >
                  {values.workExperience.length > 1 && (
                  <IconButton
                    onClick={() => handleRemoveWorkExperience(index)}
                    color="error"
                    style={{ position: 'absolute', right: -14, top: -14 }}
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                    )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name={`workExperience[${index}].companyName`}
                label="Nom de l'entreprise"
                value={exp.companyName}
                onChange={e => setFieldValue(`workExperience[${index}].companyName`, e.target.value)}
                fullWidth
                error={touched.workExperience?.[index]?.companyName && Boolean(errors.workExperience?.[index]?.companyName)}
                helperText={touched.workExperience?.[index]?.companyName && errors.workExperience?.[index]?.companyName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name={`workExperience[${index}].location`}
                label="Lieu (ville, pays)"
                value={exp.location}
                onChange={e => setFieldValue(`workExperience[${index}].location`, e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name={`workExperience[${index}].position`}
                label="Poste"
                value={exp.position}
                onChange={e => setFieldValue(`workExperience[${index}].position`, e.target.value)}
                fullWidth
                error={touched.workExperience?.[index]?.position && Boolean(errors.workExperience?.[index]?.position)}
                helperText={touched.workExperience?.[index]?.position && errors.workExperience?.[index]?.position}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name={`workExperience[${index}].startDate`}
                label="Date de début (MM/YYYY)"
                type="month"
                value={exp.startDate}
                onChange={e => setFieldValue(`workExperience[${index}].startDate`, e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={touched.workExperience?.[index]?.startDate && Boolean(errors.workExperience?.[index]?.startDate)}
                helperText={touched.workExperience?.[index]?.startDate && errors.workExperience?.[index]?.startDate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name={`workExperience[${index}].endDate`}
                label="Date de fin (MM/YYYY)"
                type="month"
                value={exp.endDate}
                onChange={e => setFieldValue(`workExperience[${index}].endDate`, e.target.value)}
                fullWidth
                disabled={exp.ongoing}
                InputLabelProps={{ shrink: true }}
                error={touched.workExperience?.[index]?.endDate && Boolean(errors.workExperience?.[index]?.endDate)}
                helperText={touched.workExperience?.[index]?.endDate && errors.workExperience?.[index]?.endDate}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name={`workExperience[${index}].ongoing`}
                    checked={exp.ongoing}
                    onChange={e => setFieldValue(`workExperience[${index}].ongoing`, e.target.checked)}
                  />
                }
                label="En cours"
                sx={{ color: 'grey' }}
              />
            </Grid>
            <Grid item xs={12}>
            <TextField
                    name={`workExperience[${index}].responsibilities`}
                    label="Responsabilités"
                    value={exp.responsibilities.join('\n')}
                    onChange={e => handleTextChange(index, e)}
                    onFocus={() => handleFocus(index)}
                    onBlur={() => handleBlur(index)}
                    onKeyDown={e => handleKeyPress(index, e)}
                    multiline
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
            </Grid>
                </Paper>
              </React.Fragment>
            ))}
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={handleAddWorkExperience} startIcon={<AddCircleOutlineIcon />} disabled={values.workExperience.length >= 4}>
              Ajouter une expérience
            </Button>
            </Grid>
          </Grid>
        )}
      </FieldArray>
      <Dialog open={openConfirmDialog} onClose={handleCloseDialog}>
        <DialogTitle>{'Confirmer'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir passer cette section sans ajouter d&apos;expérience professionnelle?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleConfirmSkip} color="primary" autoFocus>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WorkExperienceForm;