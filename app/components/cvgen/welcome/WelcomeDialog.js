// app/components/cvgen/welcome/WelcomeDialog.js

'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Button,
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
      component="main"
      id="main-content"
      role="main"
      aria-labelledby="welcome-title"
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderRadius: '16px',
        maxWidth: '100%',
        mx: 'auto',
        height: { xs: 'auto', sm: '80vh' },
        overflow: 'auto'
      }}
    >
      <Typography 
        variant="h1" 
        id="welcome-title"
        sx={{ 
          mb: 4,
          fontSize: { xs: '1.5rem', sm: '2rem' },
          textAlign: 'center',
          fontWeight: 600,
          height: 'auto',
          minHeight: { xs: '2rem', sm: '3rem' }
        }}
      >
        {t('title')}
      </Typography>

      <Stack 
        component="section" 
        spacing={3} 
        sx={{ width: '100%', mb: 4 }}
      >
        {sections.map((section) => (
          <Box 
            key={section.key} 
            component="article"
            sx={{ 
              bgcolor: 'background.paper',
              borderRadius: 2,
              p: 2,
              minHeight: section.items?.length ? '120px' : '80px'
            }}
          >
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Box component="span" role="img" aria-hidden="true">
                {section.icon}
              </Box>
              <Stack spacing={1} flex={1}>
                <Typography
                  variant="h2"
                  sx={{ 
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    minHeight: '1.5rem'
                  }}
                >
                  {t(`steps.${section.key}.title`)}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  component="p"
                  sx={{ minHeight: '3rem' }}
                >
                  {t(`steps.${section.key}.description`)}
                </Typography>

                {section.items?.length > 0 && (
                  <Box component="ul" sx={{ pl: 2, mt: 1, listStyle: 'none' }}>
                    {section.items.map((item) => (
                      <Box 
                        component="li" 
                        key={item}
                        sx={{ 
                          '&::before': {
                            content: '"•"',
                            display: 'inline-block',
                            width: '1em',
                            marginLeft: '-1em'
                          }
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          component="span"
                        >
                          {t(`steps.${section.key}.${item}`)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {section.subsections?.map((subsection) => (
                  <Box 
                    key={subsection.key} 
                    component="section"
                    sx={{ pl: 2, mt: 1 }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box component="span" role="img" aria-hidden="true">
                        {subsection.icon}
                      </Box>
                      <Typography variant="h3" color="primary" sx={{ fontSize: '1rem' }}>
                        {t(`steps.${section.key}.${subsection.key}.title`)}
                      </Typography>
                    </Stack>
                    <Box component="ul" sx={{ pl: 4, mt: 0.5, listStyle: 'none' }}>
                      {subsection.items?.map((item) => (
                        <Box 
                          component="li" 
                          key={item}
                          sx={{ 
                            '&::before': {
                              content: '"•"',
                              display: 'inline-block',
                              width: '1em',
                              marginLeft: '-1em'
                            }
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            component="span"
                          >
                            {t(`steps.${section.key}.${subsection.key}.${item}`)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>

      <Box 
        component="footer"
        sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          position: 'sticky',
          bottom: 0,
          pt: 2,
          pb: 1,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Button 
          variant="contained" 
          color="primary"
          onClick={onClose}
          aria-label={t('startButton')}
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