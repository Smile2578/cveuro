'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import AccountBenefitsBanner from '../auth/AccountBenefitsBanner';
import { useAuth } from '@/app/hooks/useAuth';

// Import dynamique des composants
const NavBar = dynamic(() => import('../common/NavBar'), {
  ssr: false,
  loading: () => <div className="h-16" />
});

const CVEditor = dynamic(() => import('./CVEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-full">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )
});

interface CVData {
  personalInfo?: {
    firstname?: string;
    lastname?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    zip?: string;
    sex?: string;
    dateofBirth?: string;
    nationality?: { code: string; label: string }[];
    linkedIn?: string;
    personalWebsite?: string;
    [key: string]: unknown;
  };
  education?: Array<{
    schoolName: string;
    degree: string;
    customDegree?: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    ongoing?: boolean;
    achievements?: string[];
  }>;
  workExperience?: Array<{
    companyName: string;
    position: string;
    location: string;
    startDate: string;
    endDate?: string;
    ongoing?: boolean;
    responsibilities?: string[];
  }>;
  skills?: Array<{
    skillName: string;
    level: string;
  }>;
  languages?: Array<{
    language: string;
    proficiency: string;
    testName?: string;
    testScore?: string;
  }>;
  hobbies?: string[];
  [key: string]: unknown;
}

interface CVEditClientProps {
  initialData?: CVData | null;
  locale: string;
  userId?: string;
}

export default function CVEditClient({ initialData, locale, userId }: CVEditClientProps) {
  const [cvData, setCvData] = useState<CVData | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const router = useRouter();
  const t = useTranslations('cvedit');
  const fetchAttemptedRef = useRef(false);
  
  // Get authentication state from the auth hook
  const { isGuest } = useAuth();

  // Show account benefits banner for guest users after 3 seconds
  useEffect(() => {
    if (isGuest && !isLoading && cvData) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isGuest, isLoading, cvData]);

  useEffect(() => {
    // Prevent double fetch in React 18 Strict Mode
    if (fetchAttemptedRef.current) return;
    
    // If we have initialData, use it directly
    if (initialData) {
      setCvData(initialData);
      setIsLoading(false);
      return;
    }

    // If no userId, redirect to home
    if (!userId) {
      router.push('/');
      return;
    }

    // Fetch CV data
    fetchAttemptedRef.current = true;
    
    const fetchCVData = async () => {
      try {
        const response = await fetch(`/api/cvedit/fetchCV?userId=${userId}`, {
          cache: 'no-store', // Prevent caching issues
        });
        
        if (response.status === 404) {
          setError('notFound');
          setTimeout(() => {
            router.push(`/${locale}/cvgen`);
          }, 3000);
          return;
        }
        
        if (!response.ok) throw new Error('Failed to fetch CV data');
        
        const data = await response.json();
        setCvData(data);
      } catch (err) {
        console.error("Error fetching CV data:", err);
        setError('fetch');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCVData();
  }, [initialData, router, userId, locale]);

  const handleUpdate = async (updatedData: CVData) => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/cvedit/updateCV?userId=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) throw new Error('Failed to update CV');

      setCvData(updatedData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating CV:", err);
      setError('update');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        ease: "easeInOut"
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground">{t('editor.loading')}</p>
      </div>
    );
  }

  if (error === 'notFound') {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)]">
        <h2 className="text-xl font-semibold text-foreground">{t('editor.noUser')}</h2>
        <p className="text-muted-foreground">{t('editor.redirecting')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)]">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-6 mt-16">
        {/* Account benefits banner for guest users */}
        {isGuest && showBanner && (
          <div className="mb-6">
            <AccountBenefitsBanner 
              variant="inline" 
              onDismiss={() => setShowBanner(false)}
            />
          </div>
        )}
        
        <AnimatePresence mode="wait">
          <motion.div
            key="cv-editor"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex-1"
          >
            {cvData && (
              <CVEditor 
                cvData={cvData}
                onUpdate={handleUpdate}
                showSuccess={showSuccess}
                locale={locale}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

