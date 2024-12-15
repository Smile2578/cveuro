// app/i18n/request.js

import { getRequestConfig } from 'next-intl/server';
import { getSettings } from './settings';

export default getRequestConfig(async (context) => {
  const messages = {
    common: (await import(`../../public/locales/${context.locale}/common.json`)).default,
    cvform: (await import(`../../public/locales/${context.locale}/cvform.json`)).default,
    validation: (await import(`../../public/locales/${context.locale}/validation.json`)).default,
    cvedit: (await import(`../../public/locales/${context.locale}/cvedit.json`)).default
  };

  const settings = getSettings();

  return {
    messages,
    timeZone: settings.timeZone,
    now: settings.now,
    formats: settings.formats
  };
}); 