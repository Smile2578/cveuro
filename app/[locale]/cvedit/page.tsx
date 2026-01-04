import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import CVEditClient from '@/app/components/cvedit/CVEditClient';
import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center h-screen w-full bg-gray-50">
      <Loader2 className="w-12 h-12 animate-spin text-geds-blue" />
    </div>
  );
}

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ userId?: string }>;
}

export default async function CVEditPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { userId } = await searchParams;
  
  setRequestLocale(locale);
  
  if (!userId) {
    redirect('/');
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <CVEditClient key={userId} locale={locale} userId={userId} />
    </Suspense>
  );
}

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }];
}

