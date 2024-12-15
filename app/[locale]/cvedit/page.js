import { Suspense } from 'react';
import CVEditClient from "@/app/components/cvedit/CVEditClient";

export const metadata = {
  title: 'CV Editor',
  description: 'Edit your CV online',
};

async function getCVData(userId) {
  if (!userId) return null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cvgen/getCV?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch CV');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching CV:', error);
    return null;
  }
}

export default async function CVEditPage({ searchParams }) {
  const { userId } = searchParams;
  const cvData = userId ? await getCVData(userId) : null;

  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <CVEditClient initialData={cvData} />
    </Suspense>
  );
} 