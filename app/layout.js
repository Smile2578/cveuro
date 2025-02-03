import { Inter } from "next/font/google";
import "./globals.css";
import StorageProvider from './components/providers/StorageProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL('https://cveuro.com'),
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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1976d2' },
    { media: '(prefers-color-scheme: dark)', color: '#1976d2' }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={inter.className} suppressHydrationWarning>
      <head>
        <meta name="application-name" content="CV Builder" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <StorageProvider>
          {children}
        </StorageProvider>
      </body>
    </html>
  );
}