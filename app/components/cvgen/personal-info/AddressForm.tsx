'use client';

import { useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';
import FormSection from '../shared/FormSection';
import FormField from '../shared/FormField';

export default function AddressForm() {
  const t = useTranslations('cvform');

  return (
    <FormSection
      icon={MapPin}
      title={t('personalInfo.address.title')}
      description={t('personalInfo.address.description')}
    >
      <FormField
        name="personalInfo.address"
        label={t('personalInfo.address.street.label')}
        placeholder={t('personalInfo.address.street.placeholder')}
        required
        autoComplete="street-address"
      />
      
      <FormField
        name="personalInfo.city"
        label={t('personalInfo.address.city.label')}
        placeholder={t('personalInfo.address.city.placeholder')}
        required
        autoComplete="address-level2"
      />
      
      <FormField
        name="personalInfo.zip"
        label={t('personalInfo.address.zip.label')}
        placeholder={t('personalInfo.address.zip.placeholder')}
        required
        autoComplete="postal-code"
      />
    </FormSection>
  );
}

