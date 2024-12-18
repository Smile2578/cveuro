"use client";
import React from 'react';
import { useTranslations } from 'next-intl';
import { 
  Box, 
  Typography, 
  Paper,
  Stack,
  Chip
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import SectionTitle from '../common/SectionTitle';

const PersonalInfoSection = ({ data, onEdit }) => {
  const t = useTranslations('cvedit');

  if (!data) return null;

  return (
    <Paper elevation={1} sx={{ mb: 4, p: 3 }}>
      <SectionTitle 
        icon={PersonIcon} 
        title={t('sections.personalInfo')} 
        onEdit={onEdit}
      />
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ minWidth: '200px', flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('personalInfo.name')}
            </Typography>
            <Typography variant="body1">
              {data.firstname} {data.lastname}
            </Typography>
          </Box>
          <Box sx={{ minWidth: '200px', flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('personalInfo.contact')}
            </Typography>
            <Typography variant="body1">
              {data.email} • {data.phoneNumber}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ minWidth: '200px', flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('personalInfo.address')}
            </Typography>
            <Typography variant="body1">
              {data.address}, {data.city} {data.zip}
            </Typography>
          </Box>
          <Box sx={{ minWidth: '200px', flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('personalInfo.dateofBirth')}
            </Typography>
            <Typography variant="body1">
              {data.dateofBirth}
            </Typography>
          </Box>
        </Box>
        {data.nationality?.length > 0 && (
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t('personalInfo.nationality')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {data.nationality.map((nat, index) => (
                <Chip
                  key={index}
                  label={nat.label}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}
        {data.linkedIn && (
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('personalInfo.linkedIn')}
            </Typography>
            <Typography variant="body1">
              <a href={data.linkedIn} target="_blank" rel="noopener noreferrer">
                {data.linkedIn}
              </a>
            </Typography>
          </Box>
        )}
        {data.personalWebsite && (
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('personalInfo.personalWebsite')}
            </Typography>
            <Typography variant="body1">
              <a href={data.personalWebsite} target="_blank" rel="noopener noreferrer">
                {data.personalWebsite}
              </a>
            </Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default PersonalInfoSection; 