'use client';

import { useCallback, useSyncExternalStore } from 'react';

const memoryValues = new Map<string, string>();
const subscribeHydration = () => () => {};
const hydratedSnapshot = () => true;
const serverSnapshot = () => false;

export function useHydrated() {
  return useSyncExternalStore(subscribeHydration, hydratedSnapshot, serverSnapshot);
}

export function useBrowserMedia(query: string, fallback = false) {
  const subscribe = useCallback((callback: () => void) => {
    const media = window.matchMedia(query);
    media.addEventListener('change', callback);
    return () => media.removeEventListener('change', callback);
  }, [query]);
  const read = useCallback(() => window.matchMedia(query).matches, [query]);
  const readServer = useCallback(() => fallback, [fallback]);
  return useSyncExternalStore(subscribe, read, readServer);
}

export function useStoredValue(key: string, fallback: string, kind: 'local' | 'session' = 'local') {
  const memoryKey = `${kind}:${key}`;
  const read = useCallback(() => {
    try {
      const storage = kind === 'session' ? window.sessionStorage : window.localStorage;
      return storage.getItem(key) ?? fallback;
    } catch {
      return memoryValues.get(memoryKey) ?? fallback;
    }
  }, [key, fallback, kind, memoryKey]);
  const readServer = useCallback(() => fallback, [fallback]);
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener('storage', callback);
    window.addEventListener('laxitech:storage', callback);
    return () => {
      window.removeEventListener('storage', callback);
      window.removeEventListener('laxitech:storage', callback);
    };
  }, []);
  const value = useSyncExternalStore(subscribe, read, readServer);
  const write = useCallback((next: string) => {
    memoryValues.set(memoryKey, next);
    try {
      const storage = kind === 'session' ? window.sessionStorage : window.localStorage;
      storage.setItem(key, next);
    } catch {}
    window.dispatchEvent(new Event('laxitech:storage'));
  }, [key, kind, memoryKey]);

  return [value, write] as const;
}
