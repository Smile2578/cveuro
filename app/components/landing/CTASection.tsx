'use client';

import { useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export default function CTASection() {
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
    <section className="py-20 relative overflow-hidden">
      {/* Background - GEDS blue gradient */}
      <div className="absolute inset-0 bg-gradient-geds-dark" />
      
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
          }} 
        />
      </div>

      <div className="w-full relative z-10 px-4 sm:px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-4 sm:mb-6"
          >
            {t('landing.cta.title')}
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-white/80 max-w-full sm:max-w-xl mx-auto mb-6 sm:mb-8 text-base sm:text-lg px-2"
          >
            {t('landing.cta.subtitle')}
          </motion.p>

          <motion.div variants={fadeInUp} className="w-full sm:w-auto">
            <Button
              size="lg"
              onClick={handleCreateCV}
              className={cn(
                "group px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold w-full sm:w-auto",
                "btn-geds-white"
              )}
            >
              {t('buttons.createCV')}
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          <motion.p 
            variants={fadeInUp}
            className="text-white/60 text-sm mt-4 sm:mt-6"
          >
            Gratuit • 5 minutes • Format Europass
          </motion.p>
        </motion.div>
      </div>

      {/* Language Choice Modal */}
      <LanguageChoiceModal 
        open={showLanguageModal} 
        onOpenChange={setShowLanguageModal} 
      />
    </section>
  );
}

