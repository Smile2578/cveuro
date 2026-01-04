'use client';

import { Wrench } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SectionTitle from '../common/SectionTitle';
import { cn } from '@/lib/utils';

interface Skill {
  skillName: string;
  level: string;
}

interface SkillsSectionProps {
  skills: Skill[];
  onEdit: (section: string) => void;
  onDelete: (index: number) => void;
  t: (key: string) => string;
}

export default function SkillsSection({ skills, onEdit, t }: SkillsSectionProps) {
  if (!skills?.length) return null;

  const getSkillColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-red-100 text-red-700 border-red-300';
      case 'advanced': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'intermediate': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <Card className="mb-4 p-4">
      <SectionTitle 
        icon={Wrench} 
        title={t('sections.skills')} 
        onEdit={() => onEdit('skills')}
      />
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge
            key={index}
            variant="outline"
            className={cn("px-3 py-1", getSkillColor(skill.level))}
          >
            {skill.skillName} ({t(`skills.levels.${skill.level}`)})
          </Badge>
        ))}
      </div>
    </Card>
  );
}

