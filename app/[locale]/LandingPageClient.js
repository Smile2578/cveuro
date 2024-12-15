'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  Button, 
  Box, 
  Typography, 
  Container,
  Stack,
  Card, 
  CardContent, 
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import dynamic from 'next/dynamic';
import { useCVStore } from '@/app/store/cvStore';
import theme from '../theme';

// Import dynamique des composants lourds
const NavBar = dynamic(() => import('../components/common/NavBar'), {
  loading: () => <Box sx={{ height: '64px' }} />
});

const Footer = dynamic(() => import('../components/common/Footer'), {
  loading: () => <Box sx={{ height: '50px' }} />
});

// Import dynamique des icônes
const Icons = {
  Person: dynamic(() => import('@mui/icons-material/Person')),
  School: dynamic(() => import('@mui/icons-material/School')),
  Work: dynamic(() => import('@mui/icons-material/Work')),
  Language: dynamic(() => import('@mui/icons-material/Language')),
  Star: dynamic(() => import('@mui/icons-material/Star')),
  Timeline: dynamic(() => import('@mui/icons-material/Timeline'))
};

// Import dynamique de Framer Motion
const motion = dynamic(() => import('framer-motion').then((mod) => mod.motion), {
  ssr: false
});

export default function LandingPageClient() {
  const router = useRouter();
  const t = useTranslations('common');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { resetForm } = useCVStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCreateCV = async () => {
    setIsLoading(true);
    resetForm(); // Reset le formulaire avant de commencer
    router.push('/cvgen');
  };

  const MotionComponent = isClient && !isMobile ? motion.div : 'div';

  const features = [
    { icon: 'Person', key: "personalInfo" },
    { icon: 'School', key: "education" },
    { icon: 'Work', key: "experience" },
    { icon: 'Language', key: "languages" },
    { icon: 'Star', key: "skills" },
    { icon: 'Timeline', key: "projects" }
  ];

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default,
    }}>
      <NavBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          pt: { xs: '110px', sm: '120px' },
          pb: { xs: 4, sm: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ 
            color: theme.palette.primary.dark,
            fontSize: { xs: '2rem', sm: '2.5rem' },
            textAlign: 'center',
            fontWeight: 'bold',
            mb: 3,
          }}>
            {t('landing.title')}
          </Typography>
          
          <Typography variant="h6" sx={{ 
            mb: 5, 
            textAlign: 'center', 
            color: theme.palette.text.primary,
            fontSize: { xs: '1rem', sm: '1.2rem' },
            maxWidth: '700px',
            lineHeight: 1.6,
            mx: 'auto'
          }}>
            {t('landing.subtitle')}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              size="large" 
              color="primary"
              onClick={handleCreateCV}
              disabled={isLoading}
              sx={{
                padding: '10px 25px',
                fontSize: '1rem',
                borderRadius: '25px',
                boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11)',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1)',
                },
                '&:active': { transform: 'translateY(1px)' }
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t('buttons.createCV')
              )}
            </Button>
          </Box>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }}
            spacing={4} 
            sx={{ mt: 5 }}
            useFlexGap 
            flexWrap="wrap"
            justifyContent="center"
          >
            {features.map((feature, index) => {
              const IconComponent = Icons[feature.icon];
              return (
                <Box 
                  key={index}
                  sx={{
                    width: { xs: '100%', sm: 'calc(50% - 32px)', md: 'calc(33.333% - 32px)' },
                    minWidth: { sm: '280px' }
                  }}
                >
                  <Card sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRadius: '15px',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    transition: 'box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                    }
                  }}>
                    <CardContent sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      padding: '1.5rem'
                    }}>
                      {IconComponent && (
                        <IconComponent sx={{ fontSize: 50, color: theme.palette.primary.main, mb: 2 }} />
                      )}
                      <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {t(`landing.features.${feature.key}.title`)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {t(`landing.features.${feature.key}.description`)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
          </Stack>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
} 