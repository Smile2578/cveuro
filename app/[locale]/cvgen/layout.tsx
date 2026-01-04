import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Générateur de CV',
  description: 'Générez votre CV en quelques clics',
};

export default function CVGenLayout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

