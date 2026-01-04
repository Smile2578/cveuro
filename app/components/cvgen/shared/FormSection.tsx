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
      <div className="space-y-6">
        {/* Header */}
        <div className={cn(
          "flex items-center flex-col sm:flex-row gap-3",
          "pb-4 border-b border-gray-100",
          "text-center sm:text-left"
        )}>
          <Icon className="w-8 h-8 text-geds-blue" />
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-geds-blue">
              {title}
            </h3>
            <p className="text-sm text-gray-600">
              {description}
            </p>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

