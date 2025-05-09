"use client";

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

export default function TermsPageClientLoader({ locale }) {
  // Forward the locale prop to TermsClient if it needs it
  return <TermsClient locale={locale} />;
} 