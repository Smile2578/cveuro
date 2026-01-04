'use client';

import { Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SectionTitle from '../common/SectionTitle';

interface HobbiesSectionProps {
  hobbies: string[];
  onEdit: (section: string) => void;
  onDelete: (index: number) => void;
  t: (key: string) => string;
}

export default function HobbiesSection({ hobbies, onEdit, t }: HobbiesSectionProps) {
  if (!hobbies?.length) return null;

  return (
    <Card className="mb-4 p-4">
      <SectionTitle 
        icon={Heart} 
        title={t('sections.hobbies')} 
        onEdit={() => onEdit('hobbies')}
      />
      <div className="flex flex-wrap gap-2">
        {hobbies.map((hobby, index) => (
          <Badge
            key={index}
            variant="outline"
            className="px-3 py-1 bg-primary/10 text-primary border-primary/30"
          >
            {hobby}
          </Badge>
        ))}
      </div>
    </Card>
  );
}

