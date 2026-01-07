import { getSupabaseClient } from './client';

// ============================================================================
// TYPES
// ============================================================================

export interface AuthUser {
  id: string;
  email: string | null;
  isGuest: boolean;       // true = anonymous user (signInAnonymously)
  isAnonymous: boolean;   // Supabase's is_anonymous claim
}

// ============================================================================
// ANONYMOUS AUTH (replaces old guest mode)
// ============================================================================

/**
 * Sign in anonymously using Supabase Auth
 * Creates a real anonymous user with auth.uid()
 * 
 * @returns The anonymous user session
 */
export async function signInAnonymously() {
  const supabase = getSupabaseClient();
  
  // Check if already signed in
  const { data: { user: existingUser } } = await supabase.auth.getUser();
  
  if (existingUser) {
    // Already have a session (anonymous or permanent)
    return { user: existingUser, session: null };
  }
  
  // Create new anonymous user
  const { data, error } = await supabase.auth.signInAnonymously();
  
  if (error) {
    console.error('Failed to sign in anonymously:', error);
    throw error;
  }
  
  return data;
}

/**
 * Ensure the user is signed in (anonymous or permanent)
 * Call this before any database operation
 */
export async function ensureAuthenticated(): Promise<AuthUser> {
  const supabase = getSupabaseClient();
  
  // Check for existing session
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    const isAnonymous = user.is_anonymous ?? false;
    return {
      id: user.id,
      email: user.email ?? null,
      isGuest: isAnonymous,
      isAnonymous,
    };
  }
  
  // No session - sign in anonymously
  const { user: anonUser } = await signInAnonymously();
  
  if (!anonUser) {
    throw new Error('Failed to create anonymous session');
  }
  
  return {
    id: anonUser.id,
    email: null,
    isGuest: true,
    isAnonymous: true,
  };
}

// ============================================================================
// LEGACY GUEST MODE (for migration)
// ============================================================================

const LEGACY_GUEST_ID_KEY = 'cvbuilder_guest_id';
const LEGACY_GUEST_ID_KEY_2 = 'guestId';

/**
 * Get legacy guest ID if it exists
 * Used for migrating old CVs to the new anonymous auth system
 */
export function getLegacyGuestId(): string | null {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem(LEGACY_GUEST_ID_KEY) || 
         localStorage.getItem(LEGACY_GUEST_ID_KEY_2) || 
         null;
}

/**
 * Clear legacy guest IDs after migration
 */
export function clearLegacyGuestIds(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(LEGACY_GUEST_ID_KEY);
  localStorage.removeItem(LEGACY_GUEST_ID_KEY_2);
}

/**
 * @deprecated Use ensureAuthenticated() instead
 * Kept for backwards compatibility during migration
 */
export function getGuestId(): string {
  const legacyId = getLegacyGuestId();
  if (legacyId) return legacyId;
  
  // Generate a temporary ID - this should be replaced by signInAnonymously
  if (typeof window === 'undefined') {
    return crypto.randomUUID();
  }
  
  // Create and store new ID for backwards compat
  const newId = `guest_${crypto.randomUUID()}`;
  localStorage.setItem(LEGACY_GUEST_ID_KEY, newId);
  return newId;
}

/**
 * @deprecated Use isAnonymous from AuthUser instead
 */
export function isGuest(userId: string): boolean {
  return userId.startsWith('guest_') || (userId.length === 32 && !userId.includes('-'));
}

/**
 * @deprecated Use clearLegacyGuestIds() instead
 */
export function clearGuestId(): void {
  clearLegacyGuestIds();
}

// ============================================================================
// SUPABASE AUTH
// ============================================================================

/**
 * Get the current user (authenticated, anonymous, or null)
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = getSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    const isAnonymous = user.is_anonymous ?? false;
    return {
      id: user.id,
      email: user.email ?? null,
      isGuest: isAnonymous,
      isAnonymous,
    };
  }
  
  return null;
}

/**
 * Sign up with email and password
 * If user is anonymous, this will link the email to their account
 */
export async function signUp(email: string, password: string) {
  const supabase = getSupabaseClient();
  
  // Check if user is currently anonymous
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  
  if (currentUser?.is_anonymous) {
    // Link email to anonymous account (convert to permanent)
    const { data, error } = await supabase.auth.updateUser({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Clear legacy guest IDs
    clearLegacyGuestIds();
    
    return data;
  }
  
  // Regular sign up (new user)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  
  // Check for legacy guest CVs to migrate
  const legacyGuestId = getLegacyGuestId();
  if (data.user && legacyGuestId) {
    await migrateLegacyCVsToUser(legacyGuestId, data.user.id);
    clearLegacyGuestIds();
  }
  
  return data;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient();
  
  // Check if currently anonymous - need to merge data
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const wasAnonymous = currentUser?.is_anonymous;
  const anonymousUserId = currentUser?.id;
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  // Migrate anonymous user's CVs to the permanent account
  if (wasAnonymous && anonymousUserId && data.user) {
    await migrateAnonymousCVsToUser(anonymousUserId, data.user.id);
  }
  
  // Also check for legacy guest CVs
  const legacyGuestId = getLegacyGuestId();
  if (data.user && legacyGuestId) {
    await migrateLegacyCVsToUser(legacyGuestId, data.user.id);
    clearLegacyGuestIds();
  }
  
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

// ============================================================================
// MIGRATION HELPERS
// ============================================================================

/**
 * Migrate CVs from anonymous user to permanent user
 */
async function migrateAnonymousCVsToUser(anonymousUserId: string, permanentUserId: string): Promise<void> {
  if (anonymousUserId === permanentUserId) return;
  
  const supabase = getSupabaseClient();
  
  const { error } = await supabase
    .from('cvs')
    .update({ user_id: permanentUserId })
    .eq('user_id', anonymousUserId);
  
  if (error) {
    console.error('Failed to migrate anonymous CVs:', error);
    // Don't throw - user can still use the app
  }
}

/**
 * Migrate CVs from legacy guest ID to permanent user
 */
async function migrateLegacyCVsToUser(guestId: string, userId: string): Promise<void> {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase
    .from('cvs')
    .update({ user_id: userId })
    .eq('user_id', guestId);
  
  if (error) {
    console.error('Failed to migrate legacy CVs:', error);
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
        const isAnonymous = session.user.is_anonymous ?? false;
        callback({
          id: session.user.id,
          email: session.user.email ?? null,
          isGuest: isAnonymous,
          isAnonymous,
        });
      } else {
        // No session - callback with null (not guest)
        callback(null);
      }
    }
  );
  
  return () => subscription.unsubscribe();
}
