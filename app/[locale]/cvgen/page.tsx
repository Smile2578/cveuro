// app/[locale]/cvgen/page.tsx
import CVGenPageClient from './CVGenPageClient';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Créer votre CV - CV Builder',
  description: 'Créez votre CV professionnel en quelques étapes simples'
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function CVGenPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = {
    welcome: (await import(`../../../public/locales/${locale}/welcome.json`)).default,
    common: (await import(`../../../public/locales/${locale}/common.json`)).default,
    cvform: (await import(`../../../public/locales/${locale}/cvform.json`)).default,
    validation: (await import(`../../../public/locales/${locale}/validation.json`)).default
  };
  
  return <CVGenPageClient locale={locale} messages={messages} />;
}

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }];
}

