'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle,
  User,
  GraduationCap,
  Briefcase,
  Languages,
  Code,
  Sparkles,
  Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCVStore } from '@/app/store/cvStore';
import { cn } from '@/lib/utils';
import NavBar from './common/NavBar';
import Footer from './common/Footer';

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

// Stats data - Updated with real numbers
const statistics = [
  { icon: Users, value: "50K+", labelKey: 'landing.stats.visitors', color: 'text-sage' },
  { icon: FileText, value: "3K+", labelKey: 'landing.stats.cvsCreated', color: 'text-gold' },
  { icon: Clock, value: "5 min", labelKey: 'landing.stats.minutes', color: 'text-sage-light' },
  { icon: CheckCircle, value: "95%", labelKey: 'landing.stats.satisfaction', color: 'text-gold-light' }
];

// Features data
const features = [
  { icon: User, titleKey: 'landing.features.personalInfo.title', descKey: 'landing.features.personalInfo.description' },
  { icon: GraduationCap, titleKey: 'landing.features.education.title', descKey: 'landing.features.education.description' },
  { icon: Briefcase, titleKey: 'landing.features.experience.title', descKey: 'landing.features.experience.description' },
  { icon: Languages, titleKey: 'landing.features.languages.title', descKey: 'landing.features.languages.description' },
  { icon: Code, titleKey: 'landing.features.skills.title', descKey: 'landing.features.skills.description' },
  { icon: Sparkles, titleKey: 'landing.features.projects.title', descKey: 'landing.features.projects.description' }
];

