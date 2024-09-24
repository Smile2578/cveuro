'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button, Box, Typography, Container, Grid, Card, CardContent, useTheme, useMediaQuery, Fade } from '@mui/material';
import { School, Work, Language, Person, Star, Timeline } from '@mui/icons-material';
import { motion } from 'framer-motion';
import NavBar from './components/common/NavBar';
import Footer from './components/common/Footer';
import theme from './theme';

export default function LandingPage() {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [hoveredCard, setHoveredCard] = useState(null);

  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  const iconVariants = {
    rotate: {
      rotate: 360,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    stop: {
      rotate: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: theme.palette.background.default,
    }}>
      <NavBar />
      <Container component="main" maxWidth="lg" sx={{ 
        pt: { xs: '32px', sm: '64px' }, 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        py: { xs: 4, sm: 8 }, 
        marginTop: { xs: 5, sm: 10 } 
      }}>
        <Fade in={true} timeout={1000}>
          <Typography variant="h2" sx={{ 
            color: theme.palette.primary.dark,
            fontSize: { xs: '2.5rem', sm: '3.5rem' },
            textAlign: 'center',
            fontWeight: 'bold',
            mb: 2
          }} component="h1">
            Votre CV professionnel en quelques clics
          </Typography>
        </Fade>
        <Fade in={true} timeout={1500}>
          <Typography variant="h5" sx={{ 
            mb: 4, 
            textAlign: 'center', 
            color: theme.palette.primary.main,
            fontSize: { xs: '1.1rem', sm: '1.3rem' },
            maxWidth: '800px',
            lineHeight: 1.6
          }}>
            Créez, personnalisez et gérez votre CV en toute simplicité. Notre outil intuitif vous guide à chaque étape pour mettre en valeur vos compétences et expériences.
          </Typography>
        </Fade>

        <Box sx={{ mt: 4, mb: 8, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Link href="/cvgen" passHref>
            <Button 
              variant="contained" 
              size="large" 
              color="primary"
              sx={{
                padding: '15px 30px',
                fontSize: '1.2rem',
                borderRadius: '30px',
                boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
                },
                '&:active': {
                  transform: 'translateY(1px)',
                }
              }}
            >
              Créer mon CV maintenant
            </Button>
          </Link>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {[
            { icon: Person, title: "Informations personnelles", description: "Saisissez vos coordonnées et présentez-vous en quelques mots." },
            { icon: School, title: "Formation", description: "Mettez en avant votre parcours académique et vos diplômes." },
            { icon: Work, title: "Expérience professionnelle", description: "Détaillez vos expériences et réalisations professionnelles." },
            { icon: Language, title: "Compétences linguistiques", description: "Indiquez les langues que vous maîtrisez et votre niveau." },
            { icon: Star, title: "Compétences techniques", description: "Listez vos compétences techniques et professionnelles." },
            { icon: Timeline, title: "Projets et réalisations", description: "Présentez vos projets marquants et vos accomplissements." },
          ].map((step, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
              <motion.div 
                variants={cardVariants} 
                initial="offscreen" 
                whileInView="onscreen" 
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <Card sx={{ 
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease-in-out',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  '&:hover': {
                    boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                  }
                }}>
                  <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                padding: '2rem'
              }}>
                <motion.div
                  variants={iconVariants}
                  animate={hoveredCard === index ? "rotate" : "stop"}
                >
                  <step.icon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                </motion.div>
                <Typography gutterBottom variant="h5" component="div" align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {step.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center">
                  {step.description}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
      </Container>
      <Footer />
    </Box>
  );
}