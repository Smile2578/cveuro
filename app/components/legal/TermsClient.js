'use client';

import React from 'react';
import { Typography, Container, Box, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import theme from '../../theme';

const TermsClient = () => {
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
          Conditions Générales d'Utilisation
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          1. Objet
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités et conditions d'utilisation des services proposés sur le site CV Builder par GEDS (ci-après dénommé "le Service"), ainsi que de définir les droits et obligations des parties dans ce cadre.
        </Typography>

        <Typography variant="h6" gutterBottom>
          2. Acceptation des CGU
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          L'utilisation du Service implique l'acceptation pleine et entière des présentes CGU.
        </Typography>

        <Typography variant="h6" gutterBottom>
          3. Description du Service
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          CV Builder by GEDS est un service en ligne permettant aux utilisateurs de créer et gérer leurs CV de manière professionnelle.
        </Typography>

        <Typography variant="h6" gutterBottom>
          4. Responsabilités
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          L'utilisateur est seul responsable du contenu qu'il publie via le Service. GEDS LDA se réserve le droit de supprimer tout contenu inapproprié.
        </Typography>

        <Typography variant="h6" gutterBottom>
          5. Propriété Intellectuelle
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Le Service et son contenu sont la propriété exclusive de GEDS LDA. Toute reproduction non autorisée est interdite.
        </Typography>

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

export default TermsClient;