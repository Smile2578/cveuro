import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { Box, CircularProgress } from '@mui/material';

const TermsClient = dynamic(() => import('@/app/components/legal/TermsClient'), {
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

export default async function TermsPage({ params: { locale } }) {
  setRequestLocale(locale);

  return (
    <Suspense>
      <TermsClient locale={locale} />
    </Suspense>
  );
}

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }];
}