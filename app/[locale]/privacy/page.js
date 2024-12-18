import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { Box, CircularProgress } from '@mui/material';

const PrivacyClient = dynamic(() => import('@/app/components/legal/PrivacyClient'), {
  ssr: false,
  loading: () => (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}
    >
      <CircularProgress />
    </Box>
  )
});

export default async function PrivacyPage({ params: { locale } }) {
  setRequestLocale(locale);

  return (
    <Suspense>
      <PrivacyClient locale={locale} />
    </Suspense>
  );
}

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }];
}