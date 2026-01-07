'use client';

import { useSyncExternalStore } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCurrentUser,
  ensureAuthenticated,
  signUp as signUpService,
  signIn as signInService,
  signOut as signOutService,
  onAuthStateChange,
  type AuthUser,
} from '@/lib/supabase/auth-service';
import { cvKeys } from './useCV';

// ============================================================================
// AUTH STATE (External Store Pattern - No useEffect!)
// ============================================================================

let currentUser: AuthUser | null = null;
let isInitializing = true;
let initPromise: Promise<void> | null = null;
let listeners: Set<() => void> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

// Initialize on client side - NO useEffect needed
if (typeof window !== 'undefined') {
  // Start initialization immediately
  initPromise = (async () => {
    try {
      // First check for existing session
      const user = await getCurrentUser();
      
      if (user) {
        currentUser = user;
      } else {
        // No session - sign in anonymously
        const authUser = await ensureAuthenticated();
        currentUser = authUser;
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      // On error, currentUser stays null
    } finally {
      isInitializing = false;
      notifyListeners();
    }
  })();

  // Subscribe to auth changes for future updates
  onAuthStateChange((user) => {
    currentUser = user;
    notifyListeners();
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return currentUser;
}

function getServerSnapshot() {
  return null;
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Get current auth user using useSyncExternalStore
 * No useEffect needed - syncs with external auth state
 * Automatically signs in anonymously if no session exists
 */
export function useAuth() {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  
  return {
    user,
    isAuthenticated: user !== null && !user.isAnonymous,
    isGuest: user === null || user.isAnonymous,
    isAnonymous: user?.isAnonymous ?? false,
    userId: user?.id ?? null,
    isInitializing,
  };
}

/**
 * Wait for auth to be ready (useful for blocking operations)
 * Returns a promise that resolves when auth is initialized
 */
export async function waitForAuth(): Promise<AuthUser | null> {
  if (initPromise) {
    await initPromise;
  }
  return currentUser;
}

/**
 * Sign up mutation
 */
export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signUpService(email, password),
    onSuccess: () => {
      // Invalidate all CV queries to refetch with new user ID
      queryClient.invalidateQueries({ queryKey: cvKeys.all });
    },
  });
}

/**
 * Sign in mutation
 */
export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signInService(email, password),
    onSuccess: () => {
      // Invalidate all CV queries to refetch with new user ID
      queryClient.invalidateQueries({ queryKey: cvKeys.all });
    },
  });
}

/**
 * Sign out mutation
 */
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => signOutService(),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
  });
}

/**
 * Get user ID (authenticated or anonymous)
 */
export function useUserId(): string | null {
  const { userId } = useAuth();
  return userId;
}
