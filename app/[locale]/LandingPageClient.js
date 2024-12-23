'use client';

import { useState, memo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { 
  Button, 
  Box, 
  Typography, 
  Container,
  Stack,
  Card, 
  CardContent, 
  useMediaQuery,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Link as MuiLink,
  Alert
} from '@mui/material';
import {
  Person,
  School,
  Work,
  Language,
  Star,
  Timeline
} from '@mui/icons-material';
import { useCVStore } from '@/app/store/cvStore';
import theme from '../theme';

// Import dynamique des composants lourds
const NavBar = dynamic(() => import('../components/common/NavBar'), {
  loading: () => <Box sx={{ height: '64px' }} />,
  ssr: true
});

const Footer = dynamic(() => import('../components/common/Footer'), {
  loading: () => <Box sx={{ height: '50px' }} />,
  ssr: true
});

const Icons = {
  Person,
  School,
  Work,
  Language,
  Star,
  Timeline
};

const MainTitle = memo(({ title }) => (
  <Typography 
    variant="h1"
    component="h1"
    sx={{ 
      color: theme.palette.primary.dark,
      fontSize: { xs: '1.75rem', sm: '2.5rem' },
      textAlign: 'center',
      fontWeight: 700,
      mb: 3,
      maxWidth: '800px',
      mx: 'auto',
      lineHeight: { xs: 1.3, sm: 1.4 },
      letterSpacing: '-0.02em',
      textRendering: 'optimizeLegibility',
      WebkitFontSmoothing: 'antialiased',
      height: { xs: 'auto', sm: '80px' },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
    tabIndex={0}
  >
    {title}
  </Typography>
));

MainTitle.displayName = 'MainTitle';

const FeatureCard = memo(({ feature, IconComponent, t }) => (
  <Card
    role="article"
    aria-labelledby={`feature-title-${feature.key}`}
    sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRadius: '15px',
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      transition: 'box-shadow 0.3s ease-in-out',
      '&:hover': {
        boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
      },
      '&:focus-within': {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: '2px',
      }
    }}
  >
    <CardContent sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      padding: '1.5rem'
    }}>
      {IconComponent && (
        <IconComponent 
          aria-hidden="true"
          sx={{ 
            fontSize: 50, 
            color: theme.palette.primary.main, 
            mb: 2 
          }} 
        />
      )}
      <Typography 
        id={`feature-title-${feature.key}`}
        variant="h2" 
        align="center" 
        sx={{ 
          fontSize: '1.25rem',
          fontWeight: 'bold',
          mb: 1,
          color: theme.palette.text.primary
        }}
      >
        {t(`landing.features.${feature.key}.title`)}
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        align="center"
      >
        {t(`landing.features.${feature.key}.description`)}
      </Typography>
    </CardContent>
  </Card>
));

FeatureCard.displayName = 'FeatureCard';

export default function LandingPageClient() {
  const router = useRouter();
  const t = useTranslations('common');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { resetForm } = useCVStore();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleCreateCV = useCallback(async () => {
    if (!termsAccepted) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    setIsLoading(true);
    resetForm();
    router.push('/cvgen');
  }, [resetForm, router, termsAccepted]);

  const features = [
    { icon: 'Person', key: "personalInfo" },
    { icon: 'School', key: "education" },
    { icon: 'Work', key: "experience" },
    { icon: 'Language', key: "languages" },
    { icon: 'Star', key: "skills" },
    { icon: 'Timeline', key: "projects" }
  ];

  if (!isHydrated) {
    return null;
  }

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <NavBar />
      <Box
        component="main"
        role="main"
        aria-label={t('landing.mainContent')}
        id="main-content"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          pt: { xs: '100px', sm: '120px' },
          pb: { xs: 4, sm: 6 },
        }}
      >
        <Container 
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <MainTitle title={t('landing.title')} />
          
          <Typography 
            variant="h2" 
            component="p"
            sx={{ 
              mb: 5, 
              textAlign: 'center', 
              color: theme.palette.text.primary,
              fontSize: { xs: '1rem', sm: '1.2rem' },
              maxWidth: '700px',
              lineHeight: 1.6,
              mx: 'auto'
            }}
          >
            {t('landing.subtitle')}
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            mb: 4
          }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  color="primary"
                  sx={{
                    '&.Mui-checked': {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ textAlign: 'center' }}>
                  {t('terms.accept')}{' '}
                  <MuiLink href="/terms" target="_blank" rel="noopener noreferrer">
                    {t('terms.terms')}
                  </MuiLink>
                  {' '}{t('terms.and')}{' '}
                  <MuiLink href="/privacy" target="_blank" rel="noopener noreferrer">
                    {t('terms.privacy')}
                  </MuiLink>
                </Typography>
              }
            />
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'red',
                textAlign: 'center'
              }}
            >
              {t('terms.english')}
            </Typography>

            {showError && (
              <Alert 
                severity="error" 
                sx={{ 
                  width: 'fit-content',
                  transition: 'all 0.3s ease',
                  animation: 'fadeIn 0.3s ease'
                }}
              >
                {t('terms.error')}
              </Alert>
            )}

            <Button 
              variant="contained" 
              size="large" 
              color="primary"
              onClick={handleCreateCV}
              disabled={isLoading}
              aria-label={t('buttons.createCV')}
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
                '&:active': { transform: 'translateY(1px)' },
                '&:focus-visible': {
                  outline: `2px solid ${theme.palette.primary.main}`,
                  outlineOffset: '2px',
                }
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
            {features.map((feature, index) => (
              <Box 
                key={index}
                sx={{
                  width: { xs: '100%', sm: 'calc(50% - 32px)', md: 'calc(33.333% - 32px)' },
                  minWidth: { sm: '280px' }
                }}
              >
                <FeatureCard 
                  feature={feature} 
                  IconComponent={Icons[feature.icon]}
                  t={t}
                />
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
} 