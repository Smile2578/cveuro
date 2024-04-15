"use client";
import React, { useState, useEffect } from 'react';
import { FieldArray, useFormikContext } from 'formik';
import {
  TextField, Grid, Button, FormControl, InputLabel, Select, MenuItem,
  FormControlLabel, Checkbox, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, FormHelperText, Paper,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import theme from '@/app/theme';

const EducationForm = () => {
  const { values, setFieldValue, touched, errors } = useFormikContext();
  const [open, setOpen] = useState(false);
  const [customDegree, setCustomDegree] = useState('');
  const [customDegrees, setCustomDegrees] = useState([]);

  
    const handleOpenCustomDegreeDialog = () => {
      setOpen(true);
    };
  
    const handleSaveCustomDegree = (index) => {
      if (customDegree) {
        const updatedCustomDegrees = [...customDegrees, customDegree];
        setCustomDegrees(updatedCustomDegrees);
        setFieldValue(`education[${index}].degree`, customDegree);
        setOpen(false);
        setCustomDegree(''); // Reset custom degree input
      }
    };
  
    useEffect(() => {
      const existingDegrees = values.education.map(edu => edu.degree).filter(degree => degree && !['Baccalauréat', 'Licence', 'Bachelor', 'Master', 'Doctorat'].includes(degree));
      setCustomDegrees(existingDegrees);
    }, [values.education]);
  
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
  
    const handleBlur = (index) => {
      const text = values.education[index].achievements.join('\n');
      const cleanedText = text.replace(/\n•\s*$/, ''); // Remove the last bullet point if it's empty
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
        achievements: [],
        ongoing: false,
      };
      setFieldValue('education', [...values.education, newEducation]);
    };
  
    const handleRemoveEducation = (index) => {
      const filteredEducations = values.education.filter((_, i) => i !== index);
      setFieldValue('education', filteredEducations);
    };


  return (
    <FieldArray name="education">
      {() => (
        <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> 
          {values.education.map((education, index) => (
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
                    {values.education.length > 1 && (
                  <IconButton
                    onClick={() => handleRemoveEducation(index)}
                    color="error"
                    style={{ position: 'absolute', right: -14, top: -14 }}
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                    )}
            <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <TextField
                  name={`education[${index}].schoolName`}
                  label="Nom de l'école*"
                  value={education.schoolName}
                  onChange={e => setFieldValue(`education[${index}].schoolName`, e.target.value)}
                  fullWidth
                  error={touched.education?.[index]?.schoolName && Boolean(errors.education?.[index]?.schoolName)}
                  helperText={touched.education?.[index]?.schoolName && errors.education?.[index]?.schoolName}
                />
              </Grid>

              {/* Degree Selection with "Autres" option */}
              <Grid item xs={12}>
                <FormControl fullWidth error={touched.education?.[index]?.degree && Boolean(errors.education?.[index]?.degree)}>
                  <InputLabel>Diplôme*</InputLabel>
                  <Select
                    name={`education[${index}].degree`}
                    value={education.degree}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === 'Autres') {
                        handleOpenCustomDegreeDialog();
                      } else {
                        setFieldValue(`education[${index}].degree`, value);
                      }
                    }}
                    displayEmpty
                  >
                    {['Baccalauréat', 'Licence', 'Bachelor', 'Master', 'Doctorat', ...customDegrees].map((degree) => (
                      <MenuItem key={degree} value={degree}>{degree}</MenuItem>
                    ))}
                    <MenuItem value="Autres">Autres</MenuItem>
                  </Select>
                  <FormHelperText>{touched.education?.[index]?.degree && errors.education?.[index]?.degree}</FormHelperText>
                </FormControl>
              </Grid>

              {/* Custom Degree Dialog */}
              <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Entrez un diplôme personnalisé</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Diplôme personnalisé"
                    type="text"
                    fullWidth
                    value={customDegree}
                    onChange={(e) => setCustomDegree(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpen(false)}>Annuler</Button>
                  <Button onClick={() => handleSaveCustomDegree(index)}>Sauvegarder</Button>
                </DialogActions>
              </Dialog>

              <Grid item xs={12}>
                <TextField
                  name={`education[${index}].fieldOfStudy`}
                  label="Domaine d'étude*"
                  value={education.fieldOfStudy}
                  onChange={e => setFieldValue(`education[${index}].fieldOfStudy`, e.target.value)}
                  fullWidth
                  error={touched.education?.[index]?.fieldOfStudy && Boolean(errors.education?.[index]?.fieldOfStudy)}
                  helperText={touched.education?.[index]?.fieldOfStudy && errors.education?.[index]?.fieldOfStudy}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name={`education[${index}].startDate`}
                  label="Date de début (MM/YYYY)*"
                  type="month"
                  value={education.startDate}
                  onChange={e => setFieldValue(`education[${index}].startDate`, e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={touched.education?.[index]?.startDate && Boolean(errors.education?.[index]?.startDate)}
                  helperText={touched.education?.[index]?.startDate && errors.education?.[index]?.startDate}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name={`education[${index}].endDate`}
                  label="Date de fin (MM/YYYY)"
                  type="month"
                  value={education.endDate}
                  onChange={e => setFieldValue(`education[${index}].endDate`, e.target.value)}
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
                      onChange={e => setFieldValue(`education[${index}].ongoing`, e.target.checked)}
                      style={{ color: theme.palette.primary.main }}
                    />
                  }
                  label="En cours"
                  sx={{ color: 'grey' }}
                />
              </Grid>

              <Grid item xs={12} style={{marginLeft: 10}}>
              <TextField
                name={`education[${index}].achievements`}
                label="Accomplissements et distinctions"
                value={education.achievements.join('\n')}
                onChange={e => handleTextChange(index, e.target.value)}
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
          <Button
            onClick={handleAddEducation}
            startIcon={<AddCircleOutlineIcon />}
            disabled={values.education.length >= 4}
          >
            Ajouter un diplôme
          </Button>
        </Grid>
        </Grid>
      )}
    </FieldArray>
  );
};

export default EducationForm;