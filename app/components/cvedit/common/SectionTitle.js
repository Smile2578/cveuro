"use client";
import React from 'react';
import { Box, Typography, IconButton, Tooltip, useTheme } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useTranslations } from 'next-intl';

const SectionTitle = ({ icon: Icon, title, onEdit }) => {
  const theme = useTheme();
  const t = useTranslations('cvedit');

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mb: 2,
      backgroundColor: theme.palette.grey[100],
      p: 1,
      borderRadius: 1
    }}>
      {Icon && React.createElement(Icon, { sx: { color: theme.palette.primary.main, mr: 1 } })}
      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Box sx={{ flex: 1 }} />
      {onEdit && (
        <Tooltip title={t('common.edit')}>
          <IconButton size="small" onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default SectionTitle; 