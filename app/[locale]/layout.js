import { Inter } from "next/font/google";
import "../globals.css";
import { Analytics } from "@vercel/analytics/react";
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }];
}

async function getMessages(locale) {
  try {
    const messages = {
      common: (await import(`../../public/locales/${locale}/common.json`)).default,
      cvform: (await import(`../../public/locales/${locale}/cvform.json`)).default,
      validation: (await import(`../../public/locales/${locale}/validation.json`)).default
    };
    return messages;
  } catch (error) {
    notFound();
  }
}

export default async function LocaleLayout({ children, params: { locale } }) {
  const messages = await getMessages(locale);

  return (
    <html lang={locale} className={inter.className} style={{ height: '100vh' }}>
      <body style={{ height: '100vh', margin: 0 }}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 