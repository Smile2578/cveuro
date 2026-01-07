'use client';

import { useState, useRef, useEffect } from 'react';
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
  autoPrint?: boolean;
}

export default function CVEditClient({ initialData, locale, userId, autoPrint = false }: CVEditClientProps) {
  const router = useRouter();
  const t = useTranslations('cvedit');
  const [showSuccess, setShowSuccess] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  
  // Local state for CV data (reset on each mount)
  const [cvData, setCvData] = useState<CVData | null>(initialData || null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!initialData);
  
  // Get authentication state
  const { isAnonymous, userId: authUserId, isInitializing } = useAuth();

  // Fetch CV data on mount
  useEffect(() => {
    // Skip if we have initial data or still initializing auth
    if (initialData || isInitializing) {
      return;
    }

    const fetchCV = async () => {
      const queryUserId = userId || authUserId;
      
      if (!queryUserId) {
        router.push('/');
        return;
      }

      try {
        const response = await fetch(`/api/cvedit/fetchCV?userId=${queryUserId}`, {
          cache: 'no-store',
        });
        
        if (response.status === 404) {
          setCvError('notFound');
          setIsLoading(false);
          
          setTimeout(() => {
            router.push(`/${locale}/cvgen`);
          }, 3000);
          return;
        }
        
        if (!response.ok) throw new Error('Failed to fetch CV data');
        
        const data = await response.json();
        setCvData(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching CV data:", err);
        setCvError('fetch');
        setIsLoading(false);
      }
    };

    fetchCV();
  }, [initialData, userId, authUserId, isInitializing, locale, router]);

  const handleUpdate = async (updatedData: CVData) => {
    const queryUserId = userId || authUserId;
    if (!queryUserId) return;

    try {
      const response = await fetch(`/api/cvedit/updateCV?userId=${queryUserId}`, {
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
      setCvError('update');
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

  if (isLoading || isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground">{t('editor.loading')}</p>
      </div>
    );
  }

  if (cvError === 'notFound') {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)]">
        <h2 className="text-xl font-semibold text-foreground">{t('editor.notFound')}</h2>
        <p className="text-muted-foreground">{t('editor.redirecting')}</p>
      </div>
    );
  }

  // Show banner for anonymous users (not dismissed)
  const shouldShowBanner = isAnonymous && !bannerDismissed && cvData;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)]">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-6 mt-16">
        {/* Account benefits banner for anonymous users */}
        {shouldShowBanner && (
          <div className="mb-6">
            <AccountBenefitsBanner 
              variant="inline" 
              onDismiss={() => setBannerDismissed(true)}
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
                autoPrint={autoPrint}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
