// app/components/cvgen/welcome/WelcomeDialog.js

'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack
} from '@mui/material';
import { useTranslations } from 'next-intl';
import {
  Person,
  School,
  Work,
  Psychology,
  Language,
  SportsEsports
} from '@mui/icons-material';

const sections = [
  {
    key: 'personal',
    icon: <Person />,
    items: ['identity', 'contact', 'address', 'social']
  },
  {
    key: 'education',
    icon: <School />,
    items: []
  },
  {
    key: 'experience',
    icon: <Work />,
    items: []
  },
  {
    key: 'talents',
    icon: <Psychology />,
    subsections: [
      {
        key: 'skills',
        icon: <Psychology />,
        items: ['technical', 'soft', 'other']
      },
      {
        key: 'languages',
        icon: <Language />,
        items: ['native', 'foreign', 'certifications']
      },
      {
        key: 'hobbies',
        icon: <SportsEsports />,
        items: ['interests', 'activities', 'achievements']
      }
    ]
  }
];

const WelcomeGuide = ({ onClose }) => {
  const t = useTranslations('welcome');

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderRadius: '16px',
        maxWidth: '100%',
        mx: 'auto'
      }}
    >
      <Typography 
        variant="h4" 
        component="h1"
        sx={{ 
          mb: 4,
          fontSize: { xs: '1.5rem', sm: '2rem' },
          textAlign: 'center',
          fontWeight: 600
        }}
      >
        {t('title')}
      </Typography>

      <List sx={{ width: '100%' }}>
        {sections.map((section) => (
          <Box key={section.key} sx={{ mb: 3 }}>
            <ListItem 
              sx={{ 
                bgcolor: 'background.paper',
                borderRadius: 2,
                mb: 1
              }}
            >
              <Stack spacing={1} width="100%">
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                >
                  {t(`steps.${section.key}.title`)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t(`steps.${section.key}.description`)}
                </Typography>
              </Stack>
            </ListItem>

            {section.items?.length > 0 && (
              <List dense sx={{ pl: 6 }}>
                {section.items.map((item) => (
                  <ListItem key={item} sx={{ py: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t(`steps.${section.key}.${item}`)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            )}

            {section.subsections?.map((subsection) => (
              <List key={subsection.key} dense sx={{ pl: 6 }}>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {subsection.icon}
                  </ListItemIcon>
                  <Typography variant="subtitle2" color="primary">
                    {t(`steps.${section.key}.${subsection.key}.title`)}
                  </Typography>
                </ListItem>
                {subsection.items?.map((item) => (
                  <ListItem key={item} sx={{ pl: 7, py: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t(`steps.${section.key}.${subsection.key}.${item}`)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            ))}
          </Box>
        ))}
      </List>

      <Box 
        sx={{ 
          mt: 4, 
          display: 'flex', 
          justifyContent: 'center'
        }}
      >
        <Button 
          variant="contained" 
          color="primary"
          onClick={onClose}
          sx={{ 
            minWidth: 200,
            py: 1.5,
            fontSize: '1.1rem'
          }}
        >
          {t('startButton')}
        </Button>
      </Box>
    </Paper>
  );
};

export default WelcomeGuide;