// app/hooks/useIsomorphicLayoutEffect.ts
'use client';

import { useEffect, useLayoutEffect, type EffectCallback, type DependencyList } from 'react';

// Use useLayoutEffect on client and useEffect on server
export const useIsomorphicLayoutEffect: (
  effect: EffectCallback,
  deps?: DependencyList
) => void = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;

