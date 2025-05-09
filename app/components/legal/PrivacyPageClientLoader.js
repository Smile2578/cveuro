"use client";

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

export default function PrivacyPageClientLoader({ locale }) {
  // Forward the locale prop to PrivacyClient if it needs it
  return <PrivacyClient locale={locale} />;
} 