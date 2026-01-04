'use client';

import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { User, GraduationCap, Briefcase, Brain, Languages, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Section {
  key: string;
  icon: React.ReactNode;
  items?: string[];
  subsections?: {
    key: string;
    icon: React.ReactNode;
    items: string[];
  }[];
}

const sections: Section[] = [
  {
    key: 'personal',
    icon: <User className="w-6 h-6 sm:w-8 sm:h-8" />,
    items: ['identity', 'contact', 'address', 'social']
  },
  {
    key: 'education',
    icon: <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />,
    items: []
  },
  {
    key: 'experience',
    icon: <Briefcase className="w-6 h-6 sm:w-8 sm:h-8" />,
    items: []
  },
  {
    key: 'talents',
    icon: <Brain className="w-6 h-6 sm:w-8 sm:h-8" />,
    subsections: [
      {
        key: 'skills',
        icon: <Brain className="w-5 h-5" />,
        items: ['technical', 'soft', 'other']
      },
      {
        key: 'languages',
        icon: <Languages className="w-5 h-5" />,
        items: ['native', 'foreign', 'certifications']
      },
      {
        key: 'hobbies',
        icon: <Gamepad2 className="w-5 h-5" />,
        items: ['interests', 'activities', 'achievements']
      }
    ]
  }
];

interface WelcomeTitleProps {
  title: string;
}

const WelcomeTitle = memo(function WelcomeTitle({ title }: WelcomeTitleProps) {
  return (
    <h1 
      id="welcome-title"
      className={cn(
        "text-2xl sm:text-3xl font-serif font-semibold",
        "text-center mb-4 sm:mb-8",
        "min-h-[2.5rem] sm:min-h-[3rem]",
        "flex items-center justify-center",
        "leading-tight tracking-tight"
      )}
    >
      {title}
    </h1>
  );
});

interface SectionItemProps {
  section: Section;
  t: (key: string) => string;
}

const SectionItem = memo(function SectionItem({ section, t }: SectionItemProps) {
  return (
    <Card className="bg-white border-gray-100">
      <CardContent className="p-3 sm:p-4">
        <div className="flex gap-3 items-start">
          {/* Icon */}
          <div className={cn(
            "flex items-center justify-center",
            "w-8 h-8 sm:w-10 sm:h-10",
            "text-geds-blue"
          )}>
            {section.icon}
          </div>
          
          {/* Content */}
          <div className="flex-1 space-y-1">
            <h2 className="text-base sm:text-lg font-semibold leading-tight">
              {t(`steps.${section.key}.title`)}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {t(`steps.${section.key}.description`)}
            </p>

            {/* Items list */}
            {section.items && section.items.length > 0 && (
              <ul className="mt-2 space-y-1">
                {section.items.map((item) => (
                  <li key={item} className="relative pl-4 text-sm text-gray-500">
                    <span className="absolute left-0 text-gray-400">•</span>
                    {t(`steps.${section.key}.${item}`)}
                  </li>
                ))}
              </ul>
            )}

            {/* Subsections */}
            {section.subsections?.map((subsection) => (
              <div key={subsection.key} className="mt-3 pl-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-geds-green">{subsection.icon}</span>
                  <h3 className="text-sm sm:text-base font-semibold text-geds-blue">
                    {t(`steps.${section.key}.${subsection.key}.title`)}
                  </h3>
                </div>
                <ul className="pl-6 space-y-0.5">
                  {subsection.items?.map((item) => (
                    <li key={item} className="relative pl-4 text-sm text-gray-500">
                      <span className="absolute left-0 text-gray-400">•</span>
                      {t(`steps.${section.key}.${subsection.key}.${item}`)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

interface WelcomeDialogProps {
  onClose: () => void;
}

export default function WelcomeDialog({ onClose }: WelcomeDialogProps) {
  const t = useTranslations('welcome');

  return (
    <main 
      id="main-content"
      role="main"
      aria-labelledby="welcome-title"
      className={cn(
        "rounded-2xl max-w-full mx-auto",
        "h-[calc(100vh-8rem)] sm:h-auto sm:max-h-[80vh]",
        "flex flex-col"
      )}
    >
      <WelcomeTitle title={t('title')} />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-1 sm:px-0 pb-20 sm:pb-4 scrollbar-thin">
        <div className="space-y-3 sm:space-y-4">
          {sections.map((section) => (
            <SectionItem 
              key={section.key}
              section={section}
              t={t}
            />
          ))}
        </div>
      </div>

      {/* Start button - fixed on mobile */}
      <div className={cn(
        "mt-4",
        "sm:static fixed bottom-0 left-0 right-0",
        "p-4 sm:p-0",
        "bg-white sm:bg-transparent",
        "border-t sm:border-t-0 border-gray-100",
        "z-10"
      )}>
        <Button
          onClick={onClose}
          className={cn(
            "w-full py-3 sm:py-2",
            "rounded-xl sm:rounded-lg",
            "btn-geds-primary text-lg"
          )}
        >
          {t('startButton')}
        </Button>
      </div>
    </main>
  );
}

