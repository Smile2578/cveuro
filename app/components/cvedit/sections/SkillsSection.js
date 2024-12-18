"use client";
import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Chip
} from '@mui/material';
import { Psychology as SkillIcon } from '@mui/icons-material';
import SectionTitle from '../common/SectionTitle';

const SkillsSection = ({ skills, onEdit, t }) => {
  if (!skills?.length) return null;

  const getSkillColor = (level) => {
    switch (level) {
      case 'expert': return 'error';
      case 'advanced': return 'warning';
      case 'intermediate': return 'info';
      default: return 'default';
    }
  };

  return (
    <Paper elevation={1} sx={{ mb: 4, p: 3 }}>
      <SectionTitle 
        icon={SkillIcon} 
        title={t('sections.skills')} 
        onEdit={() => onEdit('skills')}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {skills.map((skill, index) => (
          <Chip
            key={index}
            label={`${skill.skillName} (${t(`skills.levels.${skill.level}`)})`}
            color={getSkillColor(skill.level)}
            variant="outlined"
            size="small"
            sx={{ p: 1 }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default SkillsSection; 