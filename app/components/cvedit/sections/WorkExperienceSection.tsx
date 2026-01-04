'use client';

import { Briefcase } from 'lucide-react';
import { Card } from '@/components/ui/card';
import SectionTitle from '../common/SectionTitle';
import { cn } from '@/lib/utils';

interface WorkExperience {
  companyName: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  ongoing?: boolean;
  responsibilities?: string[];
}

interface WorkExperienceSectionProps {
  workExperience: WorkExperience[];
  onEdit: (section: string) => void;
  onDelete: (index: number) => void;
  t: (key: string) => string;
  formatDate: (date: string) => string;
}

export default function WorkExperienceSection({ 
  workExperience, 
  onEdit, 
  t, 
  formatDate 
}: WorkExperienceSectionProps) {
  if (!workExperience?.length) return null;

  return (
    <Card className="mb-4 p-4">
      <SectionTitle 
        icon={Briefcase} 
        title={t('sections.experience')} 
        onEdit={() => onEdit('workExperience')}
      />
      <div className="space-y-4">
        {workExperience.map((exp, index) => (
          <div key={index} className={cn(index < workExperience.length - 1 && "border-b pb-4")}>
            <h4 className="font-semibold text-foreground">
              {exp.position}
            </h4>
            <p className="text-foreground">{exp.companyName}</p>
            <p className="text-sm text-muted-foreground">
              {exp.location}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDate(exp.startDate)} - {exp.ongoing ? t('common.ongoing') : formatDate(exp.endDate || '')}
            </p>
            {exp.responsibilities && exp.responsibilities.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-1">
                  {t('experience.responsibilities')}:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      {resp}
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

