'use client';
import Link from 'next/link';
import { Button, Box, Typography, Container, Grid, Card, CardContent, useTheme } from '@mui/material';
import { School, Work, Language, Person, SportsEsports } from '@mui/icons-material';
import { motion } from 'framer-motion';
import NavBar from './components/common/NavBar';
import Footer from './components/common/Footer';
import theme from './theme';

export default function LandingPage() {
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

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: theme.palette.background.default,
    }}>
      <NavBar />
      <Container component="main" maxWidth="lg" sx={{ pt: '64px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, marginTop: 10 }}>
        <Typography variant="h3" sx={{ color: theme.palette.primary.dark}}  component="h1" gutterBottom align="center">
          Créez et gérez votre CV professionnel en ligne
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, textAlign: 'center', color: theme.palette.primary.main }}>
          Découvrez un outil intuitif pour construire étape par étape un CV convaincant et professionnel.
        </Typography>
        <Typography sx={{ mt: 2, textAlign: 'center', color: theme.palette.primary.dark }}>
          Commencez par entrer vos informations, modifiez-les en temps réel, et laissez notre système générer automatiquement votre CV en plusieurs langues, grâce à l'intégration de ChatGPT d'OpenAI.
        </Typography>
        <Grid container spacing={4} justifyContent="center" marginTop={5}> 
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div variants={cardVariants} initial="offscreen" whileInView="onscreen" viewport={{ once: true }}>
              <Card sx={{ maxWidth: 345, minHeight: 300 }}>
                <CardContent>
                  <Person sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                  <Typography gutterBottom variant="h5" component="div">
                    Étape 1 : Informations personnelles
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Commencez par saisir vos informations personnelles pour initier la création de votre CV.
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div variants={cardVariants} initial="offscreen" whileInView="onscreen" viewport={{ once: true }}>
              <Card sx={{ maxWidth: 345, minHeight: 300 }}>
                <CardContent>
                  <School sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                  <Typography gutterBottom variant="h5" component="div">
                    Étape 2 : Formation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ajoutez votre parcours éducatif pour mettre en avant vos qualifications.
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div variants={cardVariants} initial="offscreen" whileInView="onscreen" viewport={{ once: true }}>
              <Card sx={{ maxWidth: 345, minHeight: 300 }}>
                <CardContent>
                  <Work sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                  <Typography gutterBottom variant="h5" component="div">
                    Étape 3 : Expérience professionnelle
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Détaillez votre expérience professionnelle pour souligner votre expertise.
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div variants={cardVariants} initial="offscreen" whileInView="onscreen" viewport={{ once: true }}>
              <Card sx={{ maxWidth: 345, minHeight: 300 }}>
                <CardContent>
                  <Language sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                  <Typography gutterBottom variant="h5" component="div">
                    Étape 4 : Langues, Compétences, Loisirs
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Complétez votre profil avec des compétences, des langues parlées et vos loisirs pour un CV plus personnel et détaillé.
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
        <Box sx={{ mt: 8 }}>
          <Link href="/cvgen" passHref>
            <Button variant="outlined" size="large" color="primary">
              Commencer la création de votre CV
            </Button>
          </Link>
        </Box>

        <Box sx={{
          display: 'flex',
          marginTop: 8,
          alignItems: 'center'
        }}>
        
        <Typography variant="body2" sx={{ color: theme.palette.primary.main}} >Powered by </Typography>
        <img src="/chatgpt.svg" alt="ChatGPT logo" style={{ width: 100, marginLeft: 8 }} />
      </Box>
      </Container>
      
      <Footer />
    </Box>
  );
}
