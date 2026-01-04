'use client';

import { useTranslations } from 'next-intl';
import { useFormProgress } from '@/app/hooks/useFormProgress';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export default function ProgressBar() {
  const t = useTranslations('common');
  const { 
    currentStep,
    currentSubStep,
    totalSteps,
    totalSubSteps,
    hasSubSteps,
    progress
  } = useFormProgress();

  const getQualityMessage = (progress: number) => {
    if (progress === 0) return t('progress.quality.0');
    if (progress <= 25) return t('progress.quality.25');
    if (progress <= 50) return t('progress.quality.50');
    if (progress <= 75) return t('progress.quality.75');
    return t('progress.quality.100');
  };

  const subStepProgress = hasSubSteps ? ((currentSubStep + 1) / totalSubSteps) * 100 : 0;

  return (
    <div className={cn(
      "w-full mb-1 sticky top-0 bg-white p-4 z-10",
      "border-b border-gray-100"
    )}>
      {/* Main progress */}
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-600">
          {t('progress.step', { current: currentStep + 1, total: totalSteps })}
        </span>
        <span className="text-sm text-gray-600">
          {t('progress.completion', { percentage: Math.round(progress) })}
        </span>
      </div>

      <Progress 
        value={progress} 
        className="h-2 bg-gray-100"
      />

      {/* Sub-step progress */}
      {hasSubSteps && (
        <div className="mt-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">
              {t('progress.subStep', { current: currentSubStep + 1, total: totalSubSteps })}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(subStepProgress)}%
            </span>
          </div>

          <Progress 
            value={subStepProgress} 
            className="h-1.5 bg-gray-50"
          />
        </div>
      )}

      {/* Quality message */}
      <p className="text-sm text-geds-blue text-center mt-3 font-medium">
        {getQualityMessage(progress)}
      </p>
    </div>
  );
}

