'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Image from 'next/image';
import Link from 'next/link';
import Box from '@mui/material/Box';
import LanguageSelector from './LanguageSelector';

export default function NavBar({ show = true }) {
  const [elevateNav, setElevateNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setElevateNav(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!show) {
    return null;
  }

  return (
    <AppBar 
      position="fixed"
      color="primary" 
      elevation={elevateNav ? 4 : 0}
      sx={{
        backgroundColor: elevateNav ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Link href="/" passHref style={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ position: 'relative', width: 110, height: 100 }}>
              <Image
                src="/logo.png"
                alt="GEDS Logo"
                fill
                sizes="110px"
                style={{ objectFit: 'contain' }}
                priority
              />
            </Box>
          </Link>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LanguageSelector />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}