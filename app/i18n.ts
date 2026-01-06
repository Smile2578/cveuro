import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './i18n/settings';

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale is a Promise in next-intl 4.x
  let locale = await requestLocale;
  
  // Validate that the incoming locale is valid
  if (!locale || !locales.includes(locale as 'fr' | 'en' | 'it')) {
    locale = defaultLocale;
  }

  const messages = {
    common: (await import(`../public/locales/${locale}/common.json`)).default,
    cvform: (await import(`../public/locales/${locale}/cvform.json`)).default,
    validation: (await import(`../public/locales/${locale}/validation.json`)).default,
    welcome: (await import(`../public/locales/${locale}/welcome.json`)).default,
    cvedit: (await import(`../public/locales/${locale}/cvedit.json`)).default,
    auth: (await import(`../public/locales/${locale}/auth.json`)).default
  };

  return {
    locale,
    messages,
    timeZone: 'Europe/Paris',
    now: new Date(),
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        },
        long: {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        }
      },
      date: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        },
        long: {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }
      },
      time: {
        short: {
          hour: 'numeric',
          minute: 'numeric'
        },
        long: {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZoneName: 'short'
        }
      }
    }
  };
});

