import { getRequestConfig } from 'next-intl/server';
import { locales } from './app/i18n/settings';

export default getRequestConfig(async ({ locale }) => {
  const messages = {
    common: (await import(`./public/locales/${locale}/common.json`)).default,
    cvform: (await import(`./public/locales/${locale}/cvform.json`)).default,
    validation: (await import(`./public/locales/${locale}/validation.json`)).default
  };

  return {
    messages,
    locales,
    defaultLocale: 'fr',
    localeDetection: true
  };
}); 