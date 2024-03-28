import React from 'react';
import { useFormikContext, useField } from 'formik';
import { TextField, Grid, Select, MenuItem, InputLabel, FormControl, FormHelperText } from '@mui/material';
import countries from './Countries'; // Ensure this import path is correct

const PersonalInfoForm = () => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched } = useFormikContext();
  const [nationalityField, nationalityMeta] = useField('nationality');

  return (
    <Grid container spacing={2}>
      {/* Firstname, Lastname, Email, Phone Number, and Date of Birth fields */}
      <Grid item xs={12}>
        <TextField
          name="firstname"
          label="Prénom"
          value={values.firstname}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          error={touched.firstname && Boolean(errors.firstname)}
          helperText={touched.firstname && errors.firstname}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="lastname"
          label="Nom de famille"
          value={values.lastname}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          error={touched.lastname && Boolean(errors.lastname)}
          helperText={touched.lastname && errors.lastname}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="email"
          label="Email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          error={touched.email && Boolean(errors.email)}
          helperText={touched.email && errors.email}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="phoneNumber"
          label="Numéro de téléphone"
          value={values.phoneNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          error={touched.phoneNumber && Boolean(errors.phoneNumber)}
          helperText={touched.phoneNumber && errors.phoneNumber}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="dateofBirth"
          label="Date de naissance"
          type="date"
          value={values.dateofBirth}
          onChange={handleChange}
          onBlur={handleBlur}
          InputLabelProps={{ shrink: true }}
          fullWidth
          error={touched.dateofBirth && Boolean(errors.dateofBirth)}
          helperText={touched.dateofBirth && errors.dateofBirth}
        />
      </Grid>

      {/* Nationality */}
      <Grid item xs={12}>
        <FormControl fullWidth error={nationalityMeta.touched && Boolean(nationalityMeta.error)}>
          <InputLabel id="nationality-label">Nationalité</InputLabel>
          <Select
            labelId="nationality-label"
            {...nationalityField}
            value={nationalityField.value}
            onChange={(event) => {
              setFieldValue('nationality', event.target.value);
            }}
            onBlur={nationalityField.onBlur} // Ensure the field is marked as touched on blur
            renderValue={selected => selected ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  loading="lazy"
                  width="20"
                  src={`https://flagcdn.com/w20/${countries.find(c => c.label === selected)?.code.toLowerCase()}.png`}
                  alt=""
                  style={{ marginRight: 10 }}
                />
                {selected}
              </div>
            ) : <em>Choisissez une nationalité</em>}
          >
            {countries.map((option) => (
              <MenuItem key={option.code} value={option.label}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    loading="lazy"
                    width="20"
                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                    alt=""
                    style={{ marginRight: 10 }}
                  />
                  {option.label}
                </div>
              </MenuItem>
            ))}
          </Select>
          {nationalityMeta.touched && nationalityMeta.error && (
            <FormHelperText>{nationalityMeta.error}</FormHelperText>
          )}
        </FormControl>
      </Grid>
      {/* LinkedIn */}
      <Grid item xs={12}>
        <TextField
          name="linkedIn"
          label="LinkedIn"
          value={values.linkedIn}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          error={touched.linkedIn && Boolean(errors.linkedIn)}
          helperText={touched.linkedIn && errors.linkedIn}
        />
      </Grid>

      {/* Personal Website */}
      <Grid item xs={12}>
        <TextField
          name="personalWebsite"
          label="Site Web Personnel"
          value={values.personalWebsite}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          error={touched.personalWebsite && Boolean(errors.personalWebsite)}
          helperText={touched.personalWebsite && errors.personalWebsite}
        />
      </Grid>
    </Grid>
  );
};

export default PersonalInfoForm;