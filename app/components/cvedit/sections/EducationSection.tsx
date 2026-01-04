'use client';

import { GraduationCap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import SectionTitle from '../common/SectionTitle';
import { cn } from '@/lib/utils';

interface Education {
  schoolName: string;
  degree: string;
  customDegree?: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  ongoing?: boolean;
  achievements?: string[];
}

interface EducationSectionProps {
  education: Education[];
  onEdit: (section: string) => void;
  onDelete: (index: number) => void;
  t: (key: string) => string;
  formatDate: (date: string) => string;
  capitalizeFirst: (str: string) => string;
}

export default function EducationSection({ 
  education, 
  onEdit, 
  t, 
  formatDate, 
  capitalizeFirst 
}: EducationSectionProps) {
  if (!education?.length) return null;

  return (
    <Card className="mb-4 p-4">
      <SectionTitle 
        icon={GraduationCap} 
        title={t('sections.education')} 
        onEdit={() => onEdit('education')}
      />
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className={cn(index < education.length - 1 && "border-b pb-4")}>
            <h4 className="font-semibold text-foreground">
              {edu.degree === 'other' ? 
                capitalizeFirst(edu.customDegree || '') : 
                capitalizeFirst(edu.degree)}
            </h4>
            <p className="text-foreground">{edu.schoolName}</p>
            <p className="text-sm text-muted-foreground">
              {edu.fieldOfStudy}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDate(edu.startDate)} - {edu.ongoing ? t('common.ongoing') : formatDate(edu.endDate || '')}
            </p>
            {edu.achievements && edu.achievements.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-1">
                  {t('education.achievements')}:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  {edu.achievements.map((achievement, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

