'use client';

import { ReactNode, useEffect, useCallback, useRef } from 'react';
import FormNavigation from './FormNavigation';
import { cn } from '@/lib/utils';

interface FormNavigationWrapperProps {
  children: ReactNode;
  hideFormNavigation?: boolean;
  onValidate?: () => Promise<boolean>;
  onReset?: () => Promise<void>;
  showReset?: boolean;
  customNext?: () => Promise<void>;
  customPrevious?: () => Promise<void>;
  onSubmit?: () => Promise<void>;
}

export default function FormNavigationWrapper({ 
  children, 
  hideFormNavigation,
  onValidate,
  ...navigationProps 
}: FormNavigationWrapperProps) {
  const navigationRef = useRef<HTMLDivElement>(null);
  
  // Handle Enter key to go to next step
  const handleKeyDown = useCallback(async (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const target = e.target as HTMLElement;
      
      // Don't trigger on textareas or buttons
      if (target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON') {
        return;
      }
      
      // Don't trigger if focus is on a select (combobox)
      if (target.getAttribute('role') === 'combobox') {
        return;
      }
      
      e.preventDefault();
      
      // Find and click the next button
      if (navigationRef.current) {
        const nextButton = navigationRef.current.querySelector('[data-nav-next]') as HTMLButtonElement;
        if (nextButton && !nextButton.disabled) {
          nextButton.click();
        }
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (hideFormNavigation) {
    return <div className="w-full mt-2 sm:mt-6">{children}</div>;
  }

  return (
    <div className="w-full mt-2 sm:mt-6" ref={navigationRef}>
      {/* Content with padding for fixed mobile nav */}
      <div className="pb-24 sm:pb-0">
        {children}
      </div>
      
      {/* Fixed navigation bar for mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 sm:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <FormNavigation onValidate={onValidate} {...navigationProps} isMobile />
      </div>
      
      {/* Navigation on bottom for desktop */}
      <div className="hidden sm:block mt-4 sm:mt-6">
        <FormNavigation onValidate={onValidate} {...navigationProps} />
      </div>
    </div>
  );
}

