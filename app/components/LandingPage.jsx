'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useCVStore } from '@/app/store/cvStore';
import theme from '../theme';
import dynamic from 'next/dynamic';
import { 
  Box, 
  Typography, 
  Button,
  Container,
  Paper,
  Checkbox,
  FormControlLabel,
  Link as MuiLink,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowForward,
  Person,
  Description,
  School,
  Work,
  Language,
  Code as CodeIcon,
  Folder as FolderIcon,
  People,
  AccessTime,
  CheckCircle,
} from '@mui/icons-material';

// Import dynamique des composants lourds
const NavBar = dynamic(() => import('./common/NavBar'), {
  loading: () => <Box sx={{ height: '64px' }} />,
  ssr: true
});

const Footer = dynamic(() => import('./common/Footer'), {
  loading: () => <Box sx={{ height: '50px' }} />,
  ssr: true
});

// Composant pour les statistiques
function StatCard({ icon: IconComponent, value, label, color = theme.palette.primary.main }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '24px',
        background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 15px 35px rgba(31, 38, 135, 0.15)',
        }
      }}
    >
      <IconComponent 
        sx={{ 
          fontSize: { xs: 38, sm: 48 }, 
          color: color,
          mb: 2 
        }} 
      />
      <Typography 
        variant="h3" 
        fontWeight="bold" 
        align="center" 
        gutterBottom
        sx={{
          fontSize: { xs: '1.5rem', sm: '1.75rem' },
          fontFamily: "'Urbanist', sans-serif",
          fontWeight: 800,
          color: color,
          textShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}
      >
        {value}
      </Typography>
      <Typography 
        variant="subtitle1" 
        align="center" 
        color="text.secondary"
        sx={{
          fontSize: { xs: '0.85rem', sm: '1rem' },
          fontFamily: "'Urbanist', sans-serif",
          fontWeight: 500,
          letterSpacing: '0.01em'
        }}
      >
        {label}
      </Typography>
    </Paper>
  );
}

