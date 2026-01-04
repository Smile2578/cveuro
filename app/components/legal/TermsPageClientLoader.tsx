// app/components/legal/TermsPageClientLoader.tsx
'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const TermsClient = dynamic(() => import('@/app/components/legal/TermsClient'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-geds-blue" />
    </div>
  )
});

interface TermsPageClientLoaderProps {
  locale: string;
}

export default function TermsPageClientLoader({ locale }: TermsPageClientLoaderProps) {
  return <TermsClient locale={locale} />;
}

