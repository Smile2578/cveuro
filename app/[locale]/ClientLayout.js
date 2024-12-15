// app/[locale]/ClientLayout.js

"use client";
import { NextIntlClientProvider } from 'next-intl';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/fr';
import 'dayjs/locale/en';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';

export default function ClientLayout({ children, messages, locale, settings }) {
  return (
    <NextIntlClientProvider 
      locale={locale} 
      messages={messages}
      timeZone={settings.timeZone}
      now={settings.now}
      formats={settings.formats}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider 
          dateAdapter={AdapterDayjs}
          adapterLocale={locale}
          localeText={{
            cancelButtonLabel: locale === 'fr' ? 'Annuler' : 'Cancel',
            okButtonLabel: locale === 'fr' ? 'OK' : 'OK',
            clearButtonLabel: locale === 'fr' ? 'Effacer' : 'Clear',
            todayButtonLabel: locale === 'fr' ? "Aujourd'hui" : 'Today',
          }}
        >
          {children}
        </LocalizationProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
} 