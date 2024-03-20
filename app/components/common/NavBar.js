'use client';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Link from 'next/link';

export default function NavBar() {
  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Link href="/" passHref>
            
              <Image src="/logo.png" alt="GEDS Logo" width={130} height={110} />
            
          </Link>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
