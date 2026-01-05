'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save, 
  Edit3, 
  FileText, 
  Sparkles, 
  Shield,
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AccountBenefitsBannerProps {
  variant?: 'inline' | 'modal' | 'floating';
  onDismiss?: () => void;
  showAfterDelay?: number;
}

// Fallback translations (used if next-intl fails to load)
const translations = {
  fr: {
    title: "Créez un compte gratuit",
    subtitle: "Débloquez toutes les fonctionnalités",
    modalTitle: "Votre CV est prêt ! 🎉",
    modalSubtitle: "Créez un compte gratuit pour le sauvegarder",
    inlineTitle: "Sauvegardez votre CV",
    inlineDesc: "Créez un compte gratuit pour ne jamais perdre votre travail",
    saveTitle: "Sauvegarde automatique",
    saveDesc: "Votre CV est sauvegardé automatiquement dans le cloud",
    saveShort: "Sauvegarde cloud",
    editTitle: "Modifications illimitées",
    editDesc: "Revenez modifier votre CV quand vous voulez",
    editShort: "Modif. illimitées",
    coverLetterTitle: "Lettre de motivation IA",
    coverLetterDesc: "Générez des lettres personnalisées avec l'IA",
    coverLetterShort: "Lettre IA",
    aiTitle: "Améliorations IA",
    aiDesc: "Obtenez des suggestions pour améliorer votre CV",
    aiShort: "Suggestions IA",
    secureTitle: "Données sécurisées",
    secureDesc: "Vos données sont chiffrées et protégées",
    secureShort: "Sécurisé",
    createAccount: "Créer un compte",
    createAccountFree: "Créer un compte gratuit",
    later: "Plus tard",
    continueAsGuest: "Continuer sans compte"
  },
  en: {
    title: "Create a free account",
    subtitle: "Unlock all features",
    modalTitle: "Your CV is ready! 🎉",
    modalSubtitle: "Create a free account to save it",
    inlineTitle: "Save your CV",
    inlineDesc: "Create a free account to never lose your work",
    saveTitle: "Auto-save",
    saveDesc: "Your CV is automatically saved in the cloud",
    saveShort: "Cloud save",
    editTitle: "Unlimited edits",
    editDesc: "Come back and edit your CV anytime",
    editShort: "Unlimited edits",
    coverLetterTitle: "AI Cover Letter",
    coverLetterDesc: "Generate personalized cover letters with AI",
    coverLetterShort: "AI Letter",
    aiTitle: "AI Improvements",
    aiDesc: "Get suggestions to improve your CV",
    aiShort: "AI tips",
    secureTitle: "Secure data",
    secureDesc: "Your data is encrypted and protected",
    secureShort: "Secure",
    createAccount: "Create account",
    createAccountFree: "Create free account",
    later: "Later",
    continueAsGuest: "Continue without account"
  }
};

const benefits = [
  { icon: Save, key: 'save' as const },
  { icon: Edit3, key: 'edit' as const },
  { icon: FileText, key: 'coverLetter' as const },
  { icon: Sparkles, key: 'ai' as const },
  { icon: Shield, key: 'secure' as const },
];

export default function AccountBenefitsBanner({ 
  variant = 'inline',
  onDismiss,
  showAfterDelay = 0
}: AccountBenefitsBannerProps) {
  const locale = useLocale() as 'fr' | 'en';
  const t = translations[locale] || translations.en;
  const [isVisible, setIsVisible] = useState(showAfterDelay === 0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (showAfterDelay > 0) {
      const timer = setTimeout(() => setIsVisible(true), showAfterDelay);
      return () => clearTimeout(timer);
    }
  }, [showAfterDelay]);

  useEffect(() => {
    // Don't check localStorage dismissal for modal variant (it's an explicit event)
    if (variant !== 'modal') {
      const dismissed = localStorage.getItem('account-banner-dismissed');
      if (dismissed) {
        setIsDismissed(true);
      }
    }
  }, [variant]);

  const handleDismiss = () => {
    setIsDismissed(true);
    // Only save dismissal for non-modal variants
    if (variant !== 'modal') {
      localStorage.setItem('account-banner-dismissed', 'true');
    }
    onDismiss?.();
  };

  // For modal variant, only check isVisible (not isDismissed from localStorage)
  if (variant === 'modal') {
    if (!isVisible) return null;
  } else {
    if (isDismissed || !isVisible) return null;
  }

  // Floating variant
  if (variant === 'floating') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-geds-blue to-geds-cyan p-4 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-semibold">{t.title}</h3>
                </div>
                <button 
                  onClick={handleDismiss}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-white/90 text-sm mt-1">{t.subtitle}</p>
            </div>
            
            <div className="p-4 space-y-3">
              {benefits.slice(0, 3).map(({ icon: Icon, key }) => (
                <div key={key} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-geds-blue/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-geds-blue" />
                  </div>
                  <span className="text-gray-700">{t[`${key}Short` as keyof typeof t]}</span>
                </div>
              ))}
            </div>
            
            <div className="p-4 pt-0 flex gap-2">
              <Link href={`/${locale}/register`} className="flex-1">
                <Button className="w-full bg-geds-blue hover:bg-geds-blue/90">
                  {t.createAccount}
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                onClick={handleDismiss}
                className="text-gray-500"
              >
                {t.later}
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Modal variant
  if (variant === 'modal') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-geds-blue via-geds-cyan to-geds-blue p-6 text-white">
              <button 
                onClick={handleDismiss}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{t.modalTitle}</h2>
                  <p className="text-white/80 text-sm">{t.modalSubtitle}</p>
                </div>
              </div>
            </div>
            
            {/* Benefits */}
            <div className="p-6 space-y-4">
              {benefits.map(({ icon: Icon, key }) => (
                <div key={key} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-geds-blue/10 to-geds-cyan/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-geds-blue" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{t[`${key}Title` as keyof typeof t]}</h4>
                    <p className="text-sm text-gray-500">{t[`${key}Desc` as keyof typeof t]}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Actions */}
            <div className="p-6 pt-0 space-y-3">
              <Link href={`/${locale}/register`} className="block">
                <Button className="w-full h-12 bg-gradient-to-r from-geds-blue to-geds-cyan hover:shadow-lg transition-shadow">
                  {t.createAccountFree}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                onClick={handleDismiss}
                className="w-full text-gray-500 hover:text-gray-700"
              >
                {t.continueAsGuest}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Inline variant
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-gradient-to-r from-geds-blue/5 via-geds-cyan/5 to-geds-blue/5",
        "border border-geds-blue/20 rounded-xl p-4 sm:p-5"
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-geds-blue" />
            <h3 className="font-semibold text-gray-900">{t.inlineTitle}</h3>
          </div>
          <p className="text-sm text-gray-600">{t.inlineDesc}</p>
          
          <div className="flex flex-wrap gap-3 mt-3">
            {benefits.slice(0, 4).map(({ icon: Icon, key }) => (
              <div key={key} className="flex items-center gap-1.5 text-xs text-gray-600">
                <Icon className="w-3.5 h-3.5 text-geds-blue" />
                <span>{t[`${key}Short` as keyof typeof t]}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2 sm:flex-col">
          <Link href={`/${locale}/register`}>
            <Button size="sm" className="bg-geds-blue hover:bg-geds-blue/90">
              {t.createAccount}
            </Button>
          </Link>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleDismiss}
            className="text-gray-500"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
