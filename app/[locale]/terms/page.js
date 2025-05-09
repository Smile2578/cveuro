import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import TermsPageClientLoader from '@/app/components/legal/TermsPageClientLoader';

export default async function TermsPage({ params: { locale } }) {
  setRequestLocale(locale);

  return (
    <Suspense>
      <TermsPageClientLoader locale={locale} />
    </Suspense>
  );
}

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }];
}