"use client";
import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Stack,
  Divider
} from '@mui/material';
import { Work as WorkIcon } from '@mui/icons-material';
import SectionTitle from '../common/SectionTitle';

const WorkExperienceSection = ({ workExperience, onEdit, t, formatDate }) => {
  if (!workExperience?.length) return null;

  return (
    <Paper elevation={1} sx={{ mb: 4, p: 3 }}>
      <SectionTitle 
        icon={WorkIcon} 
        title={t('sections.experience')} 
        onEdit={() => onEdit('workExperience')}
      />
      <Stack spacing={3}>
        {workExperience.map((exp, index) => (
          <Box key={index}>
            <Typography variant="subtitle1" fontWeight="bold">
              {exp.position}
            </Typography>
            <Typography variant="body1">{exp.companyName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {exp.location}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(exp.startDate)} - {exp.ongoing ? t('common.ongoing') : formatDate(exp.endDate)}
            </Typography>
            {exp.responsibilities?.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('experience.responsibilities')}:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i}>
                      <Typography variant="body2">{resp}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
            {index < workExperience.length - 1 && (
              <Divider sx={{ mt: 2 }} />
            )}
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

export default WorkExperienceSection; 