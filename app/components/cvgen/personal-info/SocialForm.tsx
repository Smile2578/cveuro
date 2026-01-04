'use client';

import { useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';
import FormSection from '../shared/FormSection';
import FormField from '../shared/FormField';

export default function SocialForm() {
  const t = useTranslations('cvform');

  return (
    <FormSection
      icon={Globe}
      title={t('personalInfo.social.title')}
      description={t('personalInfo.social.description')}
    >
      <FormField
        name="personalInfo.linkedIn"
        label={t('personalInfo.social.linkedin.label')}
        placeholder={t('personalInfo.social.linkedin.placeholder')}
        type="url"
      />
      
      <FormField
        name="personalInfo.personalWebsite"
        label={t('personalInfo.social.website.label')}
        placeholder={t('personalInfo.social.website.placeholder')}
        type="url"
      />
    </FormSection>
  );
}

