'use client';
import Link from 'next/link';
import { Button, Box, Typography, Container, Grid } from '@mui/material';
import NavBar from './components/common/NavBar';
import Footer from './components/common/Footer';
import theme from './theme';

export default function LandingPage() {
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between', 
      background: theme.gradient.background,
    }}>
      <NavBar />
      <Container component="main" maxWidth="lg" sx={{ pt: '64px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-around', py: 8 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box>
              
                <Typography variant="h4" component="h1" gutterBottom>
                  Bienvenue sur le générateur de CV
                </Typography>
                <Typography variant="h6" component="p" gutterBottom>
                  GEDS vous propose un outil simple et rapide pour créer votre CV en ligne.
                </Typography>
              
            </Box>
          </Grid>
          <Grid item xs={12} md={6} display="flex" justifyContent="center">
              <Link href="/cvgen" passHref>
                <Button variant="outlined" size="large" sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' }, mt: 2 }}>
                  Créer mon CV
                </Button>
              </Link>
            
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
}