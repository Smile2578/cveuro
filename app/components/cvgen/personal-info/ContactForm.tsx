'use client';

import { useTranslations } from 'next-intl';
import { Mail } from 'lucide-react';
import FormSection from '../shared/FormSection';
import FormField from '../shared/FormField';

export default function ContactForm() {
  const t = useTranslations('cvform');

  return (
    <FormSection
      icon={Mail}
      title={t('personalInfo.contact.title')}
      description={t('personalInfo.contact.description')}
    >
      <FormField
        name="personalInfo.email"
        label={t('personalInfo.contact.email.label')}
        placeholder={t('personalInfo.contact.email.placeholder')}
        type="email"
        required
        autoComplete="email"
      />
      
      <FormField
        name="personalInfo.phoneNumber"
        label={t('personalInfo.contact.phone.label')}
        placeholder={t('personalInfo.contact.phone.placeholder')}
        type="tel"
        required
        autoComplete="tel"
      />
    </FormSection>
  );
}

