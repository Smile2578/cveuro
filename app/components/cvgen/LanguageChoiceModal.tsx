'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { AlertTriangle, Globe, CheckCircle2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCVStore } from '@/app/store/cvStore';

interface LanguageChoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type LanguageCode = 'en' | 'fr' | 'it';

const languages = [
  { code: 'fr' as LanguageCode, label: 'Français', flag: '/flags/france.png' },
  { code: 'en' as LanguageCode, label: 'English', flag: '/flags/uk.png' },
  { code: 'it' as LanguageCode, label: 'Italiano', flag: '/flags/italy.webp' },
];

export default function LanguageChoiceModal({ open, onOpenChange }: LanguageChoiceModalProps) {
  const router = useRouter();
  const t = useTranslations('common');
  const { resetForm } = useCVStore();
  const [selectedNonEnglish, setSelectedNonEnglish] = useState<LanguageCode | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleEnglishChoice = useCallback(() => {
    setIsNavigating(true);
    resetForm();
    router.push('/en/cvgen');
  }, [resetForm, router]);

  const handleOtherLanguageClick = useCallback((code: LanguageCode) => {
    setSelectedNonEnglish(code);
  }, []);

  const handleOtherLanguageConfirm = useCallback(() => {
    if (!selectedNonEnglish) return;
    setIsNavigating(true);
    resetForm();
    router.push(`/${selectedNonEnglish}/cvgen`);
  }, [selectedNonEnglish, resetForm, router]);

  const handleSwitchToEnglish = useCallback(() => {
    setSelectedNonEnglish(null);
    handleEnglishChoice();
  }, [handleEnglishChoice]);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (!newOpen) {
      setSelectedNonEnglish(null);
    }
    onOpenChange(newOpen);
  }, [onOpenChange]);

  const selectedLangLabel = selectedNonEnglish 
    ? languages.find(l => l.code === selectedNonEnglish)?.label ?? ''
    : '';

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className={cn(
          "sm:max-w-[480px] p-0 gap-0 overflow-hidden",
          "border-0 shadow-2xl"
        )}
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-geds-blue to-geds-cyan p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-3">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-serif font-semibold text-white">
              {t('languageModal.title')}
            </DialogTitle>
            <DialogDescription className="text-white/90 text-sm">
              {t('languageModal.description')}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6">
          {!selectedNonEnglish ? (
            <>
              {/* Language choice - English in center, others on sides */}
              <div className="flex items-end justify-center gap-3 mb-6">
                {/* French - Left, smaller */}
                <button
                  onClick={() => handleOtherLanguageClick('fr')}
                  disabled={isNavigating}
                  className={cn(
                    "group flex flex-col items-center gap-2 p-3 rounded-xl",
                    "bg-gray-50 border-2 border-gray-200",
                    "hover:bg-gray-100 hover:border-gray-300",
                    "transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2",
                    isNavigating && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden shadow border border-gray-200">
                    <Image
                      src="/flags/france.png"
                      alt="Français"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Français</span>
                </button>

                {/* English - Center, larger, recommended */}
                <button
                  onClick={handleEnglishChoice}
                  disabled={isNavigating}
                  className={cn(
                    "group relative flex flex-col items-center gap-3 p-5 rounded-xl",
                    "bg-geds-blue/5 border-2 border-geds-blue",
                    "hover:bg-geds-blue/10 hover:shadow-lg",
                    "transition-all duration-200 transform hover:-translate-y-1",
                    "focus:outline-none focus:ring-2 focus:ring-geds-blue focus:ring-offset-2",
                    isNavigating && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {/* Recommended badge */}
                  <span className={cn(
                    "absolute -top-2.5 left-1/2 -translate-x-1/2",
                    "flex items-center gap-1 px-2 py-0.5",
                    "bg-geds-green text-white text-[10px] font-semibold",
                    "rounded-full shadow-sm whitespace-nowrap"
                  )}>
                    <CheckCircle2 className="w-3 h-3" />
                    {t('languageModal.recommended')}
                  </span>
                  
                  <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md border-2 border-geds-blue/30">
                    <Image
                      src="/flags/uk.png"
                      alt="English"
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-bold text-geds-blue text-lg">English</span>
                </button>

                {/* Italian - Right, smaller */}
                <button
                  onClick={() => handleOtherLanguageClick('it')}
                  disabled={isNavigating}
                  className={cn(
                    "group flex flex-col items-center gap-2 p-3 rounded-xl",
                    "bg-gray-50 border-2 border-gray-200",
                    "hover:bg-gray-100 hover:border-gray-300",
                    "transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2",
                    isNavigating && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden shadow border border-gray-200">
                    <Image
                      src="/flags/italy.webp"
                      alt="Italiano"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Italiano</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Warning for non-English selection */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 border border-orange-200 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-sm text-orange-800 leading-relaxed pt-1.5">
                  {t('languageModal.otherLanguageWarning', { language: selectedLangLabel })}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleSwitchToEnglish}
                  disabled={isNavigating}
                  size="lg"
                  className="btn-geds-primary w-full"
                >
                  {t('languageModal.switchToEnglish')}
                </Button>
                <Button
                  onClick={handleOtherLanguageConfirm}
                  disabled={isNavigating}
                  variant="outline"
                  size="lg"
                  className="w-full text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  {t('languageModal.continueInOther', { language: selectedLangLabel })}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
