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
    defaultLocale: 'en',
    localeDetection: true,
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