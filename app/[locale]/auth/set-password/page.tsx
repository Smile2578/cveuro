import { Suspense } from 'react';
import SetPasswordClient from './client';

interface SetPasswordPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SetPasswordPage({ params }: SetPasswordPageProps) {
  const { locale } = await params;
  
  return (
    <Suspense fallback={<SetPasswordSkeleton />}>
      <SetPasswordClient locale={locale} />
    </Suspense>
  );
}

function SetPasswordSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)]">
      <div className="w-12 h-12 rounded-full border-4 border-geds-blue/20 border-t-geds-blue animate-spin" />
    </div>
  );
}
