/**
 * Map Supabase auth errors to i18n translation keys
 * Following OWASP security guidelines - don't reveal too much info
 */

export type AuthErrorCode = 
  | 'invalid_credentials'
  | 'email_not_confirmed'
  | 'user_already_exists'
  | 'weak_password'
  | 'invalid_email'
  | 'rate_limit'
  | 'email_taken'
  | 'user_not_found'
  | 'session_expired'
  | 'generic';

/**
 * Maps Supabase error messages to our error codes
 * We intentionally use vague messages for security (OWASP guidelines)
 */
export function mapSupabaseError(errorMessage: string): AuthErrorCode {
  const message = errorMessage.toLowerCase();
  
  // Login errors - be vague for security (don't reveal if email exists)
  if (
    message.includes('invalid login credentials') ||
    message.includes('invalid email or password') ||
    message.includes('wrong password') ||
    message.includes('invalid password')
  ) {
    return 'invalid_credentials';
  }
  
  // Email not confirmed
  if (
    message.includes('email not confirmed') ||
    message.includes('confirm your email') ||
    message.includes('email confirmation')
  ) {
    return 'email_not_confirmed';
  }
  
  // User already exists (signup)
  if (
    message.includes('user already registered') ||
    message.includes('already been registered') ||
    message.includes('email already in use') ||
    message.includes('already exists')
  ) {
    return 'user_already_exists';
  }
  
  // Weak password
  if (
    message.includes('password') && 
    (message.includes('weak') || message.includes('short') || message.includes('at least'))
  ) {
    return 'weak_password';
  }
  
  // Invalid email format
  if (
    message.includes('invalid email') ||
    message.includes('email format') ||
    message.includes('valid email')
  ) {
    return 'invalid_email';
  }
  
  // Rate limiting
  if (
    message.includes('rate limit') ||
    message.includes('too many requests') ||
    message.includes('try again later') ||
    message.includes('exceeded')
  ) {
    return 'rate_limit';
  }
  
  // Session expired
  if (
    message.includes('session') ||
    message.includes('expired') ||
    message.includes('refresh token')
  ) {
    return 'session_expired';
  }
  
  // User not found (for password reset - be vague)
  if (message.includes('user not found') || message.includes('no user')) {
    return 'user_not_found';
  }
  
  // Default to generic error
  return 'generic';
}

/**
 * Get the i18n key for an error code
 */
export function getErrorKey(code: AuthErrorCode): string {
  const errorKeys: Record<AuthErrorCode, string> = {
    invalid_credentials: 'errors.invalidCredentials',
    email_not_confirmed: 'errors.emailNotConfirmed',
    user_already_exists: 'errors.emailInUse',
    weak_password: 'errors.weakPassword',
    invalid_email: 'errors.invalidEmail',
    rate_limit: 'errors.rateLimit',
    email_taken: 'errors.emailInUse',
    user_not_found: 'errors.checkEmail', // Don't reveal if user exists
    session_expired: 'errors.sessionExpired',
    generic: 'errors.generic',
  };
  
  return errorKeys[code];
}

/**
 * Helper to get error key from Supabase error
 */
export function getAuthErrorKey(supabaseErrorMessage: string): string {
  const code = mapSupabaseError(supabaseErrorMessage);
  return getErrorKey(code);
}

