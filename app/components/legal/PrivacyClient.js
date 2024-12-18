'use client';

import React from 'react';
import { Typography, Container, Box, Link as MuiLink, List, ListItem, ListItemText } from '@mui/material';
import Link from 'next/link';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import theme from '../../theme';

const PrivacyClient = () => {
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: theme.palette.background.default,
    }}>
      <NavBar />
      <Container component="main" maxWidth="md" sx={{ mt: 12, mb: 4 }} className='text-black'>
        <Typography variant="h4" component="h1" gutterBottom>
          Politique de Protection des Données
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          1. Introduction
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          CV Builder by GEDS, un service fourni par GEDS LDA, une entreprise portugaise, s'engage à protéger la vie privée des utilisateurs de notre plateforme.
        </Typography>

        <Typography variant="h6" gutterBottom>
          2. Collecte des Données
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Nous collectons uniquement les données nécessaires à la création et à la gestion de votre CV.
        </Typography>

        <Typography variant="h6" gutterBottom>
          3. Utilisation des Données
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Vos données sont utilisées exclusivement pour personnaliser votre expérience et améliorer nos services.
        </Typography>

        <Typography variant="h6" gutterBottom>
          4. Protection des Données
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations personnelles.
        </Typography>

        <Typography variant="h6" gutterBottom>
          5. Vos Droits
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Droit d'accès à vos données personnelles" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Droit de rectification de vos données" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Droit à l'effacement de vos données" />
          </ListItem>
        </List>

        <Box mt={4}>
          <Typography variant="body2">
            Date de dernière mise à jour : 01/10/2024
          </Typography>
        </Box>

        <Box mt={4}>
          <MuiLink component={Link} href="/" color="primary">
            Retour à l'accueil
          </MuiLink>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default PrivacyClient;