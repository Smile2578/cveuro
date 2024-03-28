'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Image from 'next/image';
import Link from 'next/link';

export default function NavBar() {
  const [elevateNav, setElevateNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Set elevateNav to true if page is scrolled down, false if at the top
      setElevateNav(window.scrollY > 0);
    };

    // Add event listener when component mounts
    window.addEventListener('scroll', handleScroll);

    // Remove event listener on cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppBar 
      position="fixed" // Changed to fixed to make it stay at the top
      color="primary" 
      elevation={elevateNav ? 4 : 0} // Apply shadow when scrolled down
      sx={{
        backgroundColor: elevateNav ? 'rgba(255, 255, 255, 0.95)' : 'transparent', // Change background based on elevateNav
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease', // Smooth transition for background and shadow
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Link href="/" passHref>
            <Image src="/logo.png" alt="GEDS Logo" width={130} height={110} priority/>
          </Link>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
