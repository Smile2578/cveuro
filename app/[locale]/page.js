// app/[locale]/page.js
import LandingPageClient from './LandingPageClient';
import { getTranslations } from 'next-intl/server';

export default async function LandingPage() {
  const t = await getTranslations('common');
  
  return <LandingPageClient />;
} 