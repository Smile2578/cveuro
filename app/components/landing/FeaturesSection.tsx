'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { 
  User,
  GraduationCap,
  Briefcase,
  Languages,
  Code,
  Sparkles
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Features data
const features = [
  { icon: User, titleKey: 'landing.features.personalInfo.title', descKey: 'landing.features.personalInfo.description' },
  { icon: GraduationCap, titleKey: 'landing.features.education.title', descKey: 'landing.features.education.description' },
  { icon: Briefcase, titleKey: 'landing.features.experience.title', descKey: 'landing.features.experience.description' },
  { icon: Languages, titleKey: 'landing.features.languages.title', descKey: 'landing.features.languages.description' },
  { icon: Code, titleKey: 'landing.features.skills.title', descKey: 'landing.features.skills.description' },
  { icon: Sparkles, titleKey: 'landing.features.projects.title', descKey: 'landing.features.projects.description' }
];

// Card variant styles using GEDS CSS classes
const cardVariants = [
  { card: 'feature-card-blue', text: 'text-geds-blue', bg: 'bg-geds-blue/10' },
  { card: 'feature-card-green', text: 'text-geds-green', bg: 'bg-geds-green/10' },
  { card: 'feature-card-cyan', text: 'text-geds-cyan', bg: 'bg-geds-cyan/10' },
];

// Feature Card Component
function FeatureCard({ icon: Icon, title, description, index }: {
  icon: typeof User;
  title: string;
  description: string;
  index: number;
}) {
  const variant = cardVariants[index % cardVariants.length];

  return (
    <motion.div variants={fadeInUp}>
      <Card className={cn("h-full", variant.card)}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={cn("p-3 rounded-xl", variant.bg, variant.text)}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className={cn("text-lg font-semibold mb-2", variant.text)}>
                {title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const t = useTranslations('common');

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-serif font-bold text-center mb-4 text-gray-900"
          >
            <span className="text-gradient">
              {t('landing.features.title').split(' ').slice(0, 3).join(' ')}
            </span>
            {' '}{t('landing.features.title').split(' ').slice(3).join(' ')}
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-gray-600 text-center max-w-2xl mx-auto mb-12"
          >
            {t('landing.features.subtitle')}
          </motion.p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={t(feature.titleKey)}
                description={t(feature.descKey)}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

