// app/[locale]/cvgen/CVGenPageClient.tsx
'use client';

import React, { useState, useCallback, useRef, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NextIntlClientProvider } from 'next-intl';
import { useCVStore } from '../../store/cvStore';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '@/lib/utils';
import NavBar from '../../components/common/NavBar';
import Form from '../../components/cvgen/Form';
import WelcomeDialog from '../../components/cvgen/welcome/WelcomeDialog';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: "easeOut" } 
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    transition: { duration: 0.2 } 
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
  const [isReady, setIsReady] = useState(false);
  const store = useCVStore();
  const hasFetched = useRef(false);
  const isMounted = useRef(true);

  // Use the new auth hook - will auto-sign in anonymously if needed
  const { userId, isInitializing } = useAuth();

  // Use useSyncExternalStore for localStorage access (welcomeSeen flag only)
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

  // Fetch CV data on mount - only after auth is ready
  const fetchCVData = useCallback(async () => {
    // Wait for auth to be ready
    if (isInitializing || !userId || hasFetched.current) {
      if (!isInitializing && !userId) {
        setIsReady(true);
        setShowWelcome(!welcomeSeen);
      }
      return;
    }

    try {
      hasFetched.current = true;
      
      const response = await fetch(`/api/cvedit/fetchCV?userId=${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store'
      });

      // 404 = pas de CV existant, c'est normal pour un nouvel utilisateur
      if (response.status === 404) {
        if (isMounted.current) {
          setIsReady(true);
          setShowWelcome(!welcomeSeen);
        }
        return;
      }

      // 401 = pas encore authentifié, réessayer plus tard
      if (response.status === 401) {
        hasFetched.current = false;
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
        setIsReady(true);
      }
    } catch (error) {
      console.error('Error fetching CV:', error);
      if (isMounted.current) {
        hasFetched.current = false;
        setShowWelcome(!welcomeSeen);
        setIsReady(true);
      }
    }
  }, [userId, isInitializing, welcomeSeen, store, transformData]);

  // Initialize on client - trigger fetch when auth is ready
  React.useEffect(() => {
    isMounted.current = true;
    
    if (typeof window !== 'undefined' && !isInitializing) {
      fetchCVData();
    }

    return () => { isMounted.current = false; };
  }, [fetchCVData, isInitializing]);

  const handleWelcomeClose = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('welcomeSeen', 'true');
    }
    setShowWelcome(false);
  }, []);

  // Single loading state - let loading.tsx handle initial display
  // Only show minimal transition when ready
  if (!isReady || isInitializing) {
    return null; // loading.tsx handles this
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)] w-full">
        <NavBar />

        <main className="flex-1 container mx-auto px-4 mt-24 mb-8">
          <div className={cn(
            "mx-auto bg-white rounded-3xl",
            "shadow-xl shadow-[hsl(var(--geds-blue)/0.05)]",
            "p-4 sm:p-6 md:p-8",
            "max-w-3xl"
          )}>
            <AnimatePresence mode="wait">
              {showWelcome ? (
                <motion.div
                  key="welcome"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <WelcomeDialog onClose={handleWelcomeClose} />
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Form />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </NextIntlClientProvider>
  );
}
