'use client';

import { LucideIcon, Edit } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

interface SectionTitleProps {
  icon: LucideIcon;
  title: string;
  onEdit?: () => void;
}

export default function SectionTitle({ icon: Icon, title, onEdit }: SectionTitleProps) {
  const t = useTranslations('cvedit');

  return (
    <div className="flex items-center gap-2 mb-4 bg-muted/50 p-3 rounded-lg">
      {Icon && <Icon className="w-5 h-5 text-primary" />}
      <h3 className="text-lg font-bold text-primary flex-1">
        {title}
      </h3>
      {onEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="hover:bg-primary/10"
        >
          <Edit className="w-4 h-4" />
          <span className="sr-only">{t('common.edit')}</span>
        </Button>
      )}
    </div>
  );
}

