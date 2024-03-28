import React, { useState } from 'react';
import { FieldArray, useFormikContext } from 'formik';
import {
  TextField,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  FormHelperText
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
  
    const handleAddEducation = () => {
      const newEducation = {
        schoolName: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        achievements: '',
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
        <Grid container spacing={2}>
          {values.education.map((education, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12}>
                <TextField
                  name={`education[${index}].schoolName`}
                  label="Nom de l'école"
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
                  <InputLabel>Diplôme</InputLabel>
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
                  label="Domaine d'étude"
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
                  label="Date de début (MM/YYYY)"
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

              <Grid item xs={12}>
                <TextField
                  name={`education[${index}].achievements`}
                  label="Réalisations principales, distinctions, etc."
                  value={education.achievements}
                  onChange={e => setFieldValue(`education[${index}].achievements`, e.target.value)}
                  fullWidth
                  multiline
                  error={touched.education?.[index]?.achievements && Boolean(errors.education?.[index]?.achievements)}
                  helperText={touched.education?.[index]?.achievements && errors.education?.[index]?.achievements}
                />
              </Grid>

              {values.education.length > 1 && (
                <Grid item xs={12} display="flex" justifyContent="flex-end">
                  <IconButton onClick={() => handleRemoveEducation(index)} color="error">
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </Grid>
              )}
            </React.Fragment>
          ))}
          <Grid item xs={12} display="flex" justifyContent="flex-start">
            <Button onClick={handleAddEducation} startIcon={<AddCircleOutlineIcon />}>
              Ajouter un diplôme
            </Button>
          </Grid>
        </Grid>
      )}
    </FieldArray>
  );
};

export default EducationForm;