'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { mapSupabaseError, type AuthErrorCode } from '@/lib/auth/error-messages';
import * as z from 'zod';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  fullName: z.string().min(2, 'Name must be at least 2 characters').optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// ============================================================================
// FORM STATE TYPE
// ============================================================================

export type AuthFormState = {
  errors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    fullName?: string[];
  };
  message?: string;
  errorCode?: AuthErrorCode; // Add error code for i18n
  success?: boolean;
} | undefined;

// ============================================================================
// AUTH ACTIONS
// ============================================================================

/**
 * Login with email and password
 */
export async function login(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { email, password } = validatedFields.data;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const errorCode = mapSupabaseError(error.message);
    return {
      errorCode,
      message: error.message, // Keep original for debugging
    };
  }

  // Migrate guest CVs to authenticated user
  const guestId = formData.get('guestId') as string;
  if (guestId && data.user) {
    await migrateCVsToUser(supabase, guestId, data.user.id);
  }

  revalidatePath('/', 'layout');
  
  // Get locale from form data
  const locale = formData.get('locale') as string || 'en';
  redirect(`/${locale}/dashboard`);
}

/**
 * Migrate CVs from guest to authenticated user
 */
async function migrateCVsToUser(
  supabase: Awaited<ReturnType<typeof createClient>>,
  guestId: string,
  userId: string
) {
  try {
    // Update all CVs with the guest ID to use the authenticated user ID
    const { error } = await supabase
      .from('cvs')
      .update({ user_id: userId })
      .eq('user_id', guestId);
    
    if (error) {
      console.error('Error migrating CVs:', error);
    }
  } catch (err) {
    console.error('Failed to migrate CVs:', err);
  }
}

/**
 * Register with email and password
 * For anonymous users, this converts them to permanent users using updateUser()
 * For new users, this creates a new account using signUp()
 * 
 * Note: Email confirmation is disabled, so users are immediately active
 */
export async function register(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const validatedFields = RegisterSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    fullName: formData.get('fullName') || undefined,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as NonNullable<AuthFormState>['errors'],
    };
  }

  const supabase = await createClient();
  const { email, password, fullName } = validatedFields.data;
  const locale = formData.get('locale') as string || 'en';
  const isAnonymous = formData.get('isAnonymous') === 'true';

  // For anonymous users, use updateUser to convert them to permanent users
  // This keeps the same user_id, so CVs remain linked automatically
  if (isAnonymous) {
    // Update email and password in one go - no email confirmation needed
    const { error: updateError } = await supabase.auth.updateUser({
      email,
      password,
      data: {
        full_name: fullName,
      },
    });

    if (updateError) {
      const errorCode = mapSupabaseError(updateError.message);
      return {
        errorCode,
        message: updateError.message,
      };
    }

    // Success! Redirect to dashboard
    revalidatePath('/', 'layout');
    redirect(`/${locale}/dashboard`);
  }

  // For non-anonymous users, use the standard signUp flow
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    const errorCode = mapSupabaseError(error.message);
    return {
      errorCode,
      message: error.message,
    };
  }

  // Check if user already exists (Supabase returns user with empty identities array)
  if (data?.user?.identities?.length === 0) {
    return {
      errorCode: 'user_already_exists',
      message: 'User already registered',
    };
  }

  // Success! Redirect to dashboard
  revalidatePath('/', 'layout');
  redirect(`/${locale}/dashboard`);
}

/**
 * Logout the current user
 */
export async function logout(formData: FormData) {
  const supabase = await createClient();
  const locale = formData.get('locale') as string || 'en';
  
  await supabase.auth.signOut();
  
  revalidatePath('/', 'layout');
  redirect(`/${locale}`);
}

/**
 * Sign in with OAuth provider (Google, LinkedIn, etc.)
 */
export async function signInWithOAuth(provider: 'google' | 'linkedin_oidc', locale: string = 'en') {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/auth/callback?next=/cvgen`,
    },
  });

  if (error) {
    throw error;
  }

  if (data.url) {
    redirect(data.url);
  }
}

/**
 * Reset password - send reset email
 */
export async function resetPassword(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get('email') as string;
  const locale = formData.get('locale') as string || 'en';

  if (!email || !z.string().email().safeParse(email).success) {
    return {
      errors: {
        email: ['Please enter a valid email address'],
      },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/auth/callback?next=/reset-password`,
  });

  // For security, always show success message (don't reveal if email exists)
  if (error) {
    console.error('Password reset error:', error.message);
  }

  return {
    success: true,
  };
}

/**
 * Update password (after reset)
 */
export async function updatePassword(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password !== confirmPassword) {
    return {
      message: 'Passwords do not match',
    };
  }

  const validPassword = z
    .string()
    .min(8)
    .regex(/[a-zA-Z]/)
    .regex(/[0-9]/)
    .safeParse(password);

  if (!validPassword.success) {
    return {
      errors: {
        password: [
          'Password must be at least 8 characters with at least one letter and one number',
        ],
      },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    const errorCode = mapSupabaseError(error.message);
    return {
      errorCode,
      message: error.message,
    };
  }

  const locale = formData.get('locale') as string || 'en';
  revalidatePath('/', 'layout');
  redirect(`/${locale}/cvgen`);
}

