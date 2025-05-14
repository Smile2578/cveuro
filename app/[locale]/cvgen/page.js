// app/[locale]/cvgen/page.js
import CVGenPageClient from './CVGenPageClient';
import { setRequestLocale } from 'next-intl/server';

export const metadata = {
  title: 'Créer votre CV - CV Builder',
  description: 'Créez votre CV professionnel en quelques étapes simples'
};

export default async function CVGenPage({ params: { locale } }) {
  setRequestLocale(locale);

  const messages = {
    welcome: (await import(`../../../public/locales/${locale}/welcome.json`)).default,
    common: (await import(`../../../public/locales/${locale}/common.json`)).default,
    cvform: (await import(`../../../public/locales/${locale}/cvform.json`)).default,
    validation: (await import(`../../../public/locales/${locale}/validation.json`)).default
  };
  
  return <CVGenPageClient locale={locale} messages={messages} />;
}

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }];
} 