// Stat Card Component
function StatCard({ icon: Icon, value, label, color, index }: { 
  icon: typeof Users; 
  value: string; 
  label: string; 
  color: string;
  index: number;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className={cn("stagger-" + (index + 1))}
    >
      <Card className="glass group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
        <CardContent className="p-6 text-center">
          <Icon className={cn("w-10 h-10 mx-auto mb-3 transition-transform group-hover:scale-110", color)} />
          <p className={cn("text-3xl font-serif font-bold mb-1", color)}>{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Feature Card Component
function FeatureCard({ icon: Icon, title, description, index }: {
  icon: typeof User;
  title: string;
  description: string;
  index: number;
}) {
  const colors = [
    'text-sage border-sage/20 hover:border-sage/50',
    'text-gold border-gold/20 hover:border-gold/50',
    'text-sage-light border-sage-light/20 hover:border-sage-light/50',
    'text-gold-light border-gold-light/20 hover:border-gold-light/50',
    'text-sage border-sage/20 hover:border-sage/50',
    'text-gold border-gold/20 hover:border-gold/50',
  ];
  const colorClass = colors[index % colors.length];

  return (
    <motion.div variants={fadeInUp}>
      <Card className={cn(
        "h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        "border-2 bg-card/50 backdrop-blur-sm",
        colorClass.split(' ').slice(1).join(' ')
      )}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={cn(
              "p-3 rounded-xl bg-gradient-to-br from-muted to-muted/50",
              colorClass.split(' ')[0]
            )}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className={cn("font-serif text-lg font-semibold mb-2", colorClass.split(' ')[0])}>
                {title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const t = useTranslations('common');
  const [isLoading, setIsLoading] = useState(false);
  const { resetForm } = useCVStore();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleCreateCV = useCallback(() => {
    if (!termsAccepted) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    setIsLoading(true);
    resetForm();
    router.push('/cvgen');
  }, [resetForm, router, termsAccepted]);

  return (
    <div className="min-h-screen bg-background noise">
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-hero-gradient" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-sage/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        <div className="container relative z-10 px-4 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              <motion.div variants={fadeInUp}>
                <Badge 
                  variant="outline" 
                  className="mb-6 px-4 py-2 text-sm font-medium border-sage/30 text-sage bg-sage/5 animate-pulse-slow"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t('landing.tag')}
                </Badge>
              </motion.div>

              <motion.h1 
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6"
              >
                <span className="text-foreground">{t('landing.title').split(' ').slice(0, 2).join(' ')} </span>
                <span className="text-gradient">{t('landing.title').split(' ').slice(2, 4).join(' ')}</span>
                <span className="text-foreground"> {t('landing.title').split(' ').slice(4).join(' ')}</span>
              </motion.h1>

              <motion.p 
                variants={fadeInUp}
                className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
              >
                {t('landing.subtitle')}
              </motion.p>

              {/* Terms checkbox */}
              <motion.div variants={fadeInUp} className="mb-6">
                <div className="flex items-start gap-3 justify-center lg:justify-start">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                    className="mt-1 border-sage data-[state=checked]:bg-sage data-[state=checked]:border-sage"
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                    {t('terms.accept')}{' '}
                    <Link href="/terms" className="text-sage hover:text-sage-light underline underline-offset-2">
                      {t('terms.terms')}
                    </Link>
                    {' '}{t('terms.and')}{' '}
                    <Link href="/privacy" className="text-sage hover:text-sage-light underline underline-offset-2">
                      {t('terms.privacy')}
                    </Link>
                  </label>
                </div>
                
                <p className="text-xs text-gold mt-2 font-medium text-center lg:text-left">
                  {t('terms.english')}
                </p>

                {showError && (
                  <Alert variant="destructive" className="mt-4 max-w-md mx-auto lg:mx-0">
                    <AlertDescription>{t('terms.error')}</AlertDescription>
                  </Alert>
                )}
              </motion.div>

              {/* CTA Button */}
              <motion.div variants={fadeInUp}>
                <Button
                  size="lg"
                  onClick={handleCreateCV}
                  disabled={isLoading}
                  className={cn(
                    "group relative overflow-hidden px-8 py-6 text-lg font-semibold",
                    "bg-gradient-to-r from-sage to-sage-dark hover:from-sage-dark hover:to-sage",
                    "text-white shadow-lg shadow-sage/25 hover:shadow-xl hover:shadow-sage/30",
                    "transition-all duration-300 hover:-translate-y-0.5"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {t('buttons.createCV')}
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Right content - CV Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div 
                className={cn(
                  "relative rounded-2xl p-2 bg-card/80 backdrop-blur-sm",
                  "shadow-2xl shadow-sage/10 border border-border/50",
                  "transform perspective-1000 hover:rotate-y-2 hover:-translate-y-2",
                  "transition-all duration-500"
                )}
                style={{ transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)' }}
              >
                <div className="rounded-xl overflow-hidden">
                  <Image 
                    src="/template/cv-preview.webp" 
                    alt="CV preview" 
                    width={600} 
                    height={800}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>
                
                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 animate-float">
                  <Badge className="bg-gold text-gold-foreground shadow-lg px-4 py-2">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Europass
                  </Badge>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-serif font-bold text-center mb-4"
            >
              <span className="text-gradient">{t('landing.stats.title').split(' ').slice(0, 3).join(' ')}</span>
              {' '}{t('landing.stats.title').split(' ').slice(3).join(' ')}
            </motion.h2>
            
            <motion.div 
              variants={fadeInUp}
              className="w-20 h-1 bg-gradient-to-r from-sage to-gold mx-auto mb-12 rounded-full"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {statistics.map((stat, index) => (
                <StatCard
                  key={index}
                  icon={stat.icon}
                  value={stat.value}
                  label={t(stat.labelKey)}
                  color={stat.color}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-serif font-bold text-center mb-4"
            >
              <span className="text-gradient">{t('landing.features.title').split(' ').slice(0, 3).join(' ')}</span>
              {' '}{t('landing.features.title').split(' ').slice(3).join(' ')}
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-muted-foreground text-center max-w-2xl mx-auto mb-12"
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

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sage/90 to-sage-dark" />
        <div className="absolute inset-0 noise opacity-10" />
        
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" 
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
            }} 
          />
        </div>

        <div className="container relative z-10 px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-serif font-bold text-white mb-6"
            >
              {t('landing.cta.title')}
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-white/80 max-w-xl mx-auto mb-8 text-lg"
            >
              {t('landing.cta.subtitle')}
            </motion.p>

            <motion.div variants={fadeInUp}>
              <Button
                size="lg"
                onClick={handleCreateCV}
                disabled={isLoading}
                className={cn(
                  "group px-8 py-6 text-lg font-semibold",
                  "bg-white text-sage-dark hover:bg-cream",
                  "shadow-xl hover:shadow-2xl",
                  "transition-all duration-300 hover:-translate-y-1"
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {t('buttons.createCV')}
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </motion.div>

            <motion.p 
              variants={fadeInUp}
              className="text-white/60 text-sm mt-6"
            >
              Gratuit • 5 minutes • Format Europass
            </motion.p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

