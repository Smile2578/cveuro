'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { User, LogOut, Settings, ChevronDown, LogIn, FileText, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createClient } from '@/lib/supabase/client';
import { logout } from '@/app/actions/auth';
import { type User as SupabaseUser } from '@supabase/supabase-js';

interface UserMenuProps {
  locale: string;
}

export default function UserMenu({ locale }: UserMenuProps) {
  const t = useTranslations('common');
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
    );
  }

  // Check if user is anonymous (guest) or not logged in
  const isAnonymous = user?.is_anonymous ?? false;
  const isAuthenticated = user && !isAnonymous;

  // Not logged in OR anonymous user - Show engaging CTA
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        {/* Mobile: just icon */}
        <Link href={`/${locale}/login`} className="sm:hidden">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-600 hover:text-geds-blue px-2"
          >
            <LogIn className="w-5 h-5" />
          </Button>
        </Link>
        
        {/* Desktop: engaging CTA */}
        <Link href={`/${locale}/register`} className="hidden sm:block">
          <Button 
            size="sm"
            className="bg-gradient-to-r from-geds-blue to-geds-cyan text-white hover:shadow-lg hover:shadow-geds-blue/25 transition-all gap-2"
          >
            <User className="w-4 h-4" />
            {t('navigation.register')}
          </Button>
        </Link>
        
        {/* Desktop: subtle login link */}
        <Link 
          href={`/${locale}/login`} 
          className="hidden sm:inline-flex text-sm text-gray-500 hover:text-geds-blue transition-colors"
        >
          {t('navigation.login')}
        </Link>
      </div>
    );
  }

  // Logged in (permanent user, not anonymous)
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="gap-2 px-2 sm:px-3 hover:bg-gray-100"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-geds-blue to-geds-cyan flex items-center justify-center text-white text-sm font-medium">
            {initials}
          </div>
          <span className="hidden sm:inline text-sm font-medium text-gray-700 max-w-[120px] truncate">
            {displayName}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-gray-900">{displayName}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/dashboard`} className="cursor-pointer">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            {t('navigation.dashboard')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/cvgen`} className="cursor-pointer">
            <FileText className="w-4 h-4 mr-2" />
            {t('navigation.cvgen')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/settings`} className="cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            {t('navigation.settings')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={logout}>
          <input type="hidden" name="locale" value={locale} />
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full cursor-pointer text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              {t('navigation.logout')}
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
