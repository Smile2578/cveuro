import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Email confirmation route handler
 * This route is called when a user clicks the confirmation link in their email
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') || '/cvgen';
  
  // Extract locale from the URL path
  const pathParts = request.nextUrl.pathname.split('/');
  const locale = pathParts[1] || 'en';
  
  // Create redirect link without the secret token
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = `/${locale}${next}`;
  redirectTo.searchParams.delete('token_hash');
  redirectTo.searchParams.delete('type');
  
  if (token_hash && type) {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    
    if (!error) {
      redirectTo.searchParams.delete('next');
      return NextResponse.redirect(redirectTo);
    }
    
    console.error('Email verification error:', error);
  }
  
  // Return the user to an error page with some instructions
  redirectTo.pathname = `/${locale}/login`;
  redirectTo.searchParams.set('error', 'Email verification failed. Please try again.');
  return NextResponse.redirect(redirectTo);
}

