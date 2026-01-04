'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Users, FileText, Clock, CheckCircle } from 'lucide-react';
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

// Stats data - using GEDS CSS classes
const statistics = [
  { icon: Users, value: "50K+", labelKey: 'landing.stats.visitors', colorClass: 'text-geds-blue' },
  { icon: FileText, value: "3K+", labelKey: 'landing.stats.cvsCreated', colorClass: 'text-geds-green' },
  { icon: Clock, value: "5 min", labelKey: 'landing.stats.minutes', colorClass: 'text-geds-cyan' },
  { icon: CheckCircle, value: "95%", labelKey: 'landing.stats.satisfaction', colorClass: 'text-geds-blue' }
];

// Stat Card Component
function StatCard({ icon: Icon, value, label, colorClass, index }: { 
  icon: typeof Users; 
  value: string; 
  label: string; 
  colorClass: string;
  index: number;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className={cn("stagger-" + (index + 1))}
    >
      <Card className="stat-card">
        <CardContent className="p-6 text-center">
          <Icon className={cn("w-10 h-10 mx-auto mb-3 transition-transform group-hover:scale-110", colorClass)} />
          <p className={cn("text-3xl font-bold mb-1", colorClass)}>{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function StatsSection() {
  const t = useTranslations('common');

  return (
    <section className="py-20 bg-white">
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
            <span className="text-gradient-blue-green">
              {t('landing.stats.title').split(' ').slice(0, 3).join(' ')}
            </span>
            {' '}{t('landing.stats.title').split(' ').slice(3).join(' ')}
          </motion.h2>
          
          <motion.div 
            variants={fadeInUp}
            className="divider-geds mb-12"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {statistics.map((stat, index) => (
              <StatCard
                key={index}
                icon={stat.icon}
                value={stat.value}
                label={t(stat.labelKey)}
                colorClass={stat.colorClass}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

