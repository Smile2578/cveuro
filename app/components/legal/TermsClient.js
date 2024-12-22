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
          Conditions Générales d’Utilisation
        </Typography>

        <Typography variant="body2" sx={{ mb: 4 }}>
          Date de dernière mise à jour : 01/10/2024
        </Typography>

        <Typography variant="h6" gutterBottom>
          1. Objet
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Les présentes Conditions Générales d’Utilisation (ci-après « CGU ») ont pour objet de définir
          les conditions dans lesquelles GEDS LDA (ci-après « Nous ») met à disposition des utilisateurs
          (ci-après « Vous ») un service en ligne permettant la création, l’édition, la personnalisation, 
          et la génération de CV au format PDF (ci-après « le Service »). L’utilisation du Service implique 
          l’acceptation pleine et entière des présentes CGU.
        </Typography>

        <Typography variant="h6" gutterBottom>
          2. Description du Service
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Le Service propose :
          <ul>
            <li>La création, l’édition et la mise en forme d’un CV unique par utilisateur, 
            à partir des données que Vous fournissez manuellement.</li>
            <li>La possibilité de télécharger le CV au format PDF.</li>
            <li>Le Service est accessible sans obligation de souscription ni authentification, 
            mais Vous devez accepter les CGU et la Politique de Protection des Données avant de commencer 
            la création d’un CV.</li>
          </ul>
        </Typography>

        <Typography variant="h6" gutterBottom>
          3. Accès au Service
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Le Service est accessible depuis l’Union européenne. Nous ne garantissons pas un accès 
          ininterrompu ou sans erreur. Nous pouvons suspendre, restreindre ou modifier le Service à tout moment, 
          sans obligation de notification préalable, notamment pour des raisons techniques, légales ou de maintenance.
        </Typography>

        <Typography variant="h6" gutterBottom>
          4. Responsabilités de l’Utilisateur
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Vous êtes seul responsable du contenu que Vous saisissez dans le Service. Vous vous engagez à :
          <ul>
            <li>Ne fournir que des informations exactes, pertinentes et licites.</li>
            <li>Respecter les droits des tiers, notamment en matière de propriété intellectuelle.</li>
            <li>Ne pas introduire de contenus illicites, diffamatoires, discriminatoires, obscènes, trompeurs, 
            ou portant atteinte à la vie privée d’autrui.</li>
          </ul>
        </Typography>

        <Typography variant="h6" gutterBottom>
          5. Limitation de Responsabilité de GEDS LDA
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Nous mettons en œuvre les moyens raisonnables pour assurer le bon fonctionnement du Service, 
          mais Nous ne garantissons pas l’adéquation du Service à un besoin particulier, ni l’absence de bugs ou d’erreurs. 
          Nous ne pouvons être tenus responsables des dommages directs, indirects, ou immatériels résultant de l’utilisation 
          ou de l’impossibilité d’utiliser le Service, y compris en cas de perte de données ou d’interruption du Service.
        </Typography>

        <Typography variant="h6" gutterBottom>
          6. Propriété Intellectuelle
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          La structure, la mise en page, les modèles de CV, les éléments graphiques, ainsi que l’ensemble des contenus 
          et éléments de propriété intellectuelle du Service (hors contenus fournis par Vous) restent la propriété exclusive 
          de GEDS LDA. Vous conservez la propriété intellectuelle des données que Vous saisissez. En utilisant le Service, 
          Vous bénéficiez d’une licence non-exclusive et personnelle pour la génération de votre CV. Toute reproduction, 
          modification, distribution ou exploitation non autorisée des contenus du Service est interdite.
        </Typography>

        <Typography variant="h6" gutterBottom>
          7. Données Personnelles
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          L’utilisation du Service implique la collecte, le traitement et la conservation de certaines données personnelles, 
          définies dans la Politique de Protection des Données (PPD). Les conditions du traitement de ces données sont 
          définies dans la PPD, qui fait partie intégrante des présentes CGU. En utilisant le Service, Vous reconnaissez 
          avoir pris connaissance de la PPD et l’accepter.
        </Typography>

        <Typography variant="h6" gutterBottom>
          8. Modifications des CGU
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Nous nous réservons le droit de modifier à tout moment les présentes CGU. La version en vigueur est 
          celle publiée sur le site à la date de Votre utilisation. Il Vous appartient de consulter régulièrement les CGU. 
          L’utilisation du Service après modification vaut acceptation des nouvelles conditions.
        </Typography>

        <Typography variant="h6" gutterBottom>
          9. Juridiction et Droit Applicable
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Les présentes CGU sont régies par le droit de l’Union européenne et, le cas échéant, par le droit portugais. 
          En cas de litige, les tribunaux compétents seront ceux du ressort de l’entreprise GEDS LDA.
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

export default TermsClient;
