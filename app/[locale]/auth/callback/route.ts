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
  const next = requestUrl.searchParams.get('next');
  
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
    
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error('Code exchange error:', exchangeError);
      return NextResponse.redirect(
        new URL(`/${locale}/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
      );
    }
    
    // Check if this is an anonymous user who just confirmed their email
    // They need to set a password before accessing the dashboard
    const user = data?.user;
    if (user) {
      // User has email but might not have a password yet (anonymous conversion)
      // Check if user has any identities with email provider
      const hasEmailIdentity = user.identities?.some(
        (identity) => identity.provider === 'email'
      );
      
      // If user confirmed email but doesn't have email identity yet,
      // they need to set their password
      if (!hasEmailIdentity && user.email) {
        return NextResponse.redirect(
          new URL(`/${locale}/auth/set-password`, requestUrl.origin)
        );
      }
    }
  }
  
  // Successful auth - redirect to the intended destination or dashboard
  const destination = next || '/dashboard';
  return NextResponse.redirect(new URL(`/${locale}${destination}`, requestUrl.origin));
}

