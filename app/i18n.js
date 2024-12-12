import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  const messages = {
    common: (await import(`../public/locales/${locale}/common.json`)).default,
    cvform: (await import(`../public/locales/${locale}/cvform.json`)).default,
    validation: (await import(`../public/locales/${locale}/validation.json`)).default
  };
  
  return {
    messages
  };
}); 