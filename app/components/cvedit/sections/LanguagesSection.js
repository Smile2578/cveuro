"use client";
import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Stack,
  Chip,
  Divider
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import SectionTitle from '../common/SectionTitle';

const LanguagesSection = ({ languages, onEdit, t }) => {
  if (!languages?.length) return null;

  const getProficiencyColor = (level) => {
    switch (level) {
      case 'Native':
      case 'C2': return 'error';
      case 'C1': return 'warning';
      case 'B2': return 'info';
      default: return 'default';
    }
  };

  return (
    <Paper elevation={1} sx={{ mb: 4, p: 3 }}>
      <SectionTitle 
        icon={LanguageIcon} 
        title={t('sections.languages')} 
        onEdit={() => onEdit('languages')}
      />
      <Stack spacing={2}>
        {languages.map((lang, index) => (
          <Box key={index}>
            <Chip
              label={lang.language}
              color={getProficiencyColor(lang.proficiency)}
              variant="outlined"
              size="small"
              sx={{ mb: 1 }}
            />
            <Typography variant="body2">
              {t(`languages.levels.${lang.proficiency}`)}
            </Typography>
            {lang.testName && (
              <Typography variant="body2" color="text.secondary">
                {lang.testName}: {lang.testScore}
              </Typography>
            )}
            {index < languages.length - 1 && (
              <Divider sx={{ mt: 1 }} />
            )}
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

export default LanguagesSection; 