// app/i18n/request.ts

import { getRequestConfig } from 'next-intl/server';
import { getSettings, locales, defaultLocale, type Locale } from './settings';

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale is a Promise in next-intl 4.x
  let locale = await requestLocale;

  // Validate that the incoming locale is valid
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  const messages = {
    common: (await import(`../../public/locales/${locale}/common.json`)).default,
    cvform: (await import(`../../public/locales/${locale}/cvform.json`)).default,
    validation: (await import(`../../public/locales/${locale}/validation.json`)).default,
    welcome: (await import(`../../public/locales/${locale}/welcome.json`)).default,
    cvedit: (await import(`../../public/locales/${locale}/cvedit.json`)).default
  };

  const settings = getSettings();

  return {
    locale,
    messages,
    timeZone: settings.timeZone,
    now: settings.now,
    formats: settings.formats
  };
});

