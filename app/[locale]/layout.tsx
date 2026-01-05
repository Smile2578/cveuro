// app/[locale]/layout.tsx

import { Urbanist, Playfair_Display } from 'next/font/google';
import '../globals.css';
import { Analytics } from '@vercel/analytics/react';
import ClientLayout from './ClientLayout';
import { getSettings } from '../i18n/settings';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const urbanist = Urbanist({ 
  subsets: ['latin'],
  variable: '--font-urbanist',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
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

type Messages = {
  common: Record<string, unknown>;
  cvform: Record<string, unknown>;
  validation: Record<string, unknown>;
  welcome: Record<string, unknown>;
  cvedit: Record<string, unknown>;
  auth: Record<string, unknown>;
};

async function getMessages(locale: string): Promise<Messages | null> {
  try {
    const messages: Messages = {
      common: (await import(`../../public/locales/${locale}/common.json`)).default,
      cvform: (await import(`../../public/locales/${locale}/cvform.json`)).default,
      validation: (await import(`../../public/locales/${locale}/validation.json`)).default,
      welcome: (await import(`../../public/locales/${locale}/welcome.json`)).default,
      cvedit: (await import(`../../public/locales/${locale}/cvedit.json`)).default,
      auth: (await import(`../../public/locales/${locale}/auth.json`)).default
    };
    return messages;
  } catch (error) {
    console.error('Failed to load messages:', error);
    return null;
  }
}

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const settings = getSettings();

  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`${urbanist.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <ClientLayout messages={messages!} locale={locale} settings={settings}>
          {children}
          <Analytics />
        </ClientLayout>
      </body>
    </html>
  );
}

