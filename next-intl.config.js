import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./public/locales/${locale}/welcome.json`)).default,
  timeZone: 'Europe/Paris',
})); 