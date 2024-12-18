"use client";
import React from 'react';
import { 
  Box, 
  Paper,
  Chip
} from '@mui/material';
import { SportsEsports as HobbyIcon } from '@mui/icons-material';
import SectionTitle from '../common/SectionTitle';

const HobbiesSection = ({ hobbies, onEdit, t }) => {
  if (!hobbies?.length) return null;

  return (
    <Paper elevation={1} sx={{ mb: 4, p: 3 }}>
      <SectionTitle 
        icon={HobbyIcon} 
        title={t('sections.hobbies')} 
        onEdit={() => onEdit('hobbies')}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {hobbies.map((hobby, index) => (
          <Chip
            key={index}
            label={hobby}
            color="default"
            variant="outlined"
            size="small"
            sx={{ p: 1 }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default HobbiesSection; 