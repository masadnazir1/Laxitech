'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useId,
} from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { SplitRollText } from '@/components/ui/SplitRollText';
import { ReactiveAuroraField } from '@/components/ui/ReactiveAuroraField';
import { LightPillar } from '@/components/ui/LightPillar';
import { resolveStockPlaceholder } from '@/data/assetRegistry';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

const useIsomorphicLayoutEffect =
  typeof document !== 'undefined' ? useLayoutEffect : useEffect;

const PLATFORM_ICON_PATHS = new Set([
  '/media/b8f738a1ce12a869dd6b08b1ea128e6b.png',
  '/media/12f174fbe6106094af5b31e0042943c2.png',
]);

/**
 * Fades in image (`opacity-0` -> `opacity-100`) once loaded or already complete.
 * Resolves project, blog, and template asset paths through the central asset registry.
 */
export function FadeInImg({
  className = '',
  onLoad,
  src,
  ...rest
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  const srcStr = typeof src === 'string' ? src : undefined;
  const resolvedSrc =
    srcStr &&
    !PLATFORM_ICON_PATHS.has(srcStr) &&
    (srcStr.startsWith('/media/') ||
      srcStr.startsWith('/projects/') ||
      srcStr.startsWith('/works/') ||
      srcStr.startsWith('/team/'))
      ? resolveStockPlaceholder(srcStr)
      : srcStr;

  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [resolvedSrc]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      {...rest}
      src={resolvedSrc}
      referrerPolicy="no-referrer"
      alt={rest.alt ?? ''}
      className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'}`}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
    />
  );
}

/**
 * Adds `is-loaded` class when aurora background image finishes loading.
 */
export function AuroraImg({
  src,
  className = '',
  style,
}: {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt=""
      className={`${className}${loaded ? ' is-loaded' : ''}`}
      style={style}
      loading="lazy"
      decoding="async"
      fetchPriority="low"
      onLoad={() => setLoaded(true)}
    />
  );
}

/**
 * Character-by-character blur-rise entrance animation (`yPercent: 42`, `stagger: 0.015`).
 * When `triggerOnScroll` is false (default for page headers), animates immediately on mount with zero delay.
 */
export function SplitHeadingReveal({
  children,
  className,
  triggerOnScroll = false,
}: {
  children: React.ReactNode;
  className?: string;
  triggerOnScroll?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const scopeEl = containerRef.current;
    const headingEl = scopeEl?.querySelector<HTMLElement>('h1, h2');
    if (!scopeEl || !headingEl) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        let splitInstance: SplitText | null = null;
        let rafId = 0;

        rafId = requestAnimationFrame(() => {
          if (!containerRef.current) return;
          headingEl.setAttribute(
            'aria-label',
            headingEl.textContent?.trim() ?? ''
          );
          splitInstance = SplitText.create(headingEl, {
            type: 'words,chars',
            charsClass: 'inline-block will-change-[transform,opacity]',
            wordsClass: 'inline-block whitespace-nowrap',
          });
          splitInstance.words.forEach((w) =>
            w.setAttribute('aria-hidden', 'true')
          );
          gsap.set(headingEl, { autoAlpha: 1 });

          if (!splitInstance.chars.length) return;

          const rect = scopeEl.getBoundingClientRect();
          const alreadyInView = rect.top < window.innerHeight * 0.92;

          gsap.fromTo(
            splitInstance.chars,
            {
              yPercent: 42,
              opacity: 0,
            },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.62,
              delay: triggerOnScroll && !alreadyInView ? 0 : 0.02,
              ease: 'power3.out',
              stagger: 0.015,
              clearProps: 'willChange,transform,opacity',
              scrollTrigger:
                triggerOnScroll && !alreadyInView
                  ? {
                      trigger: scopeEl,
                      start: 'top 88%',
                    }
                  : undefined,
            }
          );
        });

        return () => {
          cancelAnimationFrame(rafId);
          splitInstance?.revert();
        };
      });
    }, containerRef);

    return () => ctx.revert();
  }, [triggerOnScroll]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

/**
 * Page header with SplitHeadingReveal + scroll-scrubbed parallax sink (`y: 36` mobile, `y: 72` desktop).
 */
