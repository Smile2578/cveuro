import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Grid, Typography } from '@mui/material';
import CountrySelect from './CountrySelect'; // Ensure this path is correct
import theme from '@/app/theme'; // Adjust the import path as needed

// Validation Schema
const PersonalInfoSchema = Yup.object().shape({
  firstname: Yup.string().required('Le prénom est obligatoire'),
  lastname: Yup.string().required('Le nom est obligatoire'),
  email: Yup.string().email('L\'email est invalide').required('L\'email est obligatoire'),
  phoneNumber: Yup.string().required('Le numéro de téléphone est obligatoire'),
  linkedIn: Yup.string().url('L\'URL LinkedIn est invalide'),
  personalWebsite: Yup.string().url('L\'URL du site personnel est invalide'),
  nationality: Yup.object().nullable().required('La nationalité est obligatoire'),
  dateOfBirth: Yup.date().required('La date de naissance est obligatoire').max(new Date(), 'La date de naissance ne peut pas être dans le futur'),
});

const PersonalInfoForm = ({ onNext }) => {
  return (
    <Formik
      initialValues={{
        firstname: '',
        lastname: '',
        email: '',
        phoneNumber: '',
        linkedIn: '',
        personalWebsite: '',
        nationality: { code: 'FR', label: 'France', phone: '33' },
        dateOfBirth: '',
      }}
      validationSchema={PersonalInfoSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values);
        onNext(); // Placeholder for next form section transition
      }}
    >
      {({ errors, touched, handleChange, handleSubmit, values, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ padding: '20px', '& .MuiTextField-root': { margin: '8px' }, '& .MuiButtonBase-root': { margin: '20px auto', display: 'block', backgroundColor: '#1976d2', color: '#ffffff' } }}>
            <Grid item xs={12}>
              <Field
                component={TextField}
                name="firstname"
                fullWidth
                label="Tout vos prénoms"
                variant="outlined"
                error={touched.firstname && Boolean(errors.firstname)}
                helperText={touched.firstname && errors.firstname}
              />
            </Grid>
  
            <Grid item xs={12}>
              <Field
                component={TextField}
                name="lastname"
                fullWidth
                label="Nom de Famille"
                variant="outlined"
                error={touched.lastname && Boolean(errors.lastname)}
                helperText={touched.lastname && errors.lastname}
              />
            </Grid>

            <Grid item xs={12}>
              <Field name="dateOfBirth">
                {({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    label="Date de naissance"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    variant="outlined"
                    error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                    helperText={touched.dateOfBirth && errors.dateOfBirth}
                    sx={{
                      '&:focus-within': {
                        animation: 'pulse 1.5s infinite',
                      },
                      '@keyframes pulse': {
                        '0%': { boxShadow: '0 0 0 0px rgba(0, 123, 255, 0.5)' },
                        '100%': { boxShadow: '0 0 0 20px rgba(0, 123, 255, 0)' },
                      },
                    }}
                  />
                )}
              </Field>
            </Grid>
  
            <Grid item xs={12}>
              <Field
                component={TextField}
                name="email"
                fullWidth
                label="Email"
                variant="outlined"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
            </Grid>

            <Grid item xs={12}>
              <Field name="nationality">
                {({ form }) => (
                  <CountrySelect
                    onCountryChange={(value) => form.setFieldValue('nationality', value)}
                    label="Nationalité"
                    sx={{ width: '50%' }}
                  />
                )}
              </Field>
            </Grid>
  
            <Grid container item spacing={2} alignItems="center">
              
              <Grid item xs>
                <TextField
                  name="phoneNumber"
                  label="Numéro de téléphone"
                  variant="outlined"
                  fullWidth
                  value={values.phoneNumber.replace(/^[+]\d+/, '')} // Strip prefix if present
                  onChange={handleChange}
                  error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                  helperText={touched.phoneNumber && errors.phoneNumber}
                  autoComplete="off"
                />
              </Grid>
            </Grid>
  
            <Grid item xs={12}>
              <Field
                component={TextField}
                name="linkedIn"
                fullWidth
                label="LinkedIn"
                variant="outlined"
                error={touched.linkedIn && Boolean(errors.linkedIn)}
                helperText={touched.linkedIn && errors.linkedIn}
              />
            </Grid>
  
            <Grid item xs={12}>
              <Field
                component={TextField}
                name="personalWebsite"
                fullWidth
                label="Site Web Personnel"
                variant="outlined"
                error={touched.personalWebsite && Boolean(errors.personalWebsite)}
                helperText={touched.personalWebsite && errors.personalWebsite}
              />
            </Grid>
  
  
            <Grid item xs={12}>
              <Button type="submit" variant="contained" sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}>
                Continuer
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default PersonalInfoForm;
