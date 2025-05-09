import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import PrivacyPageClientLoader from '@/app/components/legal/PrivacyPageClientLoader';

export default async function PrivacyPage({ params: { locale } }) {
  setRequestLocale(locale);

  return (
    <Suspense>
      <PrivacyPageClientLoader locale={locale} />
    </Suspense>
  );
}

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }];
}