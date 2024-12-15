// app/components/cvgen/personal-info/PersonalInfoForm.js

'use client';

import React from 'react';
import { Box } from '@mui/material';
import PersonalInfoStepper from './PersonalInfoStepper';
import IdentityForm from './IdentityForm';
import ContactForm from './ContactForm';
import InfoForm from './InfoForm';
import AddressForm from './AddressForm';
import SocialForm from './SocialForm';

const PersonalInfoForm = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <PersonalInfoStepper>
        <IdentityForm />
        <ContactForm />
        <InfoForm />
        <AddressForm />
        <SocialForm />
      </PersonalInfoStepper>
    </Box>
  );
};

export default PersonalInfoForm; 