"use client";
import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Stack,
  Divider
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';
import SectionTitle from '../common/SectionTitle';

const EducationSection = ({ education, onEdit, t, formatDate, capitalizeFirst }) => {
  if (!education?.length) return null;

  return (
    <Paper elevation={1} sx={{ mb: 4, p: 3 }}>
      <SectionTitle 
        icon={SchoolIcon} 
        title={t('sections.education')} 
        onEdit={() => onEdit('education')}
      />
      <Stack spacing={3}>
        {education.map((edu, index) => (
          <Box key={index}>
            <Typography variant="subtitle1" fontWeight="bold">
              {edu.degree === 'other' ? 
                capitalizeFirst(edu.customDegree) : 
                capitalizeFirst(edu.degree)}
            </Typography>
            <Typography variant="body1">{edu.schoolName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {edu.fieldOfStudy}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(edu.startDate)} - {edu.ongoing ? t('common.ongoing') : formatDate(edu.endDate)}
            </Typography>
            {edu.achievements?.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('education.achievements')}:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {edu.achievements.map((achievement, i) => (
                    <li key={i}>
                      <Typography variant="body2">{achievement}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
            {index < education.length - 1 && (
              <Divider sx={{ mt: 2 }} />
            )}
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

export default EducationSection; 