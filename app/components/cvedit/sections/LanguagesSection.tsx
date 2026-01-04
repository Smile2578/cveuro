'use client';

import { Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SectionTitle from '../common/SectionTitle';
import { cn } from '@/lib/utils';

interface Language {
  language: string;
  proficiency: string;
  testName?: string;
  testScore?: string;
}

interface LanguagesSectionProps {
  languages: Language[];
  onEdit: (section: string) => void;
  onDelete: (index: number) => void;
  t: (key: string) => string;
}

export default function LanguagesSection({ languages, onEdit, t }: LanguagesSectionProps) {
  if (!languages?.length) return null;

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'Native':
      case 'C2': return 'bg-red-100 text-red-700 border-red-300';
      case 'C1': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'B2': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <Card className="mb-4 p-4">
      <SectionTitle 
        icon={Globe} 
        title={t('sections.languages')} 
        onEdit={() => onEdit('languages')}
      />
      <div className="space-y-3">
        {languages.map((lang, index) => (
          <div key={index} className={cn(index < languages.length - 1 && "border-b pb-3")}>
            <Badge
              variant="outline"
              className={cn("mb-1", getProficiencyColor(lang.proficiency))}
            >
              {lang.language}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {t(`languages.levels.${lang.proficiency}`)}
            </p>
            {lang.testName && (
              <p className="text-sm text-muted-foreground">
                {lang.testName}: {lang.testScore}
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

