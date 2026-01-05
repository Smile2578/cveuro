'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';
import { ChevronLeft, ChevronRight, RotateCcw, Loader2 } from 'lucide-react';
import { useFormProgress } from '@/app/hooks/useFormProgress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FormNavigationProps {
  onValidate?: () => Promise<boolean>;
  onReset?: () => Promise<void>;
  showReset?: boolean;
  customNext?: () => Promise<void>;
  customPrevious?: () => Promise<void>;
  onSubmit?: () => Promise<void>;
  isMobile?: boolean;
}

export default function FormNavigation({
  onValidate,
  onReset,
  showReset = true,
  customNext,
  customPrevious,
  onSubmit,
  isMobile = false
}: FormNavigationProps) {
  const t = useTranslations('common');
  const { formState: { errors } } = useFormContext();
  const {
    isLastStep,
    isSubmitting,
    canGoNext,
    canGoPrevious,
    goNext,
    goPrevious,
    isLastSubStep
  } = useFormProgress();

  const [isValidating, setIsValidating] = useState(false);
  const isFinalStep = isLastStep && isLastSubStep;
  const isLoading = isSubmitting || isValidating;

  const handleNext = async () => {
    setIsValidating(true);
    try {
      if (customNext) {
        await customNext();
        return;
      }

      if (onValidate) {
        const isValid = await onValidate();
        if (!isValid) return;
      }

      if (isFinalStep && onSubmit) {
        await onSubmit();
        return;
      }

      if (!isFinalStep) {
        goNext();
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handlePrevious = async () => {
    if (customPrevious) {
      await customPrevious();
      return;
    }
    goPrevious();
  };

  const handleReset = async () => {
    if (onReset) {
      await onReset();
    }
  };

  return (
    <div className={cn(
      "flex items-center w-full relative",
      isMobile 
        ? "justify-between gap-2" 
        : "flex-col gap-4 pt-4 border-t border-gray-100"
    )}>
      {/* Navigation buttons */}
      <div className={cn(
        "flex items-center gap-2",
        isMobile ? "flex-1 justify-between" : "justify-between w-full"
      )}>
        {/* Previous button */}
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={!canGoPrevious || isLoading}
          data-nav-prev
          className={cn(
            "rounded-full border-gray-200 hover:bg-gray-50",
            isMobile ? "h-12 w-12 p-0" : "min-w-[48px] sm:min-w-[120px]"
          )}
        >
          {isLoading && !canGoNext ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              {!isMobile && <span className="hidden sm:inline ml-1">{t('buttons.previous')}</span>}
            </>
          )}
        </Button>

        {/* Reset button - inline for mobile */}
        {isMobile && showReset && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            disabled={isLoading}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full h-10 w-10 p-0"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}

        {/* Next/Submit button */}
        <Button
          type="button"
          onClick={handleNext}
          disabled={(isFinalStep ? false : !canGoNext) || isLoading}
          data-nav-next
          className={cn(
            "rounded-full",
            isMobile ? "h-12 px-6" : "min-w-[48px] sm:min-w-[120px]",
            isFinalStep 
              ? "bg-geds-green hover:bg-geds-green/90 text-white shadow-lg shadow-[hsl(var(--geds-green)/0.25)]"
              : "btn-geds-primary"
          )}
        >
          {isLoading && (isFinalStep || canGoNext) ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span className={cn(isMobile ? "mr-1" : "hidden sm:inline mr-1")}>
                {isFinalStep ? t('buttons.save') : t('buttons.next')}
              </span>
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </div>

      {/* Reset button - below for desktop */}
      {!isMobile && showReset && (
        <Button
          type="button"
          variant="ghost"
          onClick={handleReset}
          disabled={isLoading}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
        >
          {isLoading && !canGoNext && !canGoPrevious ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">{t('buttons.reset')}</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
}

