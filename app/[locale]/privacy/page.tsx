// app/[locale]/privacy/page.tsx
import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import PrivacyPageClientLoader from '@/app/components/legal/PrivacyPageClientLoader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialité - CV Builder',
  description: 'Politique de confidentialité de CV Builder'
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
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