export function PageHeader({
  lead,
  trail,
  titlePrefix,
  titleAccent,
  subtitle,
  children,
  showBeams = true,
}: {
  lead?: string;
  trail?: string;
  titlePrefix?: string;
  titleAccent?: string;
  subtitle?: string;
  children?: React.ReactNode;
  showBeams?: boolean;
}) {
  const headerRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const resolvedLead = lead ?? (titlePrefix ? `${titlePrefix} ` : '');
  const resolvedTrail = trail ?? titleAccent ?? '';

  useIsomorphicLayoutEffect(() => {
    if (!headerRef.current || !parallaxRef.current) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          mobile:
            '(prefers-reduced-motion: no-preference) and (max-width: 767px)',
          desktop:
            '(prefers-reduced-motion: no-preference) and (min-width: 768px)',
        },
        (context) => {
          if (!parallaxRef.current || !headerRef.current) return;
          const mobile = context.conditions?.mobile;
          gsap.to(parallaxRef.current, {
            y: mobile ? 36 : 72,
            ease: 'none',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={headerRef}
      className="relative z-0 mx-auto max-w-[1425px] px-6 pt-[clamp(132px,11vw,150px)] pb-[clamp(40px,5vw,70px)] md:px-8"
    >
      {showBeams ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[560px] w-screen -translate-x-1/2 overflow-hidden"
        >
          <ReactiveAuroraField className="size-full" disableCenterDimming={false} />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(78% 82% at 50% 28%, transparent 38%, color-mix(in srgb, var(--vv-bg) 52%, transparent) 78%, var(--vv-bg) 100%)',
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[150px]"
            style={{
              background:
                'linear-gradient(to bottom, transparent 0%, var(--vv-bg) 100%)',
            }}
          />
        </div>
      ) : null}
      <div ref={parallaxRef} className="will-change-transform">
        <SplitHeadingReveal triggerOnScroll={false}>
          <h1 className="text-center font-display text-[clamp(58px,11.2vw,160px)] leading-[1] font-medium tracking-[-0.05em]">
            {resolvedLead}
            <span
              className="vv-accent"
              style={
                /\s$/.test(resolvedLead) ? undefined : { marginLeft: '0.06em' }
              }
            >
              {resolvedTrail}
            </span>
          </h1>
        </SplitHeadingReveal>
        {subtitle ? (
          <p className="mx-auto mt-8 max-w-[640px] text-center text-lead leading-[1.6] text-fg-muted">
            {subtitle}
          </p>
        ) : null}
        {children}
      </div>
    </header>
  );
}

/**
 * ScrollTrigger.batch staggered reveal for cards (`y: 34`, `duration: 0.68`, `stagger: 0.08`, `start: 'top 92%'`).
 * Immediately reveals cards already in the initial viewport upon page navigation.
 */
export function RevealBatch({
  children,
  className,
  refresh,
  selector = '[data-reveal]',
  distance = 34,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  refresh?: unknown;
  selector?: string;
  distance?: number;
  stagger?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const scopeEl = containerRef.current;
    if (!scopeEl) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const items = gsap.utils.toArray<HTMLElement>(selector, scopeEl);
        if (!items.length) return;

        const winH = window.innerHeight;
        const inViewItems: HTMLElement[] = [];
        const belowFoldItems: HTMLElement[] = [];

        items.forEach((item) => {
          const rect = item.getBoundingClientRect();
          if (rect.top < winH * 0.95) {
            inViewItems.push(item);
          } else {
            belowFoldItems.push(item);
          }
        });

        if (inViewItems.length) {
          gsap.fromTo(
            inViewItems,
            { y: distance, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              delay: 0.05,
              ease: 'power3.out',
              stagger,
              overwrite: true,
              clearProps: 'transform,opacity',
            }
          );
        }

        if (!belowFoldItems.length) return;

        gsap.set(belowFoldItems, { y: distance, opacity: 0 });
        const triggers = ScrollTrigger.batch(belowFoldItems, {
          start: 'top 92%',
          onEnter: (batch) =>
            gsap.to(batch, {
              y: 0,
              opacity: 1,
              duration: 0.68,
              ease: 'power3.out',
              stagger,
              overwrite: true,
              clearProps: 'transform,opacity',
            }),
        });
        return () => triggers.forEach((t) => t.kill());
      });
    }, containerRef);

    return () => ctx.revert();
  }, [refresh, selector, distance, stagger]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

/**
 * ScrollTrigger staggered reveal for [data-reveal] elements inside a container.
 * Immediately reveals elements already in viewport upon navigation.
 */
