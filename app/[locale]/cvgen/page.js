// app/[locale]/cvgen/page.js
import CVGenPageClient from './CVGenPageClient';

export default async function CVGenPage({ params: { locale } }) {
  const messages = {
    welcome: (await import(`../../../public/locales/${locale}/welcome.json`)).default,
    common: (await import(`../../../public/locales/${locale}/common.json`)).default,
    cvform: (await import(`../../../public/locales/${locale}/cvform.json`)).default,
    validation: (await import(`../../../public/locales/${locale}/validation.json`)).default
  };
  
  return (
    <CVGenPageClient locale={locale} messages={messages} />
  );
} 