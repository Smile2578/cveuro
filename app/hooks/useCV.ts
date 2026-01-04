import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createCV, 
  fetchCV, 
  fetchCVByUserId, 
  updateCV, 
  deleteCV,
  type CreateCVData,
  type UpdateCVData 
} from '@/lib/supabase/cv-service';
import type { CV } from '@/types/cv.types';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const cvKeys = {
  all: ['cvs'] as const,
  lists: () => [...cvKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...cvKeys.lists(), filters] as const,
  details: () => [...cvKeys.all, 'detail'] as const,
  detail: (id: string) => [...cvKeys.details(), id] as const,
  byUser: (userId: string) => [...cvKeys.all, 'user', userId] as const,
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Fetch a CV by its ID
 * Replaces useEffect-based data fetching
 */
export function useCV(cvId: string | null) {
  return useQuery({
    queryKey: cvKeys.detail(cvId ?? ''),
    queryFn: () => fetchCV(cvId!),
    enabled: !!cvId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch the latest CV for a user
 * Used for guest mode with localStorage userId
 */
export function useCVByUserId(userId: string | null) {
  return useQuery({
    queryKey: cvKeys.byUser(userId ?? ''),
    queryFn: () => fetchCVByUserId(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create a new CV
 * Automatically invalidates relevant queries on success
 */
export function useCreateCV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCVData) => createCV(data),
    onSuccess: (newCV) => {
      // Add to cache
      queryClient.setQueryData(cvKeys.detail(newCV.id!), newCV);
      queryClient.setQueryData(cvKeys.byUser(newCV.userId), newCV);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: cvKeys.lists() });
    },
  });
}

/**
 * Update an existing CV
 * Optimistic updates for better UX
 */
export function useUpdateCV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCVData) => updateCV(data),
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: cvKeys.detail(newData.id) });

      // Snapshot previous value
      const previousCV = queryClient.getQueryData<CV>(cvKeys.detail(newData.id));

      // Optimistically update
      if (previousCV) {
        queryClient.setQueryData(cvKeys.detail(newData.id), {
          ...previousCV,
          ...newData,
        });
      }

      return { previousCV };
    },
    onError: (_err, newData, context) => {
      // Rollback on error
      if (context?.previousCV) {
        queryClient.setQueryData(cvKeys.detail(newData.id), context.previousCV);
      }
    },
    onSettled: (_data, _error, variables) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: cvKeys.detail(variables.id) });
    },
  });
}

/**
 * Delete a CV
 */
export function useDeleteCV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cvId: string) => deleteCV(cvId),
    onSuccess: (_data, cvId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: cvKeys.detail(cvId) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: cvKeys.lists() });
    },
  });
}

// ============================================================================
// PREFETCHING
// ============================================================================

/**
 * Prefetch a CV for faster navigation
 * Call this before navigating to CV edit page
 */
export function usePrefetchCV() {
  const queryClient = useQueryClient();

  return (cvId: string) => {
    queryClient.prefetchQuery({
      queryKey: cvKeys.detail(cvId),
      queryFn: () => fetchCV(cvId),
      staleTime: 5 * 60 * 1000,
    });
  };
}

