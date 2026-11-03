'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { flushSync } from 'react-dom';
import { useBrowserMedia, useStoredValue } from '@/lib/browserState';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: Theme) => void;
  toggleTheme: (e?: React.MouseEvent<HTMLElement>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [storedTheme, writeTheme] = useStoredValue('vv-theme', 'dark');
  const prefersDark = useBrowserMedia('(prefers-color-scheme: dark)', true);
  const theme: Theme = storedTheme === 'light' || storedTheme === 'system' ? storedTheme : 'dark';
  const resolvedTheme = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
  const setTheme = useCallback((next: Theme) => writeTheme(next), [writeTheme]);

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const toggleTheme = useCallback((e?: React.MouseEvent<HTMLElement>) => {
    const nextTheme: 'dark' | 'light' = resolvedTheme === 'dark' ? 'light' : 'dark';

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const docWithVT = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    if (e && !reducedMotion && typeof docWithVT.startViewTransition === 'function') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = docWithVT.startViewTransition(() => {
        flushSync(() => setTheme(nextTheme));
        document.documentElement.setAttribute('data-theme', nextTheme);
        document.documentElement.style.colorScheme = nextTheme;
      });

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${maxRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 520,
              easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        })
        .catch(() => {
          // Ignore view transition abort errors
        });
      return;
    }

    setTheme(nextTheme);
  }, [resolvedTheme, setTheme]);

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme, toggleTheme }), [theme, resolvedTheme, setTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'dark' as Theme,
      resolvedTheme: 'dark' as 'dark' | 'light',
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}
