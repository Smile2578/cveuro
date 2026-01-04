'use client';

import { ReactNode } from 'react';
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
  ...navigationProps 
}: FormNavigationWrapperProps) {
  
  const navigationComponent = !hideFormNavigation && (
    <div className="w-full my-4 sm:my-6">
      <FormNavigation {...navigationProps} />
    </div>
  );

  return (
    <div className="w-full mt-2 sm:mt-6">
      {/* Navigation on top for mobile */}
      <div className="sm:hidden">
        {navigationComponent}
      </div>
      
      {children}
      
      {/* Navigation on bottom for desktop */}
      <div className="hidden sm:block">
        {navigationComponent}
      </div>
    </div>
  );
}

