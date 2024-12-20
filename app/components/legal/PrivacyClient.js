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

        <Typography variant="body2" sx={{ mb: 4 }}>
          Date de dernière mise à jour : 01/10/2024
        </Typography>

        <Typography variant="h6" gutterBottom>
          1. Introduction
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          La présente Politique de Protection des Données (ci-après « PPD ») a pour objet de vous informer 
          sur les modalités de collecte, de traitement et de protection des données personnelles que vous 
          fournissez dans le cadre de l’utilisation du service en ligne proposé par GEDS LDA 
          (ci-après « Nous »). Cette PPD fait partie intégrante des Conditions Générales d’Utilisation (CGU).
        </Typography>

        <Typography variant="h6" gutterBottom>
          2. Responsable du Traitement
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Le responsable du traitement de vos données personnelles est GEDS LDA, une entreprise portugaise 
          opérant au sein de l’Union européenne.
        </Typography>

        <Typography variant="h6" gutterBottom>
          3. Données Collectées
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Le service vous permet de créer, d’éditer et de générer un CV unique, sans authentification. 
          Les données personnelles collectées et traitées sont celles que vous fournissez volontairement 
          via les formulaires du site, notamment :
        </Typography>
        <List sx={{ mb: 2 }}>
          <ListItem><ListItemText primary="Informations personnelles : prénom, nom, email, téléphone, date de naissance, sexe, lieu de naissance, nationalité, adresse, ville, code postal, liens (LinkedIn, site personnel)" /></ListItem>
          <ListItem><ListItemText primary="Données de formation : établissement, diplôme, domaine d’études, dates, réalisations" /></ListItem>
          <ListItem><ListItemText primary="Données d’expérience professionnelle : entreprise, poste, localisation, dates, responsabilités" /></ListItem>
          <ListItem><ListItemText primary="Compétences et langues : niveau, test, score" /></ListItem>
          <ListItem><ListItemText primary="Loisirs et hobbies" /></ListItem>
        </List>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Des métadonnées techniques (adresses IP, logs serveurs) et des données analytiques fournies par Vercel 
          (hébergement, outils analytiques) peuvent également être collectées automatiquement afin d’assurer 
          la sécurité, la maintenance et l’amélioration du service.
        </Typography>

        <Typography variant="h6" gutterBottom>
          4. Finalités et Bases Légales du Traitement
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Vos données sont traitées afin de :
          <ul>
            <li>Permettre la création, l’édition et la génération de votre CV (exécution d’un contrat).</li>
            <li>Assurer le bon fonctionnement et l’amélioration continue du service (intérêt légitime).</li>
            <li>Se conformer aux obligations légales et réglementaires, le cas échéant.</li>
          </ul>
          L’utilisation du service et l’acceptation des CGU et de la PPD constituent votre consentement préalable 
          au traitement des données. Dans les autres cas, l’intérêt légitime ou l’exécution d’un contrat 
          sert de base légale.
        </Typography>

        <Typography variant="h6" gutterBottom>
          5. Conservation des Données
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Vos données sont conservées aussi longtemps que nécessaire pour fournir le service et aux fins décrites. 
          Nous nous engageons à effacer les données personnelles sur simple demande envoyée à l’adresse 
          email indiquée ci-dessous, ou lorsque ces données ne sont plus pertinentes.
        </Typography>

        <Typography variant="h6" gutterBottom>
          6. Droits de l’Utilisateur
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :
        </Typography>
        <List sx={{ mb: 2 }}>
          <ListItem><ListItemText primary="Droit d’accès : obtenir la confirmation que vos données sont traitées et une copie de ces données" /></ListItem>
          <ListItem><ListItemText primary="Droit de rectification : demander la correction de données inexactes ou incomplètes" /></ListItem>
          <ListItem><ListItemText primary="Droit à l’effacement : demander la suppression de vos données" /></ListItem>
          <ListItem><ListItemText primary="Droit d’opposition : dans certains cas, vous opposer à un traitement spécifique" /></ListItem>
          <ListItem><ListItemText primary="Droit à la limitation : demander la suspension temporaire du traitement dans certains cas" /></ListItem>
        </List>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Pour exercer vos droits, veuillez envoyer un email à 
          <MuiLink href="mailto:candidatures@geds.fr" color="primary"> candidatures@geds.fr</MuiLink>.
        </Typography>

        <Typography variant="h6" gutterBottom>
          7. Sécurité
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Les données sont hébergées dans l’Union européenne (MongoDB sur AWS Paris, intégration Vercel). 
          Nous mettons en place des mesures techniques et organisationnelles raisonnables pour protéger 
          vos données contre toute violation, perte, usage malveillant ou accès non autorisé.
        </Typography>

        <Typography variant="h6" gutterBottom>
          8. Partage de Données et Sous-Traitance
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Vos données ne sont pas vendues à des tiers. Elles peuvent être traitées par nos prestataires techniques 
          (hébergement, analytics Vercel) dans la mesure de leur mission. Ces partenaires sont situés dans l’UE 
          ou disposent de garanties adéquates pour les transferts éventuels de données hors UE.
        </Typography>

        <Typography variant="h6" gutterBottom>
          9. Cookies et Analyses
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Le service peut utiliser des cookies strictement nécessaires à son bon fonctionnement. Des données 
          analytiques sont collectées par Vercel. Vous ne pouvez pas vous opposer à leur collecte à moins 
          de cesser d’utiliser le service, compte tenu de l’absence d’authentification ou d’options 
          de personnalisation de la vie privée.
        </Typography>

        <Typography variant="h6" gutterBottom>
          10. Propriété des Contenus
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Le contenu de votre CV vous appartient. Nous ne prétendons à aucun droit de propriété sur les informations 
          que vous saisissez. Toutefois, la structure, les modèles graphiques et les éléments du service 
          restent notre propriété.
        </Typography>

        <Typography variant="h6" gutterBottom>
          11. Mise à Jour de la PPD
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Nous pouvons modifier la PPD à tout moment. La version en vigueur est celle publiée sur le site 
          au moment de votre utilisation. Il vous appartient de consulter régulièrement la PPD.
        </Typography>

        <Typography variant="h6" gutterBottom>
          12. Contact
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Pour toute question relative à la protection de vos données, 
          vous pouvez écrire à <MuiLink href="mailto:candidatures@geds.fr" color="primary">simon@geds.fr</MuiLink>.
        </Typography>

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
