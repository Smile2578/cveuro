'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Button, 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  useMediaQuery 
} from '@mui/material';
import { 
  School, 
  Work, 
  Language, 
  Person, 
  Star, 
  Timeline 
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import NavBar from './components/common/NavBar';
import Footer from './components/common/Footer';
import theme from './theme';

export default function LandingPage() {
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCreateCV = () => {
    router.push('/cvgen');
  };

  const MotionComponent = isClient && !isMobile ? motion.div : 'div';

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const motionProps = !isMobile ? {
    variants: fadeInUpVariants,
    initial: "hidden",
    animate: "visible"
  } : {};

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
          <MotionComponent {...motionProps}>
            <Typography variant="h3" sx={{ 
              color: theme.palette.primary.dark,
              fontSize: { xs: '2rem', sm: '2.5rem' },
              textAlign: 'center',
              fontWeight: 'bold',
              mb: 3,
            }}>
              Créez, personnalisez et gérez votre CV en toute simplicité. 
            </Typography>
          </MotionComponent>
          
          <MotionComponent {...motionProps} transition={{ delay: 0.2 }}>
            <Typography variant="h6" sx={{ 
              mb: 5, 
              textAlign: 'center', 
              color: theme.palette.text.primary,
              fontSize: { xs: '1rem', sm: '1.2rem' },
              maxWidth: '700px',
              lineHeight: 1.6,
              mx: 'auto'
            }}>
              Notre outil intuitif vous guide à chaque étape pour mettre en valeur vos compétences et expériences.
            </Typography>
          </MotionComponent>

          <MotionComponent {...motionProps} transition={{ delay: 0.4 }} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              size="large" 
              color="primary"
              onClick={handleCreateCV}
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
              Créer mon CV maintenant
            </Button>
          </MotionComponent>

          <Grid container spacing={4} justifyContent="center" sx={{ mt: 5 }}>
            {[
              { icon: Person, title: "Informations personnelles", description: "Saisissez vos coordonnées et présentez-vous en quelques mots." },
              { icon: School, title: "Formation", description: "Mettez en avant votre parcours académique et vos diplômes." },
              { icon: Work, title: "Expérience professionnelle", description: "Détaillez vos expériences et réalisations professionnelles." },
              { icon: Language, title: "Compétences linguistiques", description: "Indiquez les langues que vous maîtrisez et votre niveau." },
              { icon: Star, title: "Compétences techniques", description: "Listez vos compétences techniques et professionnelles." },
              { icon: Timeline, title: "Projets et réalisations", description: "Présentez vos projets marquants et vos accomplissements." },
            ].map((step, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MotionComponent 
                  {...motionProps}
                  transition={{ delay: 0.6 + index * 0.1 }}
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
                      <step.icon sx={{ fontSize: 50, color: theme.palette.primary.main, mb: 2 }} />
                      <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {step.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </MotionComponent>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}