import './globals.css';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://cveuro.com'),
  title: {
    default: 'CV Builder - Créateur de CV Professionnel',
    template: '%s | CV Builder'
  },
  description: 'Créez votre CV professionnel facilement et rapidement',
  keywords: 'cv, builder, création cv, curriculum vitae',
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4a7c59' },
    { media: '(prefers-color-scheme: dark)', color: '#6ba368' }
  ]
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}

