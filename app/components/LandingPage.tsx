'use client';

import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import NavBar from './common/NavBar';
import Footer from './common/Footer';

// Lazy load sections for better performance
const HeroSection = lazy(() => import('./landing/HeroSection'));
const StatsSection = lazy(() => import('./landing/StatsSection'));
const FeaturesSection = lazy(() => import('./landing/FeaturesSection'));
const CTASection = lazy(() => import('./landing/CTASection'));

// Loading fallback component
function SectionLoader() {
  return (
    <div className="flex justify-center items-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-geds-blue" />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      <Suspense fallback={<SectionLoader />}>
        <HeroSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <StatsSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <FeaturesSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <CTASection />
      </Suspense>

      <Footer />
    </div>
  );
}
