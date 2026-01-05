'use client';

import { useTranslations } from 'next-intl';
import { useFormProgress } from '@/app/hooks/useFormProgress';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { User, GraduationCap, Briefcase, FileCheck, Check, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

// Step icons for visual reference
const STEP_ICONS = [User, GraduationCap, Briefcase, FileCheck];
const STEP_KEYS = ['personalInfo', 'education', 'experience', 'review'];

export default function ProgressBar() {
  const t = useTranslations('common');
  const { 
    currentStep,
    progress,
    goToStep
  } = useFormProgress();

  // Handle step click - only allow going back to completed steps
  const handleStepClick = (stepIndex: number) => {
    // Only allow navigation to completed steps (not current or future)
    if (stepIndex < currentStep) {
      goToStep(stepIndex);
    }
  };

  // Check if step is clickable (only completed steps)
  const isStepClickable = (stepIndex: number) => stepIndex < currentStep;

  return (
    <div className={cn(
      "w-full bg-white/95 backdrop-blur-sm py-2 px-3 sm:py-3 sm:px-4 z-10",
      "border-b border-gray-100"
    )}>
      {/* Mobile: Compact but clickable for completed steps */}
      <div className="sm:hidden">
        <div className="flex items-center gap-2">
          {/* Step indicators on mobile */}
          <div className="flex items-center gap-1">
            {STEP_ICONS.map((Icon, index) => {
              const clickable = isStepClickable(index);
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              const isFuture = index > currentStep;
              
              return (
                <motion.button
                  key={index}
                  onClick={() => handleStepClick(index)}
                  whileHover={clickable ? { scale: 1.1 } : {}}
                  whileTap={clickable ? { scale: 0.95 } : {}}
                  disabled={!clickable}
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center transition-all",
                    "focus:outline-none",
                    isCompleted && "bg-geds-green text-white cursor-pointer hover:bg-geds-green/80 focus:ring-2 focus:ring-geds-green/50",
                    isCurrent && "bg-geds-blue text-white ring-2 ring-geds-blue/30 cursor-default",
                    isFuture && "bg-gray-100 text-gray-300 cursor-not-allowed"
                  )}
                  title={isCompleted 
                    ? `${t(`progress.steps.${STEP_KEYS[index]}`)} - ${t('progress.clickToEdit')}` 
                    : t(`progress.steps.${STEP_KEYS[index]}`)}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3" />
                  ) : isFuture ? (
                    <Lock className="w-2.5 h-2.5" />
                  ) : (
                    <Icon className="w-3 h-3" />
                  )}
                </motion.button>
              );
            })}
          </div>
          <Progress value={progress} className="h-1.5 bg-gray-100 flex-1" />
          <span className="text-xs font-semibold text-geds-blue">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Desktop: Full step indicators with click for completed steps */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between gap-2 mb-2">
          {STEP_ICONS.map((Icon, index) => {
            const clickable = isStepClickable(index);
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isFuture = index > currentStep;
            
            return (
              <div 
                key={index}
                className={cn(
                  "flex items-center gap-2 flex-1",
                  index < STEP_ICONS.length - 1 && "after:content-[''] after:flex-1 after:h-0.5 after:mx-2 after:transition-colors",
                  isCompleted ? "after:bg-geds-green" : "after:bg-gray-200"
                )}
              >
                <motion.button
                  onClick={() => handleStepClick(index)}
                  whileHover={clickable ? { scale: 1.1 } : {}}
                  whileTap={clickable ? { scale: 0.95 } : {}}
                  disabled={!clickable}
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0",
                    "focus:outline-none",
                    isCompleted && "bg-geds-green text-white cursor-pointer hover:bg-geds-green/80 hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-geds-green/50",
                    isCurrent && "bg-geds-blue text-white ring-2 ring-geds-blue/30 cursor-default",
                    isFuture && "bg-gray-100 text-gray-300 cursor-not-allowed"
                  )}
                  title={isCompleted 
                    ? `${t(`progress.steps.${STEP_KEYS[index]}`)} - ${t('progress.clickToEdit')}` 
                    : t(`progress.steps.${STEP_KEYS[index]}`)}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : isFuture ? (
                    <Lock className="w-3.5 h-3.5" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </motion.button>
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={!clickable}
                  className={cn(
                    "text-xs font-medium transition-colors",
                    isCompleted && "text-geds-green cursor-pointer hover:text-geds-green/80 hover:underline",
                    isCurrent && "text-geds-blue cursor-default",
                    isFuture && "text-gray-400 cursor-not-allowed"
                  )}
                >
                  {t(`progress.steps.${STEP_KEYS[index]}`)}
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          <Progress value={progress} className="h-2 bg-gray-100 flex-1" />
          <span className="text-sm font-medium text-geds-blue">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}

