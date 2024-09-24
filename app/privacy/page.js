'use client';
import React from 'react';
import { Typography, Container, Box, Link as MuiLink, List, ListItem, ListItemText } from '@mui/material';
import Link from 'next/link';
import NavBar from '../components/common/NavBar';
import Footer from '../components/common/Footer';
import theme from '../theme';

const PPDPage = () => {
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
        <Typography paragraph>
          CV Builder by GEDS, un service fourni par GEDS LDA, une entreprise portugaise, s'engage à protéger la vie privée des utilisateurs de notre plateforme. Cette politique de protection des données explique comment nous collectons, utilisons, partageons et protégeons vos informations personnelles.
        </Typography>

        <Typography variant="h6" gutterBottom>
          2. Collecte des données
        </Typography>
        <Typography paragraph>
          Nous collectons les informations que vous nous fournissez directement lorsque vous utilisez notre service, notamment :
          <List>
          <ListItem><ListItemText primary="- Informations d'identification (nom, prénom, date de naissance)" /></ListItem>
          <ListItem><ListItemText primary="- Coordonnées (adresse e-mail, numéro de téléphone, adresse postale)" /></ListItem>
          <ListItem><ListItemText primary="- Informations professionnelles (expériences, formations, compétences)" /></ListItem>
          <ListItem><ListItemText primary="- Toute autre information que vous choisissez d'inclure dans votre CV" /></ListItem>
        </List>
        </Typography>

        <Typography variant="h6" gutterBottom>
          3. Utilisation des données
        </Typography>
        <Typography paragraph>
          Nous utilisons vos données personnelles pour :
          <List>
          <ListItem><ListItemText primary="- Fournir et améliorer notre service de création de CV" /></ListItem>
          <ListItem><ListItemText primary="- Personnaliser votre expérience utilisateur" /></ListItem>
          <ListItem><ListItemText primary="- Communiquer avec vous concernant votre compte ou nos services" /></ListItem>
          <ListItem><ListItemText primary="- Respecter nos obligations légales" /></ListItem>
        </List>
        </Typography>

        <Typography variant="h6" gutterBottom>
          4. Partage des données
        </Typography>
        <Typography paragraph>
          Nous ne vendons pas vos données personnelles. Nous pouvons partager vos informations dans les situations suivantes :
          <List>
          <ListItem><ListItemText primary="- Avec votre consentement explicite" /></ListItem>
          <ListItem><ListItemText primary="- Pour respecter une obligation légale" /></ListItem>
          <ListItem><ListItemText primary="- Avec nos prestataires de services qui nous aident à fournir notre service" /></ListItem>
        </List>
        </Typography>

        <Typography variant="h6" gutterBottom>
          5. Protection des données
        </Typography>
        <Typography paragraph>
          Nous mettons en place des mesures de sécurité appropriées pour protéger vos données contre l'accès non autorisé, la modification, la divulgation ou la destruction.
        </Typography>

        <Typography variant="h6" gutterBottom>
          6. Vos droits
        </Typography>
        <Typography paragraph>
          Conformément au Règlement Général sur la Protection des Données (RGPD), vous avez le droit :
          <List>
          <ListItem><ListItemText primary="- D'accéder à vos données personnelles" /></ListItem>
          <ListItem><ListItemText primary="- De rectifier vos données personnelles" /></ListItem>
          <ListItem><ListItemText primary="- D'effacer vos données personnelles" /></ListItem>
          <ListItem><ListItemText primary="- De limiter le traitement de vos données personnelles" /></ListItem>
          <ListItem><ListItemText primary="- De vous opposer au traitement de vos données personnelles" /></ListItem>
          <ListItem><ListItemText primary="- À la portabilité de vos données" /></ListItem>
        </List>
        </Typography>

        <Typography variant="h6" gutterBottom>
          7. Conservation des données
        </Typography>
        <Typography paragraph>
          Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir notre service et respecter nos obligations légales. Vous pouvez demander la suppression de vos données à tout moment.
        </Typography>

        <Typography variant="h6" gutterBottom>
          8. Modifications de la politique
        </Typography>
        <Typography paragraph>
          Nous pouvons modifier cette politique de temps à autre. Nous vous informerons de tout changement important par e-mail ou par une notification sur notre site.
        </Typography>

        <Typography variant="h6" gutterBottom>
          9. Contact
        </Typography>
        <Typography paragraph>
          Pour toute question concernant cette politique ou pour exercer vos droits, veuillez nous contacter à :
          <br />
          GEDS LDA
          <br />
          [Adresse de l'entreprise]
          <br />
          E-mail : contact@geds.fr
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

export default PPDPage;