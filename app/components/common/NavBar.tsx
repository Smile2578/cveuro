'use client';

import { useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import LanguageSelector from './LanguageSelector';
import UserMenu from '../auth/UserMenu';

// External store for scroll state (no useEffect!)
function subscribeToScroll(callback: () => void) {
  window.addEventListener('scroll', callback, { passive: true });
  return () => window.removeEventListener('scroll', callback);
}

function getScrollSnapshot() {
  return typeof window !== 'undefined' ? window.scrollY : 0;
}

function getServerSnapshot() {
  return 0;
}

interface NavBarProps {
  show?: boolean;
  showAuth?: boolean;
}

export default function NavBar({ show = true, showAuth = true }: NavBarProps) {
  const locale = useLocale();
  
  // Use useSyncExternalStore instead of useEffect for scroll
  const scrollY = useSyncExternalStore(
    subscribeToScroll,
    getScrollSnapshot,
    getServerSnapshot
  );
  
  const isElevated = scrollY > 10;

  if (!show) {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isElevated 
          ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border/50" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href={`/${locale}`} 
            className="relative flex items-center hover:opacity-80 transition-opacity"
          >
            <div className="relative w-24 h-16">
              <Image
                src="/logo.png"
                alt="GEDS Logo"
                fill
                sizes="96px"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Right side - User Menu & Language Selector */}
          <div className="flex items-center gap-2 sm:gap-4">
            {showAuth && <UserMenu locale={locale} />}
            <LanguageSelector />
          </div>
        </nav>
      </div>
    </header>
  );
}

