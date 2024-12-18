import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import CVEditClient from "@/app/components/cvedit/CVEditClient";
import { redirect } from 'next/navigation';

const LoadingFallback = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      width: '100%',
      backgroundColor: 'background.default'
    }}
  >
    <CircularProgress size={60} thickness={4} />
  </Box>
);

export default async function CVEditPage({ params: { locale }, searchParams }) {
  const { userId } = searchParams;
  
  if (!userId) {
    redirect('/');
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <CVEditClient locale={locale} userId={userId} />
    </Suspense>
  );
} 