'use client';

import PersonalInfoStepper from './PersonalInfoStepper';
import IdentityForm from './IdentityForm';
import ContactForm from './ContactForm';
import InfoForm from './InfoForm';
import AddressForm from './AddressForm';
import SocialForm from './SocialForm';

export default function PersonalInfoForm() {
  return (
    <div className="w-full">
      <PersonalInfoStepper>
        <IdentityForm />
        <ContactForm />
        <InfoForm />
        <AddressForm />
        <SocialForm />
      </PersonalInfoStepper>
    </div>
  );
}

