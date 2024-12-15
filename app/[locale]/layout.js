// app/[locale]/layout.js

import { Inter } from "next/font/google";
import "../globals.css";
import { Analytics } from "@vercel/analytics/react";
import ClientLayout from './ClientLayout';
import { getSettings } from '../i18n/settings';

const inter = Inter({ subsets: ["latin"] });

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
    <html lang={locale} className={inter.className}>
      <body style={{ margin: 0, minHeight: '100vh' }}>
        <ClientLayout messages={messages} locale={locale} settings={settings}>
          {children}
          <Analytics />
        </ClientLayout>
      </body>
    </html>
  );
} 