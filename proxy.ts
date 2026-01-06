import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

const intlMiddleware = createMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

// Next.js 16+ uses proxy instead of middleware
export async function proxy(request: NextRequest) {
  // First, update the Supabase session
  const supabaseResponse = await updateSession(request);
  
  // Then apply i18n middleware
  const intlResponse = intlMiddleware(request);
  
  // Merge cookies from Supabase response into intl response
  if (intlResponse && supabaseResponse) {
    supabaseResponse.cookies.getAll().forEach(cookie => {
      intlResponse.cookies.set(cookie.name, cookie.value);
    });
    return intlResponse;
  }
  
  return intlResponse || supabaseResponse || NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/(fr|en)/:path*'
  ]
};

