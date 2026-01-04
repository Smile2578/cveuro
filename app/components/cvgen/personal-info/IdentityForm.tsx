'use client';

import { useTranslations } from 'next-intl';
import { User } from 'lucide-react';
import FormSection from '../shared/FormSection';
import FormField from '../shared/FormField';

export default function IdentityForm() {
  const t = useTranslations('cvform');

  return (
    <FormSection
      icon={User}
      title={t('personalInfo.identity.title')}
      description={t('personalInfo.identity.description')}
    >
      <FormField
        name="personalInfo.firstname"
        label={t('personalInfo.identity.firstName.label')}
        placeholder={t('personalInfo.identity.firstName.placeholder')}
        required
        autoComplete="given-name"
      />
      
      <FormField
        name="personalInfo.lastname"
        label={t('personalInfo.identity.lastName.label')}
        placeholder={t('personalInfo.identity.lastName.placeholder')}
        required
        autoComplete="family-name"
      />
    </FormSection>
  );
}