// Nouveau composant pour les fonctionnalités avec un design amélioré
function FeatureCard({ icon: IconComponent, title, description, index }) {
  // Tableau de couleurs pour les icônes
  const colors = [
    '#1976d2', // blue
    '#9c27b0', // purple
    '#2e7d32', // green
    '#ed6c02', // orange
    '#d32f2f', // red
    '#0288d1'  // light blue
  ];
  
  // Récupérer la couleur pour cette carte
  const color = colors[index % colors.length];
  
  // Créer des backgrounds avec opacités différentes
  const bgColorLight = `${color}15`; // 15% opacité
  
  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Paper
        elevation={0}
        sx={{
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
          transition: 'all 0.3s ease-out',
          border: '1px solid',
          borderColor: 'rgba(25, 118, 210, 0.08)',
          background: 'white',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
            borderColor: `${color}40`, // 40% opacité pour le hover
          }
        }}
      >
        {/* Pattern de fond */}
        <Box sx={{ 
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }} />
        
        {/* Gradient de fond */}
        <Box sx={{ 
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top right, rgba(255,255,255,0.9), rgba(255,255,255,0.4), rgba(255,255,255,0.1))'
        }} />
        
        <Box sx={{ 
          position: 'relative',
          zIndex: 1,
          p: { xs: 3, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          <Box sx={{ 
            mb: 2,
            display: 'flex',
            alignItems: 'center'
          }}>
            <Box sx={{ 
              mr: 2,
              p: 1.5,
              borderRadius: '12px',
              bgcolor: bgColorLight,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <IconComponent fontSize="medium" />
            </Box>
            
            <Box sx={{
              position: 'absolute',
              left: 0,
              height: '100%',
              width: '4px',
              bgcolor: `${color}30`, // 30% opacité
              borderTopRightRadius: '4px',
              borderBottomRightRadius: '4px',
              transition: 'all 0.2s ease-out',
              '&:hover': {
                bgcolor: color,
                height: '60%',
              }
            }} />
            
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              sx={{ 
                fontSize: '1.25rem',
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 700,
                color: color,
                transition: 'transform 0.2s ease-out',
                '&:hover': {
                  transform: 'translateX(4px)'
                }
              }}
            >
              {title}
            </Typography>
          </Box>
          
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              fontSize: '0.95rem',
              lineHeight: 1.5,
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 400,
              pl: 6
            }}
          >
            <Box component="span" sx={{ fontWeight: 600, color }}>
              {description.split(' ').slice(0, 2).join(' ')}
            </Box>
            {' '}
            {description.split(' ').slice(2).join(' ')}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const t = useTranslations('common');
  const [isLoading, setIsLoading] = useState(false);
  const { resetForm } = useCVStore();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showError, setShowError] = useState(false);

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

  const statistics = [
    { icon: People, value: "25,000+", label: t('landing.stats.visitors'), color: '#1976d2' },
    { icon: Description, value: "1,500+", label: t('landing.stats.cvsCreated'), color: '#2e7d32' },
    { icon: AccessTime, value: "5 min", label: t('landing.stats.minutes'), color: '#ed6c02' },
    { icon: CheckCircle, value: "95%", label: t('landing.stats.satisfaction'), color: '#9c27b0' }
  ];

  const features = [
    { icon: Person, title: t('landing.features.personalInfo.title'), description: t('landing.features.personalInfo.description') },
    { icon: School, title: t('landing.features.education.title'), description: t('landing.features.education.description') },
    { icon: Work, title: t('landing.features.experience.title'), description: t('landing.features.experience.description') },
    { icon: Language, title: t('landing.features.languages.title'), description: t('landing.features.languages.description') },
    { icon: CodeIcon, title: t('landing.features.skills.title'), description: t('landing.features.skills.description') },
    { icon: FolderIcon, title: t('landing.features.projects.title'), description: t('landing.features.projects.description') }
  ];

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
      
      {/* Hero Section */}
      <Box
        component="main"
        role="main"
        aria-label={t('landing.mainContent')}
        id="main-content"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          minHeight: '100vh',
          pt: { xs: '80px', sm: '100px', md: '120px' },
          pb: { xs: 6, sm: 8, md: 10 },
          background: 'linear-gradient(135deg, rgba(193, 240, 246, 0.8) 0%, rgba(255, 255, 255, 0.95) 50%, rgba(193, 240, 246, 0.8) 100%)',
          borderBottomLeftRadius: { xs: 0, md: '50px' },
          borderBottomRightRadius: { xs: 0, md: '50px' },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 4, md: 6 }
          }}>
            <Box sx={{ 
              width: { xs: '100%', md: '58%' },
              textAlign: { xs: 'center', md: 'left' }
            }}>
              <Box className="fade-in" sx={{ 
                display: 'inline-block', 
                mb: 2,
                px: 1.5,
                py: 0.75,
                borderRadius: '20px',
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                color: theme.palette.primary.main,
                fontWeight: 600,
                fontSize: '0.875rem',
                fontFamily: "'Urbanist', sans-serif",
                letterSpacing: '0.05em'
              }}>
                {t('landing.tag')}
              </Box>
              
              <Typography 
                variant="h1" 
                component="h1"
                className="fade-in" 
                sx={{ 
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                  fontWeight: 800,
                  mb: 2,
                  fontFamily: "'Playfair Display', serif",
                  background: 'linear-gradient(90deg, #0d47a1 0%, #1976d2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '0.02em',
                  lineHeight: 1.2
                }}
              >
                {t('landing.title')}
              </Typography>
              
              <Typography 
                variant="h2" 
                component="p"
                className="fade-in" 
                sx={{ 
                  mb: 4,
                  color: theme.palette.text.secondary,
                  fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                  fontWeight: 400,
                  maxWidth: { md: '600px' },
                  fontFamily: "'Urbanist', sans-serif",
                  letterSpacing: '0.01em'
                }}
              >
                <Box component="span" sx={{ fontWeight: 700, color: theme.palette.primary.dark }}>
                  {t('landing.subtitle').split(' ').slice(0, 2).join(' ')}
                </Box>
                {' '}
                <Box component="span" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                  {t('landing.subtitle').split(' ').slice(2, 7).join(' ')}
                </Box>
                {' '}
                <Box component="span" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                  {t('landing.subtitle').split(' ').slice(7, 9).join(' ')}
                </Box>
                {' '}
                <Box component="span" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                  {t('landing.subtitle').split(' ').slice(9).join(' ')}
                </Box>
              </Typography>
              
              <Box sx={{ mb: 3 }} className="fade-in">
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
                    <Typography variant="body2" sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      fontFamily: "'Urbanist', sans-serif",
                      fontWeight: 500,
                      '& a': {
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        transition: 'color 0.2s',
                        '&:hover': {
                          color: theme.palette.primary.dark
                        }
                      }
                    }}>
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
                    fontWeight: 'bold',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    ml: 4,
                    fontFamily: "'Urbanist', sans-serif",
                    letterSpacing: '0.01em'
                  }}
                >
                  {t('terms.english')}
                </Typography>
                
                {showError && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mt: 2,
                      width: 'fit-content',
                      transition: 'all 0.3s ease-out',
                      animation: 'fadeIn 0.3s ease-out',
                      borderRadius: '12px'
                    }}
                  >
                    {t('terms.error')}
                  </Alert>
                )}
              </Box>
              
              <Button
                className="button-glow fade-in"
                variant="contained"
                size="large"
                onClick={handleCreateCV}
                disabled={isLoading}
                aria-label={t('buttons.createCV')}
                sx={{
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 'bold',
                  fontFamily: "'Urbanist', sans-serif",
                  letterSpacing: '0.05em',
                  borderRadius: '40px',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                  background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
                  transition: 'all 0.3s ease-out',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 25px rgba(25, 118, 210, 0.5)',
                    background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
                  }
                }}
                endIcon={isLoading ? null : <ArrowForward />}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  t('buttons.createCV')
                )}
              </Button>
            </Box>
            
            <Box sx={{ 
              width: { xs: '100%', md: '42%' },
              display: { xs: 'none', md: 'block' }
            }} className="fade-in">
              <Box sx={{ 
                position: 'relative',
                borderRadius: '24px',
                padding: '8px',
                overflow: 'hidden',
                background: 'white',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
                transition: 'all 0.5s ease-out',
                '&:hover': {
                  transform: 'perspective(1000px) rotateY(-2deg) rotateX(2deg) translateY(-10px)',
                  boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)',
                }
              }}>
                <Box sx={{ 
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}>
                  <Image 
                    src="/template/cv-preview.webp" 
                    alt="CV preview" 
                    width={600} 
                    height={800}
                    style={{ 
                      width: '100%', 
                      height: 'auto',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                    priority
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      
      {/* Stats Section */}
      <Box sx={{ py: { xs: 6, sm: 8 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h2" 
            align="center" 
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              fontWeight: 'bold',
              mb: { xs: 4, sm: 6 },
              color: theme.palette.primary.dark,
              position: 'relative',
              paddingBottom: '15px',
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 800,
              letterSpacing: '0.01em',
              '& .highlight': {
                color: theme.palette.primary.main,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  width: '100%',
                  height: '4px',
                  background: theme.palette.primary.light,
                  opacity: 0.3,
                  borderRadius: '2px',
                }
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '50%',
                width: '80px',
                height: '3px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                transform: 'translateX(-50%)'
              }
            }}
          >
            <span className="highlight">{t('landing.stats.title').split(' ').slice(0, 3).join(' ')}</span>
            {' '}
            {t('landing.stats.title').split(' ').slice(3).join(' ')}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            justifyContent: 'center',
            mx: -1.5
          }}>
            {statistics.map((stat, index) => (
              <Box 
                key={index} 
                sx={{ 
                  width: { xs: '50%', sm: '50%', md: '25%' },
                  px: 1.5,
                  mb: 3
                }}
              >
                <StatCard 
                  icon={stat.icon} 
                  value={stat.value} 
                  label={stat.label} 
                  color={stat.color}
                />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Box 
        sx={{ 
          py: { xs: 6, sm: 8 }, 
          background: 'linear-gradient(to bottom, #f5f9fc, white)'
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h2" 
            align="center" 
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              fontWeight: 'bold',
              mb: 2,
              color: theme.palette.primary.dark,
              position: 'relative',
              paddingBottom: '15px',
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 800,
              letterSpacing: '0.01em',
              '& .highlight': {
                color: theme.palette.primary.main,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  width: '100%',
                  height: '4px',
                  background: theme.palette.primary.light,
                  opacity: 0.3,
                  borderRadius: '2px',
                }
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '50%',
                width: '80px',
                height: '3px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                transform: 'translateX(-50%)'
              }
            }}
          >
            <span className="highlight">{t('landing.features.title').split(' ').slice(0, 3).join(' ')}</span>
            {' '}
            {t('landing.features.title').split(' ').slice(3).join(' ')}
          </Typography>
          
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ 
              mb: { xs: 4, sm: 6 },
              maxWidth: '750px',
              mx: 'auto',
              color: theme.palette.text.secondary,
              fontFamily: "'Urbanist', sans-serif",
              fontSize: '1.1rem',
              fontWeight: 500
            }}
          >
            {t('landing.features.subtitle')}
          </Typography>
          
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            mx: -1.5
          }}>
            {features.map((feature, index) => (
              <Box 
                key={index} 
                sx={{ 
                  width: { xs: '100%', sm: '50%', lg: '33.333%' },
                  px: 1.5
                }}
              >
                <FeatureCard 
                  icon={feature.icon} 
                  title={feature.title} 
                  description={feature.description}
                  index={index}
                />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Box 
        sx={{ 
          py: { xs: 6, sm: 8 }, 
          background: 'linear-gradient(90deg, rgba(25, 118, 210, 0.9) 0%, rgba(30, 136, 229, 0.9) 100%)',
          color: 'white',
          borderRadius: { xs: '0', sm: '30px 30px 0 0' }
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '2rem' }, 
              fontWeight: 'bold', 
              mb: { xs: 2, sm: 3 },
              color: 'white',
              fontFamily: "'Urbanist', sans-serif",
              textShadow: '0 2px 4px rgba(0,0,0,0.15)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                width: '40px',
                height: '3px',
                background: 'white',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)'
              }
            }}
          >
            <Box component="span" sx={{ 
              fontWeight: 800, 
              background: 'linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)',
              color: theme.palette.primary.dark,
              px: 1.5,
              py: 0.5,
              borderRadius: '4px',
              display: 'inline-block',
              mb: 1
            }}>
              {t('landing.cta.title').split(' ').slice(0, 3).join(' ')}
            </Box>
            <Box component="span" sx={{ 
              fontWeight: 600, 
              color: 'white',
              display: 'inline-block'
            }}>
              {' '}
              {t('landing.cta.title').split(' ').slice(3).join(' ')}
            </Box>
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              mb: { xs: 3, sm: 4 }, 
              fontSize: { xs: '1rem', sm: '1.1rem' },
              color: 'rgba(255,255,255,0.9)',
              maxWidth: '600px',
              mx: 'auto',
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 400,
              letterSpacing: '0.01em',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            <Box component="span" sx={{ 
              fontWeight: 700, 
              color: '#bbdefb', // Couleur bleu clair
              textDecoration: 'underline',
              textDecorationColor: 'rgba(255,255,255,0.3)',
              textDecorationThickness: '2px',
              textUnderlineOffset: '4px'
            }}>
              {t('landing.cta.subtitle').split(' ').slice(0, 4).join(' ')}
            </Box>
            {' '}
            <Box component="span" sx={{ fontWeight: 500, color: 'white' }}>
              {t('landing.cta.subtitle').split(' ').slice(4).join(' ')}
            </Box>
          </Typography>
          
          <Button 
            className="button-glow"
            variant="contained" 
            size="large"
            onClick={handleCreateCV}
            disabled={isLoading}
            sx={{
              bgcolor: 'white',
              color: theme.palette.primary.dark,
              padding: { xs: '10px 20px', sm: '12px 30px' },
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontWeight: 700,
              fontFamily: "'Urbanist', sans-serif",
              borderRadius: '40px',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
              letterSpacing: '0.02em',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
                transform: 'translateY(-3px)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
              }
            }}
            endIcon={isLoading ? null : <ArrowForward />}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('buttons.createCV')
            )}
          </Button>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
} 