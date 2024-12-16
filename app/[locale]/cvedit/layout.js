import { Metadata } from 'next';

export const metadata = {
  title: 'Éditeur de CV',
  description: 'Éditez et personnalisez votre CV',
};

export default function CVEditLayout({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}
