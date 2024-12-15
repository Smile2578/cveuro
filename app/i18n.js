import { getRequestConfig } from 'next-intl/server';
import { getSettings } from './i18n/settings';

export default getRequestConfig(async ({ locale }) => {
  const messages = {
    common: (await import(`../public/locales/${locale}/common.json`)).default,
    cvform: (await import(`../public/locales/${locale}/cvform.json`)).default,
    validation: (await import(`../public/locales/${locale}/validation.json`)).default,
    welcome: (await import(`../public/locales/${locale}/welcome.json`)).default
  };
  
  const settings = getSettings();
  
  return {
    messages,
    defaultLocale: 'en',
    timeZone: settings.timeZone,
    now: settings.now,
    formats: settings.formats
  };
}); 