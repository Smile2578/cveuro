// app/[locale]/ClientLayout.tsx

'use client';

import { memo, useMemo, ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { QueryProvider } from '../providers/QueryProvider';

interface Settings {
  timeZone: string;
  now: Date;
  formats: Record<string, unknown>;
}

interface ClientLayoutProps {
  children: ReactNode;
  messages: Record<string, unknown>;
  locale: string;
  settings: Settings;
}

const SkipLink = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:left-1/2 focus:-translate-x-1/2 focus:z-[9999] focus:p-4 focus:bg-background focus:text-foreground focus:no-underline focus:rounded focus:shadow-lg"
  >
    Skip to main content
  </a>
);

const ClientLayoutContent = memo(({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen m-0 p-0 [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-primary [&_:focus-visible]:outline-offset-2">
      <SkipLink />
      {children}
    </div>
  );
});

ClientLayoutContent.displayName = 'ClientLayoutContent';

export default function ClientLayout({ 
  children, 
  messages, 
  locale, 
  settings 
}: ClientLayoutProps) {
  const memoizedSettings = useMemo(() => ({
    timeZone: settings.timeZone,
    now: settings.now,
    formats: settings.formats
  }), [settings]);

  return (
    <NextIntlClientProvider 
      locale={locale} 
      messages={messages as Record<string, unknown>}
      {...memoizedSettings}
    >
      <QueryProvider>
        <ClientLayoutContent>
          {children}
        </ClientLayoutContent>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}

