// app/[locale]/terms/page.tsx
import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import TermsPageClientLoader from '@/app/components/legal/TermsPageClientLoader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions d\'utilisation - CV Builder',
  description: 'Conditions d\'utilisation de CV Builder'
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
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

