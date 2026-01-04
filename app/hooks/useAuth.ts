'use client';

import { useState, useCallback, useSyncExternalStore } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCurrentUser,
  signUp as signUpService,
  signIn as signInService,
  signOut as signOutService,
  onAuthStateChange,
  getGuestId,
  type AuthUser,
} from '@/lib/supabase/auth-service';
import { cvKeys } from './useCV';

// ============================================================================
// AUTH STATE (External Store Pattern - No useEffect!)
// ============================================================================

let currentUser: AuthUser | null = null;
let listeners: Set<() => void> = new Set();

// Initialize on client side
if (typeof window !== 'undefined') {
  // Set initial guest user synchronously
  currentUser = {
    id: getGuestId(),
    email: null,
    isGuest: true,
  };

  // Subscribe to auth changes
  onAuthStateChange((user) => {
    currentUser = user;
    listeners.forEach((listener) => listener());
  });

  // Check for existing session
  getCurrentUser().then((user) => {
    currentUser = user;
    listeners.forEach((listener) => listener());
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
 */
export function useAuth() {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  
  return {
    user,
    isAuthenticated: user !== null && !user.isGuest,
    isGuest: user?.isGuest ?? true,
    userId: user?.id ?? null,
  };
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
 * Get user ID (authenticated or guest)
 * Useful for creating/fetching CVs
 */
export function useUserId(): string {
  const { userId } = useAuth();
  
  // Always return a valid ID (guest if not authenticated)
  if (!userId) {
    return getGuestId();
  }
  
  return userId;
}

