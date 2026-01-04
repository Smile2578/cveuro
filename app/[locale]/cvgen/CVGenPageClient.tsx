// app/[locale]/cvgen/CVGenPageClient.tsx
'use client';

import React, { Suspense, useState, useCallback, useRef, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { NextIntlClientProvider } from 'next-intl';
import { useCVStore } from '../../store/cvStore';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Loading component
function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex justify-center items-center", className)}>
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

// Dynamic imports with loading states
const NavBar = dynamic(() => import('../../components/common/NavBar'), {
  loading: () => <div className="h-16" />,
  ssr: false
});

const DynamicForm = dynamic(() => import('../../components/cvgen/Form'), {
  loading: () => <LoadingSpinner className="h-[60vh]" />,
  ssr: false
});

const DynamicWelcomeDialog = dynamic(() => import('../../components/cvgen/welcome/WelcomeDialog'), {
  loading: () => <LoadingSpinner className="h-[60vh]" />,
  ssr: false
});

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    transition: { duration: 0.3 } 
  }
};

// Storage subscription for SSR safety
function subscribeToStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getStorageSnapshot(key: string): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
}

function getServerSnapshot(): null {
  return null;
}

interface CVGenPageClientProps {
  locale: string;
  messages: Record<string, Record<string, string>>;
}

export default function CVGenPageClient({ locale, messages }: CVGenPageClientProps) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const store = useCVStore();
  const hasFetched = useRef(false);
  const isMounted = useRef(true);

  // Use useSyncExternalStore for localStorage access (no useEffect for initial check)
  const userId = useSyncExternalStore(
    subscribeToStorage,
    () => getStorageSnapshot('userId'),
    getServerSnapshot
  );

  const welcomeSeen = useSyncExternalStore(
    subscribeToStorage,
    () => getStorageSnapshot('welcomeSeen'),
    getServerSnapshot
  );

  const transformData = useCallback((data: any) => {
    if (!data) return null;
    
    return {
      personalInfo: data.personalInfo || {},
      educations: data.education?.map((edu: any) => ({
        ...edu,
        degree: edu.degree || '',
        customDegree: edu.customDegree === undefined ? '' : edu.customDegree,
        fieldOfStudy: edu.fieldOfStudy || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        ongoing: edu.ongoing || false,
        achievements: edu.achievements || []
      })) || [],
      workExperience: {
        hasWorkExperience: data.workExperience?.length > 0,
        experiences: data.workExperience?.map((exp: any) => ({
          ...exp,
          responsibilities: exp.responsibilities || []
        })) || []
      },
      skills: data.skills?.map((skill: any) => ({
        ...skill,
        level: skill.level || 'beginner'
      })) || [],
      languages: data.languages?.map((lang: any) => ({
        ...lang,
        proficiency: lang.proficiency || '',
        testName: lang.testName || '',
        testScore: lang.testScore || ''
      })) || [],
      hobbies: data.hobbies || []
    };
  }, []);

  // Fetch CV data on mount - using startTransition pattern instead of useEffect
  const fetchCVData = useCallback(async () => {
    if (!userId || hasFetched.current) {
      setIsLoading(false);
      setShowWelcome(!welcomeSeen);
      return;
    }

    try {
      hasFetched.current = true;
      
      const response = await fetch(`/api/cvedit/fetchCV?userId=${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store'
      });

      // 404 = pas de CV existant, ce n'est pas une erreur
      if (response.status === 404) {
        if (isMounted.current) {
          setShowWelcome(!welcomeSeen);
        }
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const rawData = await response.json();
      const transformedData = transformData(rawData);
      
      if (transformedData && isMounted.current) {
        store.setFormData(transformedData);
        store.setIsEditing(true);
        store.setUserId(userId);
        setShowWelcome(false);
      }
    } catch (error) {
      // Erreur réseau ou autre erreur réelle
      console.error('Error fetching CV:', error);
      if (isMounted.current) {
        hasFetched.current = false;
        setShowWelcome(!welcomeSeen);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [userId, welcomeSeen, store, transformData]);

  // Initialize on client
  React.useEffect(() => {
    isMounted.current = true;
    
    if (typeof window !== 'undefined' && !hasFetched.current) {
      fetchCVData();
    }

    return () => { isMounted.current = false; };
  }, [fetchCVData]);

  const handleWelcomeClose = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('welcomeSeen', 'true');
    }
    setShowWelcome(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-white">
        <Loader2 className="w-10 h-10 animate-spin text-geds-blue" />
      </div>
    );
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)] w-full">
        <Suspense fallback={<div className="h-16" />}>
          <NavBar />
        </Suspense>

        <main className="flex-1 container mx-auto px-4 mt-24 mb-8">
          <div className={cn(
            "mx-auto bg-white rounded-3xl",
            "shadow-xl shadow-[hsl(var(--geds-blue)/0.05)]",
            "p-4 sm:p-6 md:p-8",
            "max-w-3xl"
          )}>
            <Suspense fallback={<LoadingSpinner className="h-[60vh]" />}>
              <AnimatePresence mode="wait">
                {showWelcome ? (
                  <motion.div
                    key="welcome"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <DynamicWelcomeDialog onClose={handleWelcomeClose} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <DynamicForm />
                  </motion.div>
                )}
              </AnimatePresence>
            </Suspense>
          </div>
        </main>

      </div>
    </NextIntlClientProvider>
  );
}

