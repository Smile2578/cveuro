import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Éditeur de CV',
  description: 'Éditez et personnalisez votre CV',
};

export default function CVEditLayout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

