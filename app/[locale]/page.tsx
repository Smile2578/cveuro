// app/[locale]/page.tsx
import { setRequestLocale } from 'next-intl/server';
import LandingPage from '../components/LandingPage';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  return <LandingPage />;
}

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }];
}

