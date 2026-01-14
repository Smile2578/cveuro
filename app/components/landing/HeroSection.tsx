'use client';

import { useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCVStore } from '@/app/store/cvStore';
import LanguageChoiceModal from '@/app/components/cvgen/LanguageChoiceModal';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function HeroSection() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const { resetForm } = useCVStore();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const handleCreateCV = useCallback(() => {
    // Si déjà en anglais, naviguer directement sans modal
    if (locale === 'en') {
      resetForm();
      router.push('/en/cvgen');
      return;
    }
    // Sinon, afficher la modal de choix de langue
    setShowLanguageModal(true);
  }, [locale, resetForm, router]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-x-hidden bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)]">
      {/* Subtle decorative elements - hidden on mobile to prevent overflow */}
      <div className="hidden sm:block absolute top-20 left-10 w-72 h-72 bg-geds-blue/5 rounded-full blur-3xl" />
      <div className="hidden sm:block absolute bottom-20 right-10 w-96 h-96 bg-geds-green/5 rounded-full blur-3xl" />
      
      <div className="w-full relative z-10 px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-8 sm:py-20 md:py-32 max-w-7xl mx-auto overflow-hidden">
        <div className="grid xl:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center lg:text-left w-full"
          >
            <motion.div variants={fadeInUp}>
              <Badge 
                variant="outline" 
                className="mb-6 px-4 py-2 text-sm font-medium border-geds-cyan/30 text-geds-cyan bg-geds-cyan/5"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {t('landing.tag')}
              </Badge>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-4 sm:mb-6"
            >
              <span className="text-gray-900">{t('landing.title').split(' ').slice(0, 2).join(' ')} </span>
              <span className="text-gradient">
                {t('landing.title').split(' ').slice(2, 4).join(' ')}
              </span>
              <span className="text-gray-900"> {t('landing.title').split(' ').slice(4).join(' ')}</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-sm sm:text-lg text-gray-600 max-w-full sm:max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed"
            >
              {t('landing.subtitle')}
            </motion.p>

            {/* CTA Button */}
            <motion.div variants={fadeInUp} className="w-full sm:w-auto">
              <Button
                size="lg"
                onClick={handleCreateCV}
                className={cn(
                  "group relative overflow-hidden px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold w-full sm:w-auto",
                  "btn-geds-primary"
                )}
              >
                {t('buttons.createCV')}
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Right content - CV Preview - Only visible on xl (1280px+) */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden xl:block"
          >
            <div 
              className={cn(
                "relative rounded-2xl p-2 bg-white",
                "shadow-2xl border border-gray-100",
                "transform hover:-translate-y-2",
                "transition-all duration-500"
              )}
              style={{ 
                transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
                boxShadow: '0 25px 50px -12px hsl(var(--geds-blue) / 0.1)'
              }}
            >
              <div className="rounded-xl overflow-hidden">
                <Image 
                  src="/template/cv-preview.webp" 
                  alt="CV preview" 
                  width={600} 
                  height={800}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
              
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 animate-bounce">
                <Badge className="bg-geds-green text-white shadow-lg px-4 py-2">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Europass
                </Badge>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Language Choice Modal */}
      <LanguageChoiceModal 
        open={showLanguageModal} 
        onOpenChange={setShowLanguageModal} 
      />
    </section>
  );
}

