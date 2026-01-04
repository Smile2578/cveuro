'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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

export default function HeroSection() {
  const router = useRouter();
  const t = useTranslations('common');
  const [isLoading, setIsLoading] = useState(false);
  const { resetForm } = useCVStore();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleCreateCV = useCallback(() => {
    if (!termsAccepted) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    setIsLoading(true);
    resetForm();
    router.push('/cvgen');
  }, [resetForm, router, termsAccepted]);

  const handleTermsClick = useCallback(() => {
    setTermsAccepted(prev => !prev);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)]">
      {/* Subtle decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-geds-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-geds-green/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10 px-4 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center lg:text-left"
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
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6"
            >
              <span className="text-gray-900">{t('landing.title').split(' ').slice(0, 2).join(' ')} </span>
              <span className="text-gradient">
                {t('landing.title').split(' ').slice(2, 4).join(' ')}
              </span>
              <span className="text-gray-900"> {t('landing.title').split(' ').slice(4).join(' ')}</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              {t('landing.subtitle')}
            </motion.p>

            {/* Terms checkbox - Clickable entire row */}
            <motion.div variants={fadeInUp} className="mb-6">
              <div 
                onClick={handleTermsClick}
                className="flex items-start gap-3 justify-center lg:justify-start cursor-pointer group"
              >
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  className="mt-1 border-geds-blue data-[state=checked]:bg-geds-blue data-[state=checked]:border-geds-blue pointer-events-none"
                />
                <label className="text-sm text-gray-600 leading-relaxed cursor-pointer group-hover:text-gray-900 transition-colors">
                  {t('terms.accept')}{' '}
                  <Link 
                    href="/terms" 
                    onClick={(e) => e.stopPropagation()}
                    className="text-geds-blue hover:text-geds-cyan underline underline-offset-2"
                  >
                    {t('terms.terms')}
                  </Link>
                  {' '}{t('terms.and')}{' '}
                  <Link 
                    href="/privacy" 
                    onClick={(e) => e.stopPropagation()}
                    className="text-geds-blue hover:text-geds-cyan underline underline-offset-2"
                  >
                    {t('terms.privacy')}
                  </Link>
                </label>
              </div>
              
              <p className="text-xs text-geds-green mt-2 font-medium text-center lg:text-left">
                {t('terms.english')}
              </p>

              {showError && (
                <Alert variant="destructive" className="mt-4 max-w-md mx-auto lg:mx-0">
                  <AlertDescription>{t('terms.error')}</AlertDescription>
                </Alert>
              )}
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={fadeInUp}>
              <Button
                size="lg"
                onClick={handleCreateCV}
                disabled={isLoading}
                className={cn(
                  "group relative overflow-hidden px-8 py-6 text-lg font-semibold",
                  "btn-geds-primary"
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
          </motion.div>

          {/* Right content - CV Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
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
    </section>
  );
}

