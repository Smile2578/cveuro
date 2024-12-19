'use client'
import * as React from 'react';
import { Container, Typography, Box, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'transparent', color: 'grey', py: 2 }}>
      <Container maxWidth="lg">
        <Typography variant="body1" align="center" gutterBottom>
          CV Européen par GEDS©
        </Typography>
        <Typography variant="body2" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' GEDS. Tous droits réservés.'}
        </Typography>
        <Typography variant="body2" align="center">
          <Link color="inherit" href="/privacy">
            PPD
          </Link>
          {' | '}
          <Link color="inherit" href="/terms">
            CGU
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}