export function RevealGroup({
  children,
  className,
  y = 26,
  stagger = 0.08,
  start = 'top 86%',
  duration = 0.7,
  refreshOnComplete = false,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  stagger?: number;
  start?: string;
  duration?: number;
  refreshOnComplete?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const scopeEl = containerRef.current;
    if (!scopeEl) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', scopeEl);
        if (items.length) {
          const rect = scopeEl.getBoundingClientRect();
          const alreadyInView = rect.top < window.innerHeight * 0.92;

          gsap.fromTo(
            items,
            { y, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration,
              delay: alreadyInView ? 0.05 : 0,
              ease: 'power3.out',
              stagger,
              scrollTrigger: alreadyInView
                ? undefined
                : {
                    trigger: scopeEl,
                    start,
                  },
              clearProps: 'transform,opacity',
              onComplete: refreshOnComplete
                ? () => ScrollTrigger.refresh()
                : undefined,
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [y, stagger, start, duration, refreshOnComplete]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

/**
 * Mobile category dropdown menu with glass trigger, count, specular line, radial lift, and keyboard nav.
 */
export function MobileCategoryMenu({
  options,
  active,
  onSelect,
  label,
  eyebrow = 'Category',
  className = '',
}: {
  options: Array<{ key: string; label: string; count?: number; href?: string }>;
  active: string;
  onSelect?: (key: string) => void;
  label: string;
  eyebrow?: string;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number>(0);
  const menuId = useId();

  const currentOption =
    options.find((opt) => opt.key === active) ?? options[0];

  const openMenu = () => {
    window.clearTimeout(timerRef.current);
    setMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    window.setTimeout(() => setVisible(true), 60);
  };

  const closeMenu = (restoreFocus = false) => {
    setVisible(false);
    timerRef.current = window.setTimeout(() => setMounted(false), 200);
    if (restoreFocus) {
      triggerRef.current?.focus();
    }
  };

  useEffect(() => {
    if (!mounted) return;
    const handleOutside = (e: Event) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener('pointerdown', handleOutside);
    document.addEventListener('focusin', handleOutside);
    return () => {
      document.removeEventListener('pointerdown', handleOutside);
      document.removeEventListener('focusin', handleOutside);
    };
  }, [mounted]);

  useEffect(() => {
    if (!visible) return;
    const items = menuRef.current?.querySelectorAll<HTMLElement>(
      '[role="menuitemradio"]'
    );
    const activeIdx = Math.max(
      0,
      options.findIndex((o) => o.key === active)
    );
    items?.[activeIdx]?.focus({ preventScroll: true });
  }, [visible, options, active]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const getItemClass = (isSelected: boolean) =>
    `flex h-[46px] w-full items-center gap-3 rounded-[9px] px-3.5 text-left text-[15px] leading-none transition-colors focus-visible:bg-fg/6 focus-visible:text-fg focus-visible:outline-none ${
      isSelected
        ? 'bg-fg/6 font-medium text-fg'
        : 'text-fg-muted hover:bg-fg/5 hover:text-fg active:bg-fg/8'
    }`;

  const renderItemContent = (
    opt: { key: string; label: string; count?: number },
    isSelected: boolean
  ) => (
    <>
      <span
        aria-hidden="true"
        className={`size-1.5 shrink-0 rounded-full transition-colors ${
          isSelected ? 'bg-blue-500' : 'bg-transparent'
        }`}
      />
      <span className="min-w-0 flex-1 truncate">{opt.label}</span>
      {opt.count !== undefined ? (
        <span className="text-[13px] text-fg-subtle tabular-nums">
          {opt.count}
        </span>
      ) : null}
    </>
  );

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={mounted}
        aria-controls={menuId}
        aria-label={label}
        onClick={() => (mounted ? closeMenu() : openMenu())}
        onKeyDown={(e) => {
          if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !mounted) {
            e.preventDefault();
            openMenu();
          }
        }}
        className={`group relative flex h-12 w-full items-center gap-3 overflow-hidden rounded-[10px] border bg-[var(--vv-glass-card)] px-5 text-left backdrop-blur-[12px] transition-colors focus-visible:outline-none ${
          mounted
            ? 'border-fg/35'
            : 'border-fg/12 hover:border-fg/25 focus-visible:border-fg/60'
        }`}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(70% 70% at 50% 0%, var(--vv-card-lift) 0%, transparent 70%)',
          }}
        />
        <span className="relative shrink-0 text-[11px] leading-none font-medium tracking-[0.14em] text-fg-subtle uppercase">
          {eyebrow}
        </span>
        <span className="relative min-w-0 flex-1 truncate text-[15px] leading-none font-medium text-fg">
          {currentOption.label}
        </span>
        {currentOption.count !== undefined ? (
          <span className="relative text-[13px] leading-none text-fg-subtle tabular-nums">
            {currentOption.count}
          </span>
        ) : null}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={`relative size-4 shrink-0 text-fg-muted transition-transform duration-300 ease-brand ${
            mounted ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {mounted ? (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={(e) => {
            const nodes = menuRef.current
              ? [
                  ...menuRef.current.querySelectorAll<HTMLElement>(
                    '[role="menuitemradio"]'
                  ),
                ]
              : [];
            const len = nodes.length;
            const idx = nodes.indexOf(document.activeElement as HTMLElement);
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              e.preventDefault();
              const nextIdx =
                e.key === 'ArrowDown' ? (idx + 1) % len : (idx - 1 + len) % len;
              nodes[nextIdx]?.focus();
            } else if (e.key === 'Home') {
              e.preventDefault();
              nodes[0]?.focus();
            } else if (e.key === 'End') {
              e.preventDefault();
              nodes[len - 1]?.focus();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              closeMenu(true);
            } else if (e.key === 'Tab') {
              closeMenu();
            }
          }}
          className={`absolute inset-x-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-[14px] border p-1.5 backdrop-blur-[22px] transition-[opacity,translate] duration-[220ms] ease-brand motion-reduce:transition-none ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
          style={{
            background: 'color-mix(in srgb, var(--vv-bg) 86%, transparent)',
            borderColor: 'var(--vv-card-border)',
            boxShadow: 'var(--vv-pop-shadow)',
          }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-1/2 h-px w-[240px] max-w-[80%] -translate-x-1/2"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, var(--vv-card-line) 50%, transparent 100%)',
            }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(58% 46% at 50% 0%, var(--vv-card-lift) 0%, var(--vv-card-lift-mid) 45%, transparent 78%)',
            }}
          />
          <ul className="relative max-h-[60vh] overflow-y-auto">
            {options.map((opt) => {
              const isSelected = opt.key === active;
              return (
                <li key={opt.key}>
                  {opt.href && !onSelect ? (
                    <Link
                      href={opt.href}
                      role="menuitemradio"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      className={getItemClass(isSelected)}
                      onClick={() => closeMenu()}
                    >
                      {renderItemContent(opt, isSelected)}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      className={getItemClass(isSelected)}
                      onClick={() => {
                        onSelect?.(opt.key);
                        closeMenu(true);
                      }}
                    >
                      {renderItemContent(opt, isSelected)}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Category filter bar (mobile dropdown + desktop kinetic SplitRollText tablist).
 */
export function CategoryFilterBar({
  categories,
  counts,
  active,
  onSelect,
  label,
}: {
  categories: string[];
  counts: Record<string, number>;
  active: string;
  onSelect: (cat: string) => void;
  label: string;
}) {
  return (
    <div className="relative z-10 mx-auto max-w-[1425px] px-6 pb-[clamp(32px,4vw,56px)] md:px-8">
      <MobileCategoryMenu
        className="mx-auto w-full max-w-[380px] md:hidden"
        label={label}
        active={active}
        onSelect={onSelect}
        options={categories.map((cat) => ({
          key: cat,
          label: cat,
          count: counts?.[cat],
        }))}
      />

      <div
        role="tablist"
        aria-label={label}
        className="-m-1 hidden text-center [text-wrap:balance] md:block"
      >
        {categories.map((cat) => {
          const isSelected = active === cat;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelect(cat)}
              className={`m-1 inline-block h-[34px] cursor-pointer rounded-[10px] border px-4 align-middle text-[15px] leading-none font-medium transition-colors ${
                isSelected
                  ? 'border-transparent bg-fg text-bg'
                  : 'border-line bg-bg text-fg-muted hover:border-line-strong hover:text-fg'
              }`}
            >
              <SplitRollText text={cat} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 3-column responsive grid wrapper matching the Services page layout
 * used across Works, Products (Templates), and Blog index pages.
 */
export function ThreeColFlexGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1425px] px-6 pb-[clamp(80px,10vw,140px)] md:px-8">
      <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:[&>*:last-child:nth-child(3n+1)]:col-start-2">
        {children}
      </div>
    </div>
  );
}

/**
 * Theme-aware Section 04 LightPillar WebGL backdrop used on inner sections.
 */
export function ServicesCoilBackdrop({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`pointer-events-none overflow-hidden ${className}`}>
      <LightPillar
        className="size-full"
        topColor="#0066FF"
        bottomColor="#7C3AED"
        pillarWidth={4.8}
        pillarHeight={0.4}
        intensity={0.95}
        glowAmount={0.003}
        rotationSpeed={0.3}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(65% 62% at 50% 46%, transparent 32%, color-mix(in srgb, var(--vv-bg) 54%, transparent) 68%, var(--vv-bg) 96%)',
        }}
      />
    </div>
  );
}

/**
 * Clean, zero-lag static editorial icon grid replacing the heavy 3D floating sphere canvas.
 */
export function IconCloud({
  images,
  size = 210,
}: {
  images: string[];
  size?: number;
}) {
  const visibleIcons = images.slice(0, 12);
  return (
    <div
      aria-hidden="true"
      style={{ width: size, height: size }}
      className="grid grid-cols-4 place-items-center gap-2.5 p-3"
    >
      {visibleIcons.map((src, idx) => (
        <div
          key={`${src}-${idx}`}
          className="flex size-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 p-1.5 shadow-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            width={22}
            height={22}
            className="size-5 object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
      ))}
    </div>
  );
}
