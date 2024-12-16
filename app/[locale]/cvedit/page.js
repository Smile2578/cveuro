import { Suspense } from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import CVEditClient from "@/app/components/cvedit/CVEditClient";
import { useTranslations } from 'next-intl';
import { redirect } from 'next/navigation';
import Link from 'next/link';

async function getCVData(userId) {
  if (!userId) return null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cvedit/fetchCV?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch CV');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching CV:', error);
    return null;
  }
}

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

  const cvData = await getCVData(userId);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <CVEditClient initialData={cvData} locale={locale} />
    </Suspense>
  );
} 