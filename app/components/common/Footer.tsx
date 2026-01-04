'use client';

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t border-border/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4">
          {/* Brand */}
          <p className="text-lg font-serif font-semibold text-foreground">
            CV Européen par <span className="text-sage">GEDS</span>©
          </p>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {currentYear} GEDS. Tous droits réservés.
          </p>

          {/* Links */}
          <div className="flex items-center gap-4 text-sm">
            <Link 
              href="/privacy" 
              className="text-muted-foreground hover:text-sage transition-colors"
            >
              Politique de confidentialité
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link 
              href="/terms" 
              className="text-muted-foreground hover:text-sage transition-colors"
            >
              Conditions d&apos;utilisation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

