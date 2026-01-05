'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
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

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      message: error.message,
    };
  }

  revalidatePath('/', 'layout');
  
  // Get locale from form data
  const locale = formData.get('locale') as string || 'en';
  redirect(`/${locale}/cvgen`);
}

/**
 * Register with email and password
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
      errors: validatedFields.error.flatten().fieldErrors as AuthFormState['errors'],
    };
  }

  const supabase = await createClient();
  const { email, password, fullName } = validatedFields.data;
  const locale = formData.get('locale') as string || 'en';

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/auth/callback`,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return {
      message: error.message,
    };
  }

  return {
    success: true,
    message: 'Check your email to confirm your account.',
  };
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

  if (error) {
    return {
      message: error.message,
    };
  }

  return {
    success: true,
    message: 'Check your email for a password reset link.',
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
    return {
      message: error.message,
    };
  }

  const locale = formData.get('locale') as string || 'en';
  revalidatePath('/', 'layout');
  redirect(`/${locale}/cvgen`);
}

