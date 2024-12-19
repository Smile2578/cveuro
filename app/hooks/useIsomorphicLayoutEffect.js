'use client';

import { useEffect, useLayoutEffect } from 'react';

// Utilise useLayoutEffect côté client et useEffect côté serveur
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect; 