'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCVStore } from '@/app/store/cvStore';
import { cn } from '@/lib/utils';

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
  const router = useRouter();
  const t = useTranslations('common');
  const [isLoading, setIsLoading] = useState(false);
  const { resetForm } = useCVStore();

  const handleCreateCV = useCallback(() => {
    setIsLoading(true);
    resetForm();
    router.push('/cvgen');
  }, [resetForm, router]);

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

      <div className="container mx-auto relative z-10 px-4 text-center max-w-4xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-serif font-bold text-white mb-6"
          >
            {t('landing.cta.title')}
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-white/80 max-w-xl mx-auto mb-8 text-lg"
          >
            {t('landing.cta.subtitle')}
          </motion.p>

          <motion.div variants={fadeInUp}>
            <Button
              size="lg"
              onClick={handleCreateCV}
              disabled={isLoading}
              className={cn(
                "group px-8 py-6 text-lg font-semibold",
                "btn-geds-white"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {t('buttons.createCV')}
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </motion.div>

          <motion.p 
            variants={fadeInUp}
            className="text-white/60 text-sm mt-6"
          >
            Gratuit • 5 minutes • Format Europass
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

