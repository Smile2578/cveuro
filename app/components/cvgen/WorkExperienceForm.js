import React, { useState } from 'react';
import { useFormikContext } from 'formik';
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
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const WorkExperienceForm = ({ onNext }) => { // Assume onNext is passed correctly
  const { values, setFieldValue, touched, errors } = useFormikContext();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleAddWorkExperience = () => {
    const newExperience = {
      companyName: '',
      location: '',
      position: '',
      startDate: '',
      endDate: '',
      responsibilities: '',
      ongoing: false,
    };
    setFieldValue('workExperience', [...values.workExperience, newExperience]);
  };

  const handleRemoveWorkExperience = (index) => {
    const updatedWorkExperience = values.workExperience.filter((_, i) => i !== index);
    setFieldValue('workExperience', updatedWorkExperience);
  };

  const handleNoExperience = () => {
    setOpenConfirmDialog(true);
  };

  const confirmNoExperience = () => {
    setFieldValue('noExperience', true); // Set the flag
    onNext?.();
    setOpenConfirmDialog(false);
  };
  
  return (
    <>
      <Grid container spacing={2}>
        {values.workExperience.map((exp, index) => (
          <React.Fragment key={index}>
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
                label="Lieu (ville ou adresse)"
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
                value={exp.responsibilities}
                onChange={e => setFieldValue(`workExperience[${index}].responsibilities`, e.target.value)}
                fullWidth
                multiline
                error={touched.workExperience?.[index]?.responsibilities && Boolean(errors.workExperience?.[index]?.responsibilities)}
                helperText={touched.workExperience?.[index]?.responsibilities && errors.workExperience?.[index]?.responsibilities}
              />
            </Grid>
            {values.workExperience.length > 1 && (
              <Grid item xs={12}>
                <IconButton onClick={() => handleRemoveWorkExperience(index)} color="error">
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Grid>
            )}
          </React.Fragment>
        ))}
        <Grid item xs={12}>
          <Button onClick={handleAddWorkExperience} startIcon={<AddCircleOutlineIcon />}>
            Ajouter une expérience
          </Button>
        </Grid>
        <Grid item xs={12}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setOpenConfirmDialog(true)} // Open confirmation dialog
        >
          Je n'ai pas encore d'expérience professionnelle
        </Button>
      </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>
          {"Confirmer l'absence d'expérience professionnelle"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir continuer sans ajouter d'expérience professionnelle ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Retour</Button>
          <Button onClick={confirmNoExperience} autoFocus>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WorkExperienceForm;
