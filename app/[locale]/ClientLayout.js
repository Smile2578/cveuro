// app/[locale]/ClientLayout.js

"use client";
import { memo, useMemo } from 'react';
import { NextIntlClientProvider, useTranslations } from 'next-intl';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider } from '@mui/material/styles';
import { Box, styled } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import { useEffect } from 'react';

const loadLocale = (locale) => {
  switch (locale) {
    case 'fr':
      return import('dayjs/locale/fr');
    case 'en':
      return import('dayjs/locale/en');
    default:
      return import('dayjs/locale/en');
  }
};

const SkipLink = styled('a')(({ theme }) => ({
  position: 'absolute',
  left: '-9999px',
  '&:focus': {
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999,
    padding: '1rem',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    textDecoration: 'none',
    borderRadius: '4px',
    boxShadow: theme.shadows[3]
  }
}));

const MemoizedLocalizationProvider = memo(({ locale, children }) => (
  <LocalizationProvider 
    dateAdapter={AdapterDayjs}
    adapterLocale={locale}
    localeText={useMemo(() => ({
      cancelButtonLabel: locale === 'fr' ? 'Annuler' : 'Cancel',
      okButtonLabel: locale === 'fr' ? 'OK' : 'OK',
      clearButtonLabel: locale === 'fr' ? 'Effacer' : 'Clear',
      todayButtonLabel: locale === 'fr' ? "Aujourd'hui" : 'Today',
    }), [locale])}
  >
    {children}
  </LocalizationProvider>
));

MemoizedLocalizationProvider.displayName = 'MemoizedLocalizationProvider';

const ClientLayoutContent = ({ children }) => {
  const t = useTranslations('common');

  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        '& :focus-visible': {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: '2px',
        }
      }}
    >
      <SkipLink href="#main-content">
        {t('accessibility.skipToContent')}
      </SkipLink>
      {children}
    </Box>
  );
};

export default function ClientLayout({ children, messages, locale, settings }) {
  const memoizedSettings = useMemo(() => ({
    timeZone: settings.timeZone,
    now: settings.now,
    formats: settings.formats
  }), [settings]);

  useEffect(() => {
    loadLocale(locale);
  }, [locale]);

  return (
    <NextIntlClientProvider 
      locale={locale} 
      messages={messages}
      {...memoizedSettings}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <MemoizedLocalizationProvider locale={locale}>
          <ClientLayoutContent>
            {children}
          </ClientLayoutContent>
        </MemoizedLocalizationProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
} 