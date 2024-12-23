// app/[locale]/layout.js

import { Inter } from "next/font/google";
import "../globals.css";
import { Analytics } from "@vercel/analytics/react";
import ClientLayout from './ClientLayout';
import { getSettings } from '../i18n/settings';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: 'CV Builder - Créateur de CV Professionnel',
    template: '%s | CV Builder'
  },
  description: 'Créez votre CV professionnel facilement et rapidement',
  keywords: 'cv, builder, création cv, curriculum vitae',
  openGraph: {
    title: 'CV Builder - Créateur de CV Professionnel',
    description: 'Créez votre CV professionnel facilement et rapidement',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CV Builder - Créateur de CV Professionnel',
    description: 'Créez votre CV professionnel facilement et rapidement',
    images: ['/og-image.jpg'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CV Builder'
  },
  formatDetection: {
    telephone: false
  }
};

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }];
}

async function getMessages(locale) {
  try {
    const messages = {
      common: (await import(`../../public/locales/${locale}/common.json`)).default,
      cvform: (await import(`../../public/locales/${locale}/cvform.json`)).default,
      validation: (await import(`../../public/locales/${locale}/validation.json`)).default,
      cvedit: (await import(`../../public/locales/${locale}/cvedit.json`)).default
    };
    return messages;
  } catch (error) {
    return null;
  }
}

export default async function LocaleLayout({ children, params: { locale } }) {
  const messages = await getMessages(locale);
  const settings = getSettings();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="application-name" content="CV Builder" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ClientLayout messages={messages} locale={locale} settings={settings}>
          {children}
          <Analytics />
        </ClientLayout>
      </body>
    </html>
  );
} 