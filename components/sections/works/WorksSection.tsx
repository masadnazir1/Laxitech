'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FEATURED_WORKS } from '@/data/featuredWorks';
import { ShimmerCanvas } from '@/components/ui/ShimmerCanvas';
import { ShineBorder } from '@/components/ui/ShineBorder';
import { LightPillar } from '@/components/ui/LightPillar';
import { SnapshotScrollPreview } from '@/components/ui/SnapshotScrollPreview';
import {
  computePortfolioStageState,
  buildAppleScaleCardState,
  clamp,
  lerp,
  easeInOutCubic,
} from '@/lib/portfolioMotion';

const PORTFOLIO_ITEMS = FEATURED_WORKS.slice(0, 5);

export function WorksSection() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loadCovers, setLoadCovers] = useState(false);

  // Store interactive minimize/maximize state in refs so RAF loop stays 60fps with zero re-render lag
  const toggleAnimRef = useRef<{
    minimized: boolean;
    scaleFactor: number; // 1 = maximized, 0 = minimized to bottom
    targetFactor: number;
    animStartFactor: number;
    animStartTime: number;
    isAnimating: boolean;
  }>({
    minimized: false,
    scaleFactor: 1,
    targetFactor: 1,
    animStartFactor: 1,
    animStartTime: 0,
    isAnimating: false,
  });

  const startLoopRef = useRef<() => void>(() => {});

  useEffect(() => {
    const wrapEl = wrapRef.current;
    if (wrapEl && typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setLoadCovers(true);
            io.disconnect();
          }
        },
        { rootMargin: '900px 0px' }
      );
      io.observe(wrapEl);
    } else {
      setLoadCovers(true);
    }

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const total = PORTFOLIO_ITEMS.length;

    let currentP = 0;
    let targetP = 0;
    let rafId = 0;
    let isRunning = false;
    let lastActiveIdx = -1;

    // Measure live card dimensions
    let measuredW = 960;
    let measuredH = 480;

    const measureGeometry = () => {
      const sampleCard = cardRefs.current[0];
      if (sampleCard && sampleCard.offsetWidth > 0) {
        measuredW = sampleCard.offsetWidth;
        measuredH = sampleCard.offsetHeight;
      }
    };

    measureGeometry();

    const applyStageState = (p: number, now: number) => {
      // Advance interactive minimize/maximize toggle if active
      const tog = toggleAnimRef.current;
      if (tog.isAnimating) {
        const elapsed = now - tog.animStartTime;
        const duration = 520; // Apple Scale window transition duration
        const rawT = clamp(elapsed / duration, 0, 1);
        const easedT = easeInOutCubic(rawT);
        tog.scaleFactor = lerp(tog.animStartFactor, tog.targetFactor, easedT);
        if (rawT >= 1) {
          tog.scaleFactor = tog.targetFactor;
          tog.isAnimating = false;
        }
      }

      const state = computePortfolioStageState(
        p,
        total,
        measuredW,
        measuredH
      );

      if (state.activeIndex !== lastActiveIdx) {
        lastActiveIdx = state.activeIndex;
        setActiveIdx(state.activeIndex);
      }

      state.cards.forEach((baseCardState, i) => {
        const el = cardRefs.current[i];
        if (!el) return;

        // Apply interactive toggle to active card if minimizing
        let cState = baseCardState;
        if (i === state.activeIndex && (tog.isAnimating || tog.minimized)) {
          const effectiveU = baseCardState.genieT * tog.scaleFactor;
          cState = buildAppleScaleCardState(
            i,
            effectiveU,
            baseCardState.stackDepth,
            measuredW,
            measuredH
          );
        }

        const isSettled = cState.phase === 'settled';
        const isUnderneath = cState.stackDepth > 0.08;

        el.style.transform = cState.transformCss;
        el.style.willChange = isSettled ? 'auto' : 'transform, opacity';
        el.style.opacity = `${cState.opacity}`;
        el.style.visibility = cState.isVisible ? 'visible' : 'hidden';
        el.style.zIndex = `${cState.zIndex}`;
        el.style.pointerEvents = cState.isInteractive ? 'auto' : 'none';
        el.style.filter =
          cState.brightness < 0.99
            ? `brightness(${cState.brightness})`
            : 'none';
        el.dataset.stacked = isUnderneath ? 'true' : 'false';

        const innerBody = el.querySelector<HTMLElement>('.stk-body-wrap');
        if (innerBody) {
          const bodyOpacity = clamp(1 - cState.stackDepth * 2.4, 0, 1);
          innerBody.style.opacity = `${bodyOpacity}`;
        }
      });
    };

    if (reducedMotion) {
      applyStageState(0.20, performance.now());
      return;
    }

    const computeScrollTarget = () => {
      const wrap = wrapRef.current;
      if (!wrap) return 0;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const entryWindow = vh * 0.75;

      // As the section scrolls up into the viewport (rect.top: entryWindow -> 0),
      // advance progress from 0.08 to 0.20 so Card 1 is 100% settled the moment the sticky stage pins at top=0
      if (rect.top > 0) {
        if (rect.top >= entryWindow) return 0;
        const entryT = clamp(1 - rect.top / entryWindow, 0, 1);
        return lerp(0.08, 0.20, entryT);
      }

      const pinnedRunway = Math.max(1, wrap.offsetHeight - vh);
      const pinnedT = clamp(-rect.top / pinnedRunway, 0, 1);
      return lerp(0.20, 1.0, pinnedT);
    };

    // Initialize immediately
    targetP = computeScrollTarget();
    currentP = targetP;
    applyStageState(currentP, performance.now());

    const tick = (now: number) => {
      targetP = computeScrollTarget();
      const diff = targetP - currentP;
      const tog = toggleAnimRef.current;

      if (Math.abs(diff) > 0.0003 || tog.isAnimating) {
        currentP = lerp(currentP, targetP, 0.28);
        applyStageState(currentP, now);
        rafId = requestAnimationFrame(tick);
      } else {
        currentP = targetP;
        applyStageState(currentP, now);
        isRunning = false;
      }
    };

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    startLoopRef.current = startLoop;

    const handleScroll = () => {
      // If user scrolls while window was manually minimized, smoothly restore so scroll scrubbing stays natural
      const tog = toggleAnimRef.current;
      if (tog.minimized && !tog.isAnimating) {
        tog.minimized = false;
        tog.animStartFactor = tog.scaleFactor;
        tog.targetFactor = 1;
        tog.animStartTime = performance.now();
        tog.isAnimating = true;
      }
      startLoop();
    };

    const handleResize = () => {
      measureGeometry();
      startLoop();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="works-section"
      className="vv-sec relative z-20 w-full bg-bg text-fg"
      aria-label="Our Works Portfolio"
    >
      <PortfolioStackStyles />

      {/* ─── Pinned Scroll Track Wrapper (540svh for Apple Scale Card Deck Stacking) ─── */}
      <div
        id="stk-wrap"
        ref={wrapRef}
        className="relative w-full"
        style={{ height: '540svh' }}
      >
        {/* ─── Sticky 100vh Viewport Stage ─── */}
        <div
          ref={pinRef}
          className="stk-pin sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden pt-12 select-none sm:pt-16"
        >
          {/* Layer 1: Procedural WebGL Light Pillar Volumetric Column Stage */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          >
            <LightPillar
              className="size-full"
              topColor="#0066FF"
              bottomColor="#7C3AED"
              pillarWidth={4.8}
              pillarHeight={0.4}
              intensity={1.0}
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

          {/* Layer 2: Crisp White Section Backdrop Title Overlapping Top of Card (Matching Testimonials & Pricing) */}
          <div className="pointer-events-none absolute top-[9%] z-[1] text-center select-none sm:top-[6.5%]">
            <h2 className="font-display text-[clamp(54px,8.8vw,132px)] leading-none font-medium tracking-[-0.05em] text-fg">
              Selected <span className="vv-accent text-fg">Builds</span>
            </h2>
          </div>

          {/* Layer 3: Center Overlap Stage for the Stacked Portfolio Cards */}
          <div className="stk-stage pointer-events-none absolute inset-0 z-10">
            {PORTFOLIO_ITEMS.map((c, i) => {
              const cardNum = String(i + 1).padStart(2, '0');
              return (
                <article
                  key={c.slug}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  data-testid={`portfolio-stack-card-${i + 1}`}
                  className="stk-card group group/cell"
                  style={{
                    zIndex: (i + 1) * 10,
                  }}
                >
                  {/* 1. Interactive Perlin-Noise Pixel Dots Matrix on Hover */}
                  <ShimmerCanvas />

                  {/* 2. Traveling Specular Border Animation */}
                  <ShineBorder
                    borderWidth={1.5}
                    duration={3.2}
                    colors={['#0066FF', '#8B5CF6']}
                  />

                  {/* 3. High-Contrast Top Horizon Line & Controlled Ambient Lift (Exact Match to Testimonials & Pricing Cards) */}
                  <span
                    aria-hidden="true"
                    className="vv-portfolio-conic-border pointer-events-none absolute inset-0 rounded-[inherit]"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 left-1/2 h-px w-[460px] max-w-[85%] -translate-x-1/2"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent 0%, var(--vv-card-line) 50%, transparent 100%)',
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[inherit]"
                    style={{
                      background:
                        'radial-gradient(58% 46% at 50% 0%, color-mix(in srgb, var(--vv-card-lift) 68%, transparent) 0%, color-mix(in srgb, var(--vv-card-lift-mid) 64%, transparent) 45%, transparent 78%), radial-gradient(64% 58% at 24% 28%, rgba(0, 102, 255, 0.22) 0%, rgba(124, 58, 237, 0.16) 48%, transparent 82%)',
                    }}
                  />

                  {/* 4. Clean Editorial Top Header (Zero Fake macOS Traffic Lights) */}
                  <div className="relative z-10 flex items-center justify-between border-b border-line pb-3">
                    <span className="inline-flex items-center rounded-[8px] border border-line bg-fg/[0.05] px-3 py-1 font-sans text-[12px] font-medium text-fg-muted">
                      {c.category}
                    </span>

                    <div className="flex items-center gap-2 text-[12px] tracking-tight text-fg-muted tabular-nums">
                      <span className="font-medium text-fg">{cardNum}</span>
                      <span>/ {String(PORTFOLIO_ITEMS.length).padStart(2, '0')}</span>
                    </div>
                  </div>

                  {/* 5. Main Two-Column Card Body */}
                  <div className="stk-body-wrap relative z-10 flex min-h-0 flex-1 flex-col-reverse gap-4 pt-4 transition-opacity duration-200 md:flex-row md:gap-7 md:pt-5">
                    {/* Column 1: Editorial Copy & Clean Direct Actions */}
                    <div className="stk-col stk-copy">
                      <div>
                        <h3 className="font-display text-[clamp(26px,3.2vw,44px)] leading-[1.05] font-medium tracking-[-0.03em] text-fg">
                          <a
                            href={c.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pointer-events-auto transition-colors hover:text-white"
                          >
                            {c.title}{' '}
                            <span className="vv-accent">{c.titleAccent}</span>
                          </a>
                        </h3>

                        <p className="mt-3 line-clamp-3 max-w-[450px] text-xs leading-relaxed text-fg-muted sm:line-clamp-4 sm:text-sm md:text-[15px]">
                          {c.description}
                        </p>
                      </div>

                      {/* Editorial Case Study Link (Zero AI-Slop Buttons) */}
                      <div className="pointer-events-auto pt-3">
                        <Link
                          href={`/works/${c.slug}`}
                          className="group inline-flex items-center gap-2 font-sans text-xs font-medium tracking-wide text-fg-muted transition-colors hover:text-fg"
                        >
                          <span>Explore case study</span>
                          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                            →
                          </span>
                        </Link>
                      </div>
                    </div>

                    {/* Column 2: Cover Media Texture & 3-Second Live Scroll Preview */}
                    <div className="stk-col stk-media group/thumb relative overflow-hidden rounded-xl border border-line bg-card">
                      <a
                        href={c.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block h-full w-full cursor-pointer"
                        title={`Visit ${c.title} ${c.titleAccent}`}
                      >
                        {(i === 0 || loadCovers) && (
                          <SnapshotScrollPreview
                            slug={c.slug}
                            primaryImage={c.img}
                            title={`${c.title} ${c.titleAccent}`}
                            active={i === activeIdx}
                            priority={i === 0}
                            imageClassName="transition-transform duration-700 ease-brand group-hover/thumb:scale-105"
                          />
                        )}

                        {/* Subtle external link affordance on hover (Clean & Pill-Free) */}
                        <div className="pointer-events-none absolute top-3 right-3 z-20 flex size-8 items-center justify-center rounded-lg border border-white/20 bg-black/60 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover/thumb:opacity-100">
                          <svg
                            className="size-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7 17L17 7M17 7H9M17 7V15"
                            />
                          </svg>
                        </div>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function PortfolioStackStyles() {
  return (
    <style jsx global>{`
      .vv-portfolio-conic-border {
        padding: 1px;
        background: conic-gradient(
          from var(--vv-shine-a, 135deg),
          transparent 0deg,
          rgba(255, 255, 255, 0.35) 55deg,
          rgba(0, 102, 255, 0.55) 115deg,
          transparent 180deg,
          rgba(139, 92, 246, 0.50) 265deg,
          transparent 360deg
        );
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask: linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        mask-composite: exclude;
        -webkit-mask-composite: xor;
        opacity: 0.85;
        transition: opacity 0.3s ease;
      }

      .stk-card:hover .vv-portfolio-conic-border {
        opacity: 1;
      }

      .stk-card {
        position: absolute;
        top: 52%;
        left: 50%;
        width: 78%;
        max-width: 1060px;
        height: 66%;
        max-width: 1060px;
        max-height: 540px;
        min-height: 430px;
        display: flex;
        flex-direction: column;
        padding: 1.5rem 2rem 2rem;
        border-radius: 0.75rem;
        background: color-mix(in srgb, var(--vv-bg) 46%, rgba(5, 7, 18, 0.38));
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid var(--vv-card-border);
        color: var(--vv-text-primary);
        transform-origin: 50% 50%;
        will-change: transform, opacity;
        backface-visibility: hidden;
        overflow: hidden;
        box-shadow: 0 36px 90px -16px rgba(0, 0, 0, 0.92),
          0 0 0 1px rgba(255, 255, 255, 0.08);
        transition: filter 0.25s cubic-bezier(0.16, 1, 0.3, 1),
          background-color 0.25s ease;
      }

      .stk-card[data-stacked='true'] {
        background: color-mix(in srgb, var(--vv-bg) 88%, #050714);
      }

      [data-theme='light'] .stk-card {
        background: color-mix(in srgb, var(--vv-bg) 68%, rgba(255, 255, 255, 0.45));
        border: 1px solid var(--vv-card-border);
        box-shadow: 0 28px 70px -18px rgba(0, 0, 0, 0.22),
          0 0 0 1px rgba(0, 0, 0, 0.08);
      }

      [data-theme='light'] .stk-card[data-stacked='true'] {
        background: color-mix(in srgb, var(--vv-bg) 92%, #ffffff);
      }

      .stk-col {
        flex: 1;
        height: 100%;
        min-height: 0;
      }

      .stk-copy {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        pointer-events: auto;
      }

      .stk-media {
        border-radius: 0.85rem;
        overflow: hidden;
        position: relative;
        pointer-events: auto;
      }

      .stk-img {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center top;
        background-repeat: no-repeat;
      }

      @media (max-width: 1024px) {
        .stk-card {
          width: 88%;
          height: 70%;
          padding: 1.25rem 1.5rem 1.5rem;
        }
      }

      @media (max-width: 768px) {
        .stk-card {
          width: calc(100% - 2rem);
          height: 76%;
          max-height: 570px;
          padding: 1rem 1.15rem 1.25rem;
        }

        .stk-media {
          flex: 0.85;
          min-height: 165px;
        }

        .stk-copy {
          flex: 1;
        }
      }
    `}</style>
  );
}
