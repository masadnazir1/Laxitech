'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  shouldInterceptNavigationClick,
  computeCurtainRevealDecision,
} from '@/lib/portfolioMotion';
import { LaxitechWordmark } from '@/components/brand/LaxitechWordmark';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Minimum time (ms) the multi-column curtain stays closed / sweeping closed
 * so the signature staggered column + CYNEX emblem animation is always visibly
 * perceived as a smooth, deliberate page transition (never a sub-frame blink).
 */
const MIN_CLOSE_DURATION_MS = 380;

/**
 * Safety timeout (ms) in case a route transition fails or is aborted.
 * Must be generous (4500ms) so the curtain never prematurely disappears
 * before the destination route commits.
 */
const SAFETY_TIMEOUT_MS = 4500;

const CORE_ROUTES_TO_WARM = [
  '/',
  '/about',
  '/solutions',
  '/services',
  '/insights',
  '/products',
  '/contact',
];

/**
 * Odd-number responsive stretched curtain rectangles:
 * - Mobile (< 768px): 3 equal stretched columns (indices 0, 1, 2)
 * - Tablet / Medium (768px - 1279px): 5 equal stretched columns (indices 0..4)
 * - Large Desktop (>= 1280px): 7 equal stretched columns (indices 0..6)
 */
const CURTAIN_VISIBILITY_CLASSES = [
  'block',
  'block',
  'block',
  'hidden md:block',
  'hidden md:block',
  'hidden xl:block',
  'hidden xl:block',
];

