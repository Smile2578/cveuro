import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Auth callback route handler
 * This route is called by Supabase after OAuth or email confirmation
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const next = requestUrl.searchParams.get('next') || '/';
  
  // Extract locale from the URL path
  const pathParts = requestUrl.pathname.split('/');
  const locale = pathParts[1] || 'en';
  
  // Handle OAuth errors
  if (error) {
    console.error('Auth callback error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(`/${locale}/login?error=${encodeURIComponent(errorDescription || error)}`, requestUrl.origin)
    );
  }
  
  if (code) {
    const supabase = await createClient();
    
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error('Code exchange error:', exchangeError);
      return NextResponse.redirect(
        new URL(`/${locale}/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
      );
    }
  }
  
  // Successful auth - redirect to the intended destination
  return NextResponse.redirect(new URL(`/${locale}${next}`, requestUrl.origin));
}

