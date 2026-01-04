'use client';

import { useTranslations } from 'next-intl';
import { User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SectionTitle from '../common/SectionTitle';

interface PersonalInfo {
  firstname?: string;
  lastname?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  zip?: string;
  dateofBirth?: string;
  nationality?: { code: string; label: string }[];
  linkedIn?: string;
  personalWebsite?: string;
}

interface PersonalInfoSectionProps {
  data: PersonalInfo | null;
  onEdit: () => void;
}

export default function PersonalInfoSection({ data, onEdit }: PersonalInfoSectionProps) {
  const t = useTranslations('cvedit');

  if (!data) return null;

  return (
    <Card className="mb-4 p-4">
      <SectionTitle 
        icon={User} 
        title={t('sections.personalInfo')} 
        onEdit={onEdit}
      />
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="min-w-[200px] flex-1">
            <p className="text-sm text-muted-foreground">
              {t('personalInfo.name')}
            </p>
            <p className="font-medium">
              {data.firstname} {data.lastname}
            </p>
          </div>
          <div className="min-w-[200px] flex-1">
            <p className="text-sm text-muted-foreground">
              {t('personalInfo.contact')}
            </p>
            <p className="font-medium">
              {data.email} • {data.phoneNumber}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="min-w-[200px] flex-1">
            <p className="text-sm text-muted-foreground">
              {t('personalInfo.address')}
            </p>
            <p className="font-medium">
              {data.address}, {data.city} {data.zip}
            </p>
          </div>
          <div className="min-w-[200px] flex-1">
            <p className="text-sm text-muted-foreground">
              {t('personalInfo.dateofBirth')}
            </p>
            <p className="font-medium">
              {data.dateofBirth}
            </p>
          </div>
        </div>
        {data.nationality && data.nationality.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {t('personalInfo.nationality')}
            </p>
            <div className="flex flex-wrap gap-2">
              {data.nationality.map((nat, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-primary text-primary"
                >
                  {nat.label}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {data.linkedIn && (
          <div>
            <p className="text-sm text-muted-foreground">
              {t('personalInfo.linkedIn')}
            </p>
            <a 
              href={data.linkedIn} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {data.linkedIn}
            </a>
          </div>
        )}
        {data.personalWebsite && (
          <div>
            <p className="text-sm text-muted-foreground">
              {t('personalInfo.personalWebsite')}
            </p>
            <a 
              href={data.personalWebsite} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {data.personalWebsite}
            </a>
          </div>
        )}
      </div>
    </Card>
  );
}

