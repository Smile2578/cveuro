'use client';
import React from 'react';
import { Typography, Container, Box, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import NavBar from '../../components/common/NavBar';
import Footer from '../../components/common/Footer';
import theme from '../../theme';

const CGUPage = () => {
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
        <Typography paragraph>
          Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités et conditions d'utilisation des services proposés sur le site CV Builder par GEDS (ci-après dénommé "le Service"), ainsi que de définir les droits et obligations des parties dans ce cadre.
        </Typography>

        <Typography variant="h6" gutterBottom>
          2. Définition du service
        </Typography>
        <Typography paragraph>
          CV Builder par GEDS est un outil en ligne permettant aux utilisateurs de créer et gérer leur CV professionnel. Le Service offre des fonctionnalités telles que la saisie d'informations personnelles, l'ajout d'expériences professionnelles, de formations, de compétences et de langues.
        </Typography>

        <Typography variant="h6" gutterBottom>
          3. Accès au service
        </Typography>
        <Typography paragraph>
          L'accès au Service est gratuit et ouvert à toute personne physique majeure. L'Utilisateur s'engage à fournir des informations exactes lors de son inscription.
        </Typography>

        <Typography variant="h6" gutterBottom>
          4. Propriété intellectuelle
        </Typography>
        <Typography paragraph>
          Le contenu du site (textes, images, logos) est protégé par le droit d'auteur. Toute reproduction ou représentation, totale ou partielle, du site ou de l'un de ses éléments, sans l'autorisation expresse de [Nom de votre entreprise], est interdite et constituerait une contrefaçon sanctionnée par le Code de la propriété intellectuelle.
        </Typography>

        <Typography variant="h6" gutterBottom>
          5. Protection des données personnelles
        </Typography>
        <Typography paragraph>
          Les informations recueillies font l'objet d'un traitement informatique destiné à la création et la gestion de CV. Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous bénéficiez d'un droit d'accès, de rectification, et d'opposition aux informations qui vous concernent.
        </Typography>

        <Typography variant="h6" gutterBottom>
          6. Responsabilités
        </Typography>
        <Typography paragraph>
          L'utilisateur est seul responsable du contenu qu'il publie sur le Service. GEDS LDA. ne peut être tenue responsable du contenu publié par les utilisateurs et se réserve le droit de supprimer tout contenu illégal ou contraire aux bonnes mœurs.
        </Typography>

        <Typography variant="h6" gutterBottom>
          7. Modification des CGU
        </Typography>
        <Typography paragraph>
          GEDS LDA. se réserve le droit de modifier les CGU à tout moment. Les utilisateurs seront informés des modifications par une mention sur le site.
        </Typography>

        <Typography variant="h6" gutterBottom>
          8. Droit applicable et juridiction compétente
        </Typography>
        <Typography paragraph>
          Les présentes CGU sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.
        </Typography>

        <Typography variant="h6" gutterBottom>
          9. Contact
        </Typography>
        <Typography paragraph>
          Pour toute question relative à ces CGU, vous pouvez nous contacter à l'adresse suivante : contact@geds.fr
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

export default CGUPage;