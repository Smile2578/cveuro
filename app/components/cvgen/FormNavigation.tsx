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
}

export default function FormNavigation({
  onValidate,
  onReset,
  showReset = true,
  customNext,
  customPrevious,
  onSubmit
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
    <div className="flex flex-col items-center gap-4 w-full pt-4 border-t border-gray-100 relative">
      {/* Navigation buttons */}
      <div className="flex justify-between items-center gap-2 w-full">
        {/* Previous button */}
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={!canGoPrevious || isLoading}
          className={cn(
            "min-w-[48px] sm:min-w-[120px] rounded-full",
            "border-gray-200 hover:bg-gray-50"
          )}
        >
          {isLoading && !canGoNext ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">{t('buttons.previous')}</span>
            </>
          )}
        </Button>

        {/* Next/Submit button */}
        <Button
          type="button"
          onClick={handleNext}
          disabled={(isFinalStep ? false : !canGoNext) || isLoading}
          className={cn(
            "min-w-[48px] sm:min-w-[120px] rounded-full",
            isFinalStep 
              ? "bg-geds-green hover:bg-geds-green/90 text-white shadow-lg shadow-[hsl(var(--geds-green)/0.25)]"
              : "btn-geds-primary"
          )}
        >
          {isLoading && (isFinalStep || canGoNext) ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span className="hidden sm:inline mr-1">
                {isFinalStep ? t('buttons.save') : t('buttons.next')}
              </span>
              <span className="sm:hidden">
                {isFinalStep ? t('buttons.save') : ''}
              </span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      {/* Reset button */}
      {showReset && (
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

