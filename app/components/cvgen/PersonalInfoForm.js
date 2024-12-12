"use client";
import React from 'react';
import { useFormikContext } from 'formik';
import { useTranslations } from 'next-intl';
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
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircle from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import PublicIcon from '@mui/icons-material/Public';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LinkIcon from '@mui/icons-material/Link';
import sortedCountries from './Countries';

const StyledTextField = styled(TextField)({
  '& .MuiFormHelperText-root': {
    minHeight: '1.5em',
    marginTop: '2px',
  },
});

const InputWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  position: 'relative',
  width: '100%',
  marginRight: '24px',
  '& .MuiIconButton-root': {
    position: 'absolute',
    left: -48,
    top: 8,
  },
}));

const GenderWrapper = styled(FormControl)(({ theme }) => ({
  marginTop: -8,
  '& .MuiFormLabel-root': {
    transform: 'translate(0, -1.5px) scale(0.75)',
    transformOrigin: 'top left',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  '& .MuiFormHelperText-root': {
    minHeight: '1.5em',
    marginTop: '2px',
  },
}));

const GenderBox = styled(FormControlLabel)(({ theme, selected }) => ({
  border: `2px solid ${selected ? '#1976d2' : '#e0e0e0'}`,
  borderRadius: '4px',
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
  const { values, handleChange, handleBlur, errors, touched } = useFormikContext();
  const t = useTranslations('cvform');

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" color="primary" gutterBottom sx={{ mb: 2 }}>
        {t('personalInfo.title')}
      </Typography>
    <Grid container spacing={2.5} columnSpacing={6} sx={{ pl: 6 }}>
      <Grid item xs={12} sm={6}>
        <InputWrapper>
          <IconButton size="small">
            <AccountCircle />
          </IconButton>
          <StyledTextField
            name="firstname"
            label={t('personalInfo.firstName')}
            value={values.firstname}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.firstname && Boolean(errors.firstname)}
            helperText={(touched.firstname && errors.firstname) || ' '}
            fullWidth
          />
        </InputWrapper>
      </Grid>

      <Grid item xs={12} sm={6}>
        <StyledTextField
          name="lastname"
          label={t('personalInfo.lastName')}
          value={values.lastname}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.lastname && Boolean(errors.lastname)}
          helperText={(touched.lastname && errors.lastname) || ' '}
          fullWidth
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <InputWrapper>
          <IconButton size="small">
            <EmailIcon />
          </IconButton>
          <StyledTextField
            name="email"
            label={t('personalInfo.email')}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && Boolean(errors.email)}
            helperText={(touched.email && errors.email) || ' '}
            fullWidth
          />
        </InputWrapper>
      </Grid>

      <Grid item xs={12} sm={6}>
        <InputWrapper>
          <StyledTextField
            name="phoneNumber"
            label={t('personalInfo.phone')}
            value={values.phoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.phoneNumber && Boolean(errors.phoneNumber)}
            helperText={(touched.phoneNumber && errors.phoneNumber) || ' '}
            fullWidth
          />
        </InputWrapper>
      </Grid>

      <Grid item xs={12} sm={6}>
        <InputWrapper>
          <IconButton size="small">
            <DateRangeIcon />
          </IconButton>
          <StyledTextField
            name="dateofBirth"
            label={t('personalInfo.birthDate')}
            type="date"
            value={values.dateofBirth}
            onChange={handleChange}
            onBlur={handleBlur}
            InputLabelProps={{ shrink: true }}
            error={touched.dateofBirth && Boolean(errors.dateofBirth)}
            helperText={(touched.dateofBirth && errors.dateofBirth) || ' '}
            fullWidth
            sx={{ mt: 2 }}
          />
        </InputWrapper>
      </Grid>

      <Grid item xs={12} sm={6}>
        <GenderWrapper error={touched.sex && Boolean(errors.sex)} fullWidth>
          <FormLabel component="legend">{t('personalInfo.gender.label')}</FormLabel>
          <Box>
            <RadioGroup 
              row 
              name="sex" 
              value={values.sex || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <GenderBox
                control={<Radio />}
                label={t('personalInfo.gender.male')}
                value="M"
                selected={values.sex === 'M'}
              />
              <GenderBox
                control={<Radio />}
                label={t('personalInfo.gender.female')}
                value="F"
                selected={values.sex === 'F'}
              />
            </RadioGroup>
          </Box>
          <FormHelperText>
            {(touched.sex && errors.sex) || ' '}
          </FormHelperText>
        </GenderWrapper>
      </Grid>

      <Grid item xs={12}>
        <InputWrapper>
          <IconButton size="small">
            <HomeIcon />
          </IconButton>
          <StyledTextField
            name="address"
            label={t('personalInfo.address')}
            value={values.address}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.address && Boolean(errors.address)}
            helperText={(touched.address && errors.address) || ' '}
            fullWidth
          />
        </InputWrapper>
      </Grid>

      <Grid item xs={6}>
        <StyledTextField
          name="zip"
          label={t('personalInfo.zipCode')}
          value={values.zip}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.zip && Boolean(errors.zip)}
          helperText={(touched.zip && errors.zip) || ' '}
          fullWidth
        />
      </Grid>

      <Grid item xs={6}>
        <StyledTextField
          name="city"
          label={t('personalInfo.city')}
          value={values.city}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.city && Boolean(errors.city)}
          helperText={(touched.city && errors.city) || ' '}
          fullWidth
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <InputWrapper>
          <IconButton size="small">
            <PublicIcon />
          </IconButton>
          <StyledTextField
            name="placeofBirth"
            label={t('personalInfo.birthPlace')}
            value={values.placeofBirth}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.placeofBirth && Boolean(errors.placeofBirth)}
            helperText={(touched.placeofBirth && errors.placeofBirth) || ' '}
            fullWidth
          />
        </InputWrapper>
      </Grid>

      <Grid item xs={6}>
        <FormControl 
          fullWidth 
          error={touched.nationality && Boolean(errors.nationality)}
        >
          <InputLabel id="nationality-label">{t('personalInfo.nationality')}</InputLabel>
          <Select
            labelId="nationality-label"
            name="nationality"
            value={values.nationality || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            label={t('personalInfo.nationality')}
          >
            {sortedCountries.map((option) => (
              <MenuItem key={option.code} value={option.label}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText sx={{ minHeight: '1.5em' }}>
            {(touched.nationality && errors.nationality) || ' '}
          </FormHelperText>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <InputWrapper>
          <IconButton size="small">
            <LinkIcon />
          </IconButton>
          <StyledTextField
            name="linkedIn"
            label={t('personalInfo.linkedin')}
            value={values.linkedIn}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.linkedIn && Boolean(errors.linkedIn)}
            helperText={(touched.linkedIn && errors.linkedIn) || ' '}
            fullWidth
          />
        </InputWrapper>
      </Grid>

      <Grid item xs={12} sm={6}>
        <StyledTextField
          name="personalWebsite"
          label={t('personalInfo.website')}
          value={values.personalWebsite}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.personalWebsite && Boolean(errors.personalWebsite)}
          helperText={(touched.personalWebsite && errors.personalWebsite) || ' '}
          fullWidth
        />
      </Grid>
    </Grid>
    </Box>
  );
};

export default PersonalInfoForm;
