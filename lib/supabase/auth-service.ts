import { getSupabaseClient } from './client';

// ============================================================================
// GUEST MODE
// ============================================================================

const GUEST_ID_KEY = 'cvbuilder_guest_id';

/**
 * Get or create a guest user ID
 * Stored in localStorage for persistence across sessions
 */
export function getGuestId(): string {
  if (typeof window === 'undefined') {
    return crypto.randomUUID();
  }

  let guestId = localStorage.getItem(GUEST_ID_KEY);
  
  if (!guestId) {
    guestId = `guest_${crypto.randomUUID()}`;
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }
  
  return guestId;
}

/**
 * Check if the current user is a guest
 */
export function isGuest(userId: string): boolean {
  return userId.startsWith('guest_');
}

/**
 * Clear guest ID (for testing or reset)
 */
export function clearGuestId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(GUEST_ID_KEY);
  }
}

// ============================================================================
// SUPABASE AUTH (Optional)
// ============================================================================

export interface AuthUser {
  id: string;
  email: string | null;
  isGuest: boolean;
}

/**
 * Get the current user (authenticated or guest)
 */
export async function getCurrentUser(): Promise<AuthUser> {
  const supabase = getSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    return {
      id: user.id,
      email: user.email ?? null,
      isGuest: false,
    };
  }
  
  // Fallback to guest mode
  return {
    id: getGuestId(),
    email: null,
    isGuest: true,
  };
}

/**
 * Sign up with email and password
 * Optionally migrate guest CVs to the new account
 */
export async function signUp(email: string, password: string) {
  const supabase = getSupabaseClient();
  const guestId = getGuestId();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  
  // Migrate guest CVs to new user if they exist
  if (data.user) {
    await migrateCVsToUser(guestId, data.user.id);
    clearGuestId();
  }
  
  return data;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  // Clear guest ID on successful login
  clearGuestId();
  
  return data;
}

/**
 * Sign out
 */
export async function signOut() {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) throw error;
}

/**
 * Migrate CVs from guest to authenticated user
 */
async function migrateCVsToUser(guestId: string, userId: string): Promise<void> {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase
    .from('cvs')
    .update({ user_id: userId })
    .eq('user_id', guestId);
  
  if (error) {
    console.error('Failed to migrate CVs:', error);
    // Don't throw - user can still use the app
  }
}

// ============================================================================
// AUTH STATE HOOK HELPERS
// ============================================================================

/**
 * Subscribe to auth state changes
 * Returns unsubscribe function
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  const supabase = getSupabaseClient();
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email ?? null,
          isGuest: false,
        });
      } else {
        // Fallback to guest
        callback({
          id: getGuestId(),
          email: null,
          isGuest: true,
        });
      }
    }
  );
  
  return () => subscription.unsubscribe();
}

