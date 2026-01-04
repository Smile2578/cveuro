// app/components/legal/PrivacyPageClientLoader.tsx
'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const PrivacyClient = dynamic(() => import('@/app/components/legal/PrivacyClient'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-geds-blue" />
    </div>
  )
});

interface PrivacyPageClientLoaderProps {
  locale: string;
}

export default function PrivacyPageClientLoader({ locale }: PrivacyPageClientLoaderProps) {
  return <PrivacyClient locale={locale} />;
}

