'use client';

import { useTranslations } from 'next-intl';
import { useFormProgress } from '@/app/hooks/useFormProgress';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { User, GraduationCap, Briefcase, FileCheck } from 'lucide-react';

// Step icons for visual reference
const STEP_ICONS = [User, GraduationCap, Briefcase, FileCheck];
const STEP_KEYS = ['personalInfo', 'education', 'experience', 'review'];

export default function ProgressBar() {
  const t = useTranslations('common');
  const { 
    currentStep,
    totalSteps,
    progress
  } = useFormProgress();

  const CurrentIcon = STEP_ICONS[currentStep];

  return (
    <div className={cn(
      "w-full bg-white/95 backdrop-blur-sm py-2 px-3 sm:py-3 sm:px-4 z-10",
      "border-b border-gray-100"
    )}>
      {/* Mobile: Ultra compact single line */}
      <div className="sm:hidden">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-6 h-6 rounded-full bg-geds-blue text-white flex items-center justify-center">
              <CurrentIcon className="w-3 h-3" />
            </div>
            <span className="text-xs font-medium text-gray-700">
              {currentStep + 1}/{totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-1.5 bg-gray-100 flex-1" />
          <span className="text-xs font-semibold text-geds-blue">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Desktop: Full step indicators */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between gap-2 mb-2">
          {STEP_ICONS.map((Icon, index) => (
            <div 
              key={index}
              className={cn(
                "flex items-center gap-2 flex-1",
                index < STEP_ICONS.length - 1 && "after:content-[''] after:flex-1 after:h-0.5 after:mx-2",
                index < currentStep ? "after:bg-geds-green" : "after:bg-gray-200"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0",
                index < currentStep 
                  ? "bg-geds-green text-white" 
                  : index === currentStep 
                    ? "bg-geds-blue text-white ring-2 ring-geds-blue/30" 
                    : "bg-gray-100 text-gray-400"
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={cn(
                "text-xs font-medium",
                index === currentStep ? "text-geds-blue" : "text-gray-500"
              )}>
                {t(`progress.steps.${STEP_KEYS[index]}`)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Progress value={progress} className="h-2 bg-gray-100 flex-1" />
          <span className="text-sm font-medium text-geds-blue">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}

