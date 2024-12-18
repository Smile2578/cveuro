// app/[locale]/page.js
import LandingPageClient from './LandingPageClient';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function LandingPage({ params: { locale } }) {
  setRequestLocale(locale);
  
  const t = await getTranslations('common');
  
  return <LandingPageClient />;
}

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }];
} 