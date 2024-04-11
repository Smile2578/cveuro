import React from 'react';
import { useFormikContext, useField, Form } from 'formik';
import {
  TextField,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  IconButton,
  RadioGroup,
  Box,
  Radio,
  FormControlLabel,
  FormLabel,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import PublicIcon from '@mui/icons-material/Public';
import DateRangeIcon from '@mui/icons-material/DateRange';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import LinkIcon from '@mui/icons-material/Link';
import sortedCountries from './Countries'; // Ensure this import path is correct
import styled from '@emotion/styled';




const GenderBox = styled(FormControlLabel)(({ theme, selected }) => ({
  border: `2px solid ${selected ? '#1976d2' : '#e0e0e0'}`, // Using hardcoded colors for demo
  borderRadius: '4px', // Adjusted for a unified look
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0px', 
  marginRight: '8px', 
  cursor: 'pointer',
  height: '56px',
  backgroundColor: selected ? '#bbdefb' : 'transparent', 
  '&:last-child': {
    marginRight: '0px', 
  },
  '& .MuiSvgIcon-root': { 
    fill: selected ? '#1976d2' : '#757575', 
  },
  '& .MuiFormControlLabel-label': { 
    color: 'black', 
  },
}));



const PersonalInfoForm = () => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext();
  const [nationalityField, nationalityMeta] = useField('nationality');

  return (
    <Grid container spacing={2} alignItems="flex-end">
      <Grid item xs={12} sm={6}>
        <IconButton>
          <AccountCircle />
        </IconButton>
        <TextField
          name="firstname"
          label="Prénom(s)"
          value={values.firstname}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.firstname && Boolean(errors.firstname)}
          helperText={touched.firstname && errors.firstname}
          fullWidth
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          name="lastname"
          label="Nom de famille"
          value={values.lastname}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.lastname && Boolean(errors.lastname)}
          helperText={touched.lastname && errors.lastname}
          fullWidth
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <IconButton>
          <EmailIcon />
        </IconButton>
        <TextField
          name="email"
          label="Email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email && Boolean(errors.email)}
          helperText={touched.email && errors.email}
          fullWidth
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <IconButton>
          <PhoneIcon />
        </IconButton>
        <TextField
          name="phoneNumber"
          label="Numéro de téléphone"
          value={values.phoneNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.phoneNumber && Boolean(errors.phoneNumber)}
          helperText={touched.phoneNumber && errors.phoneNumber}
          fullWidth
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <IconButton>
          <DateRangeIcon />
        </IconButton>
        <TextField
          name="dateofBirth"
          label="Date de naissance"
          type="date"
          value={values.dateofBirth}
          onChange={handleChange}
          onBlur={handleBlur}
          InputLabelProps={{ shrink: true }}
          error={touched.dateofBirth && Boolean(errors.dateofBirth)}
          helperText={touched.dateofBirth && errors.dateofBirth}
          fullWidth
        />
      </Grid>


      <Grid item xs={12} sm={6}>
        <FormLabel component="legend">Sexe</FormLabel>
        <RadioGroup row name="sex" value={values.sex || ''}>
          <GenderBox
            control={<Radio />}
            label="Masculin"
            value="M"
            selected={values.sex === 'M'}
            onClick={() => setFieldValue('sex', 'M')}
          />
          <GenderBox
            control={<Radio />}
            label="Féminin"
            value="F"
            selected={values.sex === 'F'}
            onClick={() => setFieldValue('sex', 'F')}
          />
        </RadioGroup>
        {touched.sex && errors.sex && <FormHelperText error>{errors.sex}</FormHelperText>}
      </Grid>


      <Grid item xs={12}>
        <IconButton>
          <HomeIcon />
        </IconButton>
        <TextField
          name="address"
          label="Adresse"
          value={values.address}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete='off'
          error={touched.address && Boolean(errors.address)}
          helperText={touched.address && errors.address}
          fullWidth
        />
      </Grid>

      {/* Combine Zip and City into a single row */}
      <Grid item xs={6}>
        <TextField
          name="zip"
          label="Code postal"
          value={values.zip}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.zip && Boolean(errors.zip)}
          helperText={touched.zip && errors.zip}
          fullWidth
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          name="city"
          label="Ville"
          value={values.city}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.city && Boolean(errors.city)}
          helperText={touched.city && errors.city}
          fullWidth
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <IconButton>
          <PublicIcon />
        </IconButton>
        <TextField
          name="placeofBirth"
          label="Lieu de naissance (Ville)"
          value={values.placeofBirth}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.placeofBirth && Boolean(errors.placeofBirth)}
          helperText={touched.placeofBirth && errors.placeofBirth}
          fullWidth
        />
      </Grid>
      

      <Grid item xs={6}>
  <FormControl fullWidth error={nationalityMeta.touched && Boolean(nationalityMeta.error)}>
    <InputLabel id="nationality-label">Nationalité</InputLabel>
    <Select
        labelId="nationality-label"
        {...nationalityField}
        value={nationalityField.value || ''}
        onChange={(event) => setFieldValue('nationality', event.target.value)}
        onBlur={nationalityField.onBlur}
      >
      {sortedCountries.map((option) => (
        <MenuItem key={option.code} value={option.label}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
    {nationalityMeta.touched && nationalityMeta.error && <FormHelperText>{nationalityMeta.error}</FormHelperText>}
  </FormControl>
</Grid>

      <Grid item xs={12} sm={6}>
        <IconButton>
          <LinkIcon />
        </IconButton>
        <TextField
          name="linkedIn"
          label="LinkedIn"
          value={values.linkedIn}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.linkedIn && Boolean(errors.linkedIn)}
          helperText={touched.linkedIn && errors.linkedIn}
          fullWidth
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          name="personalWebsite"
          label="Site Web Personnel"
          value={values.personalWebsite}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.personalWebsite && Boolean(errors.personalWebsite)}
          helperText={touched.personalWebsite && errors.personalWebsite}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

export default PersonalInfoForm;
