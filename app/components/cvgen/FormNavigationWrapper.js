"use client";

import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import FormNavigation from './FormNavigation';

const FormNavigationWrapper = ({ children, hideFormNavigation, ...navigationProps }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const navigationComponent = !hideFormNavigation && (
    <Box sx={{ 
      width: '100%',
      mt: { xs: 2, sm: 3 },
      mb: { xs: 2, sm: 3 }
    }}>
      <FormNavigation {...navigationProps} />
    </Box>
  );

  return (
    <Box sx={{ 
      width: '100%',
      mt: { xs: 1, sm: 3 }
    }}>
      {isMobile && navigationComponent}
      {children}
      {!isMobile && navigationComponent}
    </Box>
  );
};

export default FormNavigationWrapper; 