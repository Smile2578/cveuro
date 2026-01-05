'use client';

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}

export default function FormSection({ icon: Icon, title, description, children }: FormSectionProps) {
  return (
    <div className="w-full">
      <div className="space-y-2 sm:space-y-6">
        {/* Header - hidden on mobile (redundant with stepper label) */}
        <div className={cn(
          "hidden sm:flex items-center gap-3",
          "pb-4 border-b border-gray-100"
        )}>
          <Icon className="w-7 h-7 text-geds-blue flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-geds-blue leading-tight">
              {title}
            </h3>
            <p className="text-sm text-gray-500 leading-tight">
              {description}
            </p>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-3 sm:space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