export function RoutePreloader() {
  const pathname = usePathname();
  const router = useRouter();
  const curtainRef = useRef<HTMLDivElement>(null);
  const colsRef = useRef<(HTMLDivElement | null)[]>([]);
  const logoRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);
  const pendingTargetPathRef = useRef<string | null>(null);
  const fallbackRevealedForPathRef = useRef<string | null>(null);
  const prevPathnameRef = useRef(pathname);
  const clickStartTimeRef = useRef<number>(0);
  const safetyTimeoutRef = useRef<number>(0);
  const revealDelayTimeoutRef = useRef<number>(0);
  const prefetchedPathsRef = useRef<Set<string>>(new Set());

  const getActiveColumns = () => {
    const all = colsRef.current.filter(Boolean) as HTMLDivElement[];
    if (typeof window === 'undefined') return all;
    const w = window.innerWidth;
    const count = w >= 1280 ? 7 : w >= 768 ? 5 : 3;
    return all.slice(0, count);
  };

  // Warm a route cleanly without saturating the dev server queue
  const warmRoute = (rawPath: string) => {
    const cleanPath = rawPath === '/blog' ? '/blogs' : rawPath;
    if (!cleanPath || prefetchedPathsRef.current.has(cleanPath)) return;
    prefetchedPathsRef.current.add(cleanPath);
    try {
      router.prefetch(cleanPath);
    } catch {
      // Ignore prefetch errors
    }
  };

  // Upward reveal of the odd-count stretched curtain once the new page has committed
  const revealNewPage = (scrollToTop = true) => {
    window.clearTimeout(safetyTimeoutRef.current);
    window.clearTimeout(revealDelayTimeoutRef.current);

    const allCols = colsRef.current.filter(Boolean) as HTMLDivElement[];
    const activeCols = getActiveColumns();
    const cols = activeCols.length ? activeCols : allCols;
    const curtain = curtainRef.current;
    const logo = logoRef.current;

    if (!cols.length || !curtain) {
      isTransitioningRef.current = false;
      pendingTargetPathRef.current = null;
      delete document.documentElement.dataset.routeTransition;
      return;
    }

    if (scrollToTop) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });
    }

    curtain.style.pointerEvents = 'none';
    isTransitioningRef.current = false;

    gsap.killTweensOf(allCols);
    if (logo) gsap.killTweensOf(logo);

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(allCols, { scaleY: 0 });
        if (logo) gsap.set(logo, { opacity: 0, y: 0, scale: 0.92 });
        curtain.dataset.state = 'idle';
        delete document.documentElement.dataset.routeTransition;
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      },
    });

    if (logo) {
      tl.to(
        logo,
        {
          opacity: 0,
          y: -10,
          scale: 0.94,
          duration: 0.2,
          ease: 'power2.in',
        },
        0
      );
    }

    tl.to(
      cols,
      {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 0.46,
        stagger: 0.038,
        ease: 'power4.inOut',
      },
      0.04
    );
  };

  // 0. Sequential background route pre-warming so all core routes are pre-compiled before first click
  useEffect(() => {
    prefetchedPathsRef.current.add(window.location.pathname);
    let idx = 0;
    let timerId = 0;

    const warmNext = () => {
      if (idx >= CORE_ROUTES_TO_WARM.length) return;
      if (!isTransitioningRef.current) {
        const route = CORE_ROUTES_TO_WARM[idx];
        idx += 1;
        if (route !== window.location.pathname) {
          warmRoute(route);
        }
      }
      timerId = window.setTimeout(warmNext, 120);
    };

    timerId = window.setTimeout(warmNext, 150);
    return () => window.clearTimeout(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 1. On-hover single-flight prefetch + non-blocking native click curtain choreography
  useEffect(() => {
    const handlePointerOver = (e: PointerEvent | FocusEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;
      const rawHref = anchor.getAttribute('href');
      if (!rawHref || !rawHref.startsWith('/') || rawHref.startsWith('/#'))
        return;
      const cleanPath = rawHref.split('#')[0] || '/';
      if (cleanPath !== window.location.pathname) {
        warmRoute(cleanPath);
      }
    };

    const handleDocumentClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      if (reducedMotion) return;

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;

      const rawHref = anchor.getAttribute('href');
      const { shouldIntercept, targetPath } = shouldInterceptNavigationClick({
        href: rawHref,
        target: anchor.getAttribute('target'),
        hasDownload: anchor.hasAttribute('download'),
        metaKey: e.metaKey,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        button: e.button,
        currentPathname: window.location.pathname,
      });

      if (!shouldIntercept) return;

      const cleanTarget = targetPath.split('#')[0] || '/';

      // Pause background WebGL loops during route transition so 100% of CPU/GPU goes to curtain & React commit
      document.documentElement.dataset.routeTransition = 'active';
      isTransitioningRef.current = true;
      pendingTargetPathRef.current = cleanTarget;
      fallbackRevealedForPathRef.current = null;
      clickStartTimeRef.current = performance.now();

      const allCols = colsRef.current.filter(Boolean) as HTMLDivElement[];
      const activeCols = getActiveColumns();
      const cols = activeCols.length ? activeCols : allCols;
      const curtain = curtainRef.current;
      const logo = logoRef.current;

      if (!cols.length || !curtain) {
        isTransitioningRef.current = false;
        pendingTargetPathRef.current = null;
        delete document.documentElement.dataset.routeTransition;
        return;
      }

      curtain.dataset.state = 'closing';
      curtain.style.pointerEvents = 'none';
      window.clearTimeout(safetyTimeoutRef.current);
      window.clearTimeout(revealDelayTimeoutRef.current);

      safetyTimeoutRef.current = window.setTimeout(() => {
        if (isTransitioningRef.current) {
          fallbackRevealedForPathRef.current = pendingTargetPathRef.current;
          pendingTargetPathRef.current = null;
          revealNewPage(false);
        }
      }, SAFETY_TIMEOUT_MS);

      gsap.killTweensOf(allCols);
      gsap.set(allCols, { scaleY: 0, transformOrigin: 'bottom center' });
      if (logo) {
        gsap.killTweensOf(logo);
        gsap.set(logo, { opacity: 0, y: 10, scale: 0.92 });
      }

      const tl = gsap.timeline({
        onComplete: () => {
          if (isTransitioningRef.current) {
            curtain.dataset.state = 'closed';
          }
        },
      });

      tl.to(
        cols,
        {
          scaleY: 1,
          duration: 0.34,
          stagger: 0.032,
          ease: 'power3.inOut',
        },
        0
      );

      if (logo) {
        tl.to(
          logo,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.26,
            ease: 'power2.out',
          },
          0.1
        );
      }
    };

    document.addEventListener('pointerover', handlePointerOver, {
      passive: true,
    });
    document.addEventListener('focusin', handlePointerOver, {
      passive: true,
    });
    // Use capture phase (true) so our non-blocking observer runs before Next.js <Link> calls e.preventDefault()
    document.addEventListener('click', handleDocumentClick, true);
    return () => {
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('focusin', handlePointerOver);
      document.removeEventListener('click', handleDocumentClick, true);
      window.clearTimeout(safetyTimeoutRef.current);
      window.clearTimeout(revealDelayTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // 2. When pathname commits, execute the deterministic reveal decision
  useEffect(() => {
    const decision = computeCurtainRevealDecision({
      prevPathname: prevPathnameRef.current,
      nextPathname: pathname,
      isTransitioning: isTransitioningRef.current,
      fallbackRevealedForPath: fallbackRevealedForPathRef.current,
      elapsedMs: performance.now() - clickStartTimeRef.current,
      minCloseDurationMs: MIN_CLOSE_DURATION_MS,
    });

    if (decision.action === 'noop') return;

    prevPathnameRef.current = pathname;
    pendingTargetPathRef.current = null;

    if (decision.action === 'reveal-immediately') {
      revealNewPage(true);
    } else if (decision.action === 'reveal-after-wait') {
      window.clearTimeout(revealDelayTimeoutRef.current);
      revealDelayTimeoutRef.current = window.setTimeout(() => {
        revealNewPage(true);
      }, decision.waitMs);
    } else {
      fallbackRevealedForPathRef.current = null;
      delete document.documentElement.dataset.routeTransition;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // 3. Global Section Viewport Gate & Footer Mark Reveal Observer
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.setAttribute('data-inview', 'true');
          } else {
            el.removeAttribute('data-inview');
          }
        });
      },
      { rootMargin: '120px 0px' }
    );

    const footerMarkObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).setAttribute('data-shown', 'true');
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('section, .vv-sec');
    sections.forEach((sec) => sectionObserver.observe(sec));

    const footerMarks = document.querySelectorAll('.vv-footer-mark');
    footerMarks.forEach((mark) => footerMarkObserver.observe(mark));

    return () => {
      sectionObserver.disconnect();
      footerMarkObserver.disconnect();
    };
  }, [pathname]);

  return (
    <div
      ref={curtainRef}
      data-testid="route-preloader-curtain"
      data-state="idle"
      aria-hidden="true"
      className="site-route-curtain pointer-events-none fixed inset-0 z-[9999] flex h-full w-full items-stretch overflow-hidden"
    >
      {CURTAIN_VISIBILITY_CLASSES.map((visClass, idx) => (
        <div
          key={idx}
          data-testid={`curtain-col-${idx}`}
          ref={(el) => {
            colsRef.current[idx] = el;
          }}
          style={{
            transform: 'scaleY(0)',
            transformOrigin: 'top center',
            marginLeft: '-1px',
            marginRight: '-1px',
          }}
          className={`${visClass} h-full flex-1 border-r border-fg/[0.04] bg-[var(--vv-bg-elevated)] will-change-transform`}
        />
      ))}

      {/* Clean Center Solo CYNEX Emblem Logo (No YNEX Text / No Bordered Box) */}
      <div
        ref={logoRef}
        data-testid="curtain-emblem"
        style={{ opacity: 0, transform: 'translateY(10px) scale(0.92)' }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="relative flex items-center justify-center">
          <div className="pointer-events-none absolute h-28 w-28 rounded-full bg-accent/25 blur-2xl" />
          <LaxitechWordmark className="relative text-fg" />
        </div>
      </div>
    </div>
  );
}
