// app/components/cvgen/welcome/WelcomeDialog.js

'use client';

import React, { memo } from 'react';
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

const WelcomeTitle = memo(({ title }) => (
  <Typography 
    variant="h1" 
    id="welcome-title"
    sx={{ 
      fontSize: { xs: '1.75rem', sm: '2rem' },
      textAlign: 'center',
      fontWeight: 600,
      height: 'auto',
      minHeight: { xs: '2.5rem', sm: '3rem' },
      mb: { xs: 2, sm: 4 },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: 1.3,
      letterSpacing: '-0.02em',
      textRendering: 'optimizeLegibility',
      WebkitFontSmoothing: 'antialiased'
    }}
  >
    {title}
  </Typography>
));

WelcomeTitle.displayName = 'WelcomeTitle';

const SectionItem = memo(({ section, t }) => (
  <Box 
    key={section.key} 
    component="article"
    sx={{ 
      bgcolor: 'background.paper',
      borderRadius: 2,
      p: { xs: 1.5, sm: 2 },
      minHeight: { xs: section.items?.length ? '100px' : '70px', sm: section.items?.length ? '120px' : '80px' }
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box 
        component="span" 
        role="img" 
        aria-hidden="true"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: { xs: 32, sm: 40 },
          height: { xs: 32, sm: 40 },
          '& > svg': {
            fontSize: { xs: 24, sm: 32 }
          }
        }}
      >
        {section.icon}
      </Box>
      <Stack spacing={0.5} flex={1}>
        <Typography
          variant="h2"
          sx={{ 
            fontSize: { xs: '1rem', sm: '1.25rem' },
            fontWeight: 600,
            lineHeight: 1.3
          }}
        >
          {t(`steps.${section.key}.title`)}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          component="p"
          sx={{ 
            fontSize: { xs: '0.875rem', sm: '1rem' },
            lineHeight: 1.4
          }}
        >
          {t(`steps.${section.key}.description`)}
        </Typography>

        {section.items?.length > 0 && (
          <Box component="ul" sx={{ pl: 0, mt: 1, listStyle: 'none' }}>
            {section.items.map((item) => (
              <Box 
                component="li" 
                key={item}
                sx={{ 
                  position: 'relative',
                  pl: 3,
                  mb: 0.5,
                  '&::before': {
                    content: '"•"',
                    position: 'absolute',
                    left: '8px',
                    color: 'text.secondary'
                  }
                }}
              >
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  component="span"
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
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
            sx={{ pl: 1, mt: 1 }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Box 
                component="span" 
                role="img" 
                aria-hidden="true"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 24,
                  height: 24,
                  '& > svg': {
                    fontSize: 20
                  }
                }}
              >
                {subsection.icon}
              </Box>
              <Typography 
                variant="h3" 
                color="primary" 
                sx={{ 
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontWeight: 600
                }}
              >
                {t(`steps.${section.key}.${subsection.key}.title`)}
              </Typography>
            </Stack>
            <Box component="ul" sx={{ pl: 3, mt: 0.5, listStyle: 'none' }}>
              {subsection.items?.map((item) => (
                <Box 
                  component="li" 
                  key={item}
                  sx={{ 
                    position: 'relative',
                    pl: 3,
                    mb: 0.5,
                    '&::before': {
                      content: '"•"',
                      position: 'absolute',
                      left: '8px',
                      color: 'text.secondary'
                    }
                  }}
                >
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    component="span"
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
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
));

SectionItem.displayName = 'SectionItem';

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
        p: { xs: 1.5, sm: 3 }, 
        borderRadius: '16px',
        maxWidth: '100%',
        mx: 'auto',
        height: { xs: 'calc(100vh - 32px)', sm: '80vh' },
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <WelcomeTitle title={t('title')} />

      <Box 
        sx={{ 
          flex: 1,
          overflowY: 'auto',
          px: { xs: 0.5, sm: 0 }
        }}
      >
        <Stack spacing={{ xs: 1.5, sm: 3 }}>
          {sections.map((section) => (
            <SectionItem 
              key={section.key}
              section={section}
              t={t}
            />
          ))}
        </Stack>
      </Box>

      <Box 
        component="footer"
        sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          position: 'sticky',
          bottom: 0,
          pt: 2,
          pb: 1,
          mt: 2,
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
            minWidth: { xs: 160, sm: 200 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: '1rem', sm: '1.1rem' }
          }}
        >
          {t('startButton')}
        </Button>
      </Box>
    </Paper>
  );
};

export default WelcomeGuide;