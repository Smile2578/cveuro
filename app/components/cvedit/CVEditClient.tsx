'use client';

import { useState, useRef, useSyncExternalStore } from 'react';
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

// External store for CV data fetching
let cvData: CVData | null = null;
let cvError: string | null = null;
let cvLoading = true;
let cvListeners: Set<() => void> = new Set();

function notifyCVListeners() {
  cvListeners.forEach(listener => listener());
}

export default function CVEditClient({ initialData, locale, userId }: CVEditClientProps) {
  const router = useRouter();
  const t = useTranslations('cvedit');
  const fetchAttemptedRef = useRef(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  
  // Get authentication state
  const { isAnonymous, userId: authUserId, isInitializing } = useAuth();

  // Use external store for CV data
  const currentCVData = useSyncExternalStore(
    (listener) => {
      cvListeners.add(listener);
      return () => cvListeners.delete(listener);
    },
    () => cvData,
    () => null
  );

  const currentError = useSyncExternalStore(
    (listener) => {
      cvListeners.add(listener);
      return () => cvListeners.delete(listener);
    },
    () => cvError,
    () => null
  );

  const isLoading = useSyncExternalStore(
    (listener) => {
      cvListeners.add(listener);
      return () => cvListeners.delete(listener);
    },
    () => cvLoading,
    () => true
  );

  // Initialize on client side
  if (typeof window !== 'undefined' && !fetchAttemptedRef.current && !isInitializing) {
    fetchAttemptedRef.current = true;

    // If we have initialData, use it
    if (initialData) {
      cvData = initialData;
      cvLoading = false;
      notifyCVListeners();
    } else if (authUserId) {
      // Fetch CV data
      const fetchCV = async () => {
        try {
          const queryUserId = userId || authUserId;
          const response = await fetch(`/api/cvedit/fetchCV?userId=${queryUserId}`, {
            cache: 'no-store',
          });
          
          if (response.status === 404) {
            cvError = 'notFound';
            cvLoading = false;
            notifyCVListeners();
            
            setTimeout(() => {
              router.push(`/${locale}/cvgen`);
            }, 3000);
            return;
          }
          
          if (!response.ok) throw new Error('Failed to fetch CV data');
          
          const data = await response.json();
          cvData = data;
          cvLoading = false;
          notifyCVListeners();
        } catch (err) {
          console.error("Error fetching CV data:", err);
          cvError = 'fetch';
          cvLoading = false;
          notifyCVListeners();
        }
      };

      fetchCV();
    } else if (!userId) {
      // No userId and no auth - redirect to home
      router.push('/');
    }
  }

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

      cvData = updatedData;
      notifyCVListeners();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating CV:", err);
      cvError = 'update';
      notifyCVListeners();
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

  if (currentError === 'notFound') {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)]">
        <h2 className="text-xl font-semibold text-foreground">{t('editor.noUser')}</h2>
        <p className="text-muted-foreground">{t('editor.redirecting')}</p>
      </div>
    );
  }

  // Show banner for anonymous users (not dismissed)
  const shouldShowBanner = isAnonymous && !bannerDismissed && currentCVData;

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
            {currentCVData && (
              <CVEditor 
                cvData={currentCVData}
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
