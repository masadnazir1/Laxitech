'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { SplitRollText } from '@/components/ui/SplitRollText';
import { useHydrated } from '@/lib/browserState';
import {
  SplitHeadingReveal,
  RevealGroup,
} from '@/components/ui/PagePrimitives';

interface IntroStockVisual {
  src: string;
  alt: string;
}

const ROW_1_IMAGES: IntroStockVisual[] = [
  { src: '/snapshots/vixion.png', alt: 'Vixion Studio Flagship Platform' },
  { src: '/snapshots/superluxuries.png', alt: 'SuperLuxuries Atelier & Admin Store' },
  { src: '/snapshots/movixstudio-2.png', alt: 'Movix Studio HD Video Production Platform' },
  { src: '/snapshots/commercelions.png', alt: 'Commerce Lions Cohort & Member Portal' },
  { src: '/snapshots/macvision.png', alt: 'MacVision Store & Bulk Price Dashboard' },
  { src: '/snapshots/vixion-2.png', alt: 'Vixion Studio Interactive Pricing Matrix' },
  { src: '/snapshots/superluxuries-2.png', alt: 'SuperLuxuries VIP Concierge Showcase' },
  { src: '/snapshots/movixstudio-3.png', alt: 'Movix Studio Showreel Architecture' },
];

const ROW_2_IMAGES: IntroStockVisual[] = [
  { src: '/snapshots/commercelions-2.png', alt: 'Commerce Lions Student Dashboard' },
  { src: '/snapshots/macvision-2.png', alt: 'MacVision Store Product Catalog' },
  { src: '/snapshots/vixion-3.png', alt: 'Vixion Studio Case Study System' },
  { src: '/snapshots/superluxuries-3.png', alt: 'SuperLuxuries 4K Product Gallery' },
  { src: '/snapshots/movixstudio-4.png', alt: 'Movix Studio Global Production Grid' },
  { src: '/snapshots/commercelions-3.png', alt: 'Commerce Lions Mentorship Modules' },
  { src: '/snapshots/macvision-3.png', alt: 'MacVision Store WhatsApp Checkout' },
  { src: '/snapshots/vixion-4.png', alt: 'Vixion Studio Custom Web Engineering' },
  { src: '/snapshots/superluxuries-4.png', alt: 'SuperLuxuries Luxury Brand Experience' },
];

const ROW_3_IMAGES: IntroStockVisual[] = [
  { src: '/snapshots/movixstudio-1.png', alt: 'Movix Studio Hero Stage' },
  { src: '/snapshots/commercelions-4.png', alt: 'Commerce Lions Verified Member Access' },
  { src: '/snapshots/macvision-4.png', alt: 'MacVision Store Admin Controls' },
  { src: '/intro/service-01-websites.webp', alt: 'CYNEX Custom Web Engineering' },
  { src: '/intro/service-02-dashboard.webp', alt: 'CYNEX 1-Click Admin Dashboard' },
  { src: '/intro/service-03-ecommerce.webp', alt: 'CYNEX eCommerce & WhatsApp Store' },
  { src: '/snapshots/vixion-1.png', alt: 'Vixion Studio Digital Flagship' },
  { src: '/snapshots/superluxuries-1.png', alt: 'SuperLuxuries Boutique Storefront' },
];

export function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);
  const [imagesInView, setLoadImages] = useState(false);
  const hydrated = useHydrated();
  const loadImages = imagesInView || (hydrated && typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setLoadImages(true);
            io.disconnect();
          }
        },
        { rootMargin: '700px 0px' }
      );
      io.observe(el);
    }

    let ticking = false;
    const updateTransforms = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
        const r1X = -100 - p * 360;
        const r2X = -580 + p * 360;
        const r3X = -120 - p * 280;

        if (row1Ref.current) {
          row1Ref.current.style.transform = `translate3d(${r1X.toFixed(1)}px, 0, 0)`;
        }
        if (row2Ref.current) {
          row2Ref.current.style.transform = `translate3d(${r2X.toFixed(1)}px, 0, 0)`;
        }
        if (row3Ref.current) {
          row3Ref.current.style.transform = `translate3d(${r3X.toFixed(1)}px, 0, 0)`;
        }
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateTransforms);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateTransforms();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="intro-section"
      aria-labelledby="intro-heading"
      className="relative isolate z-10 bg-bg overflow-hidden"
      style={{
        height: '820px',
      }}
    >
      {/* ─── Layer 1: 100vw Full-Bleed 3 Sliding Horizontal Rows Across Entire Screen ─── */}
      <div className="absolute inset-0 w-screen left-1/2 -translate-x-1/2 h-full flex flex-col justify-between overflow-hidden" style={{ gap: '8px' }}>
        
        {/* Row 1: Scroll-Scrubbed Left */}
        <div className="flex min-h-0 flex-1 overflow-hidden" style={{ paddingLeft: '120px' }}>
          <div
            ref={row1Ref}
            className="intro-track flex h-full w-max shrink-0 will-change-transform"
            style={{
              gap: '8px',
              transform: 'translate3d(-100px, 0, 0)',
              transition: 'transform 0.1s cubic-bezier(0, 0, 0.2, 1)',
            }}
          >
            {ROW_1_IMAGES.map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`r1-${i}`}
                src={loadImages ? img.src : undefined}
                alt={img.alt}
                width={720}
                height={540}
                loading="lazy"
                decoding="async"
                className="h-full w-auto shrink-0 rounded-md bg-surface object-cover"
                style={{ aspectRatio: '4 / 3' }}
              />
            ))}
          </div>
        </div>

        {/* Row 2: Scroll-Scrubbed Right */}
        <div className="flex min-h-0 flex-1 overflow-hidden" style={{ paddingLeft: '450px' }}>
          <div
            ref={row2Ref}
            className="intro-track flex h-full w-max shrink-0 will-change-transform"
            style={{
              gap: '8px',
              transform: 'translate3d(-580px, 0, 0)',
              transition: 'transform 0.1s cubic-bezier(0, 0, 0.2, 1)',
            }}
          >
            {ROW_2_IMAGES.map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`r2-${i}`}
                src={loadImages ? img.src : undefined}
                alt={img.alt}
                width={720}
                height={540}
                loading="lazy"
                decoding="async"
                className="h-full w-auto shrink-0 rounded-md bg-surface object-cover"
                style={{ aspectRatio: '4 / 3' }}
              />
            ))}
          </div>
        </div>

        {/* Row 3: Scroll-Scrubbed Left Slow */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div
            ref={row3Ref}
            className="intro-track flex h-full w-max shrink-0 will-change-transform"
            style={{
              gap: '8px',
              transform: 'translate3d(-120px, 0, 0)',
              transition: 'transform 0.1s cubic-bezier(0, 0, 0.2, 1)',
            }}
          >
            {ROW_3_IMAGES.map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`r3-${i}`}
                src={loadImages ? img.src : undefined}
                alt={img.alt}
                width={720}
                height={540}
                loading="lazy"
                decoding="async"
                className="h-full w-auto shrink-0 rounded-md bg-surface object-cover"
                style={{ aspectRatio: '4 / 3' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ─── Layer 2A: Top & Bottom Seamless Radial Blend Mask Across Entire Viewport ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full"
        style={{
          background:
            'radial-gradient(120% 96% at 50% 0%, transparent 74%, color-mix(in srgb, var(--vv-bg) 8%, transparent) 80.5%, color-mix(in srgb, var(--vv-bg) 28%, transparent) 87.0%, color-mix(in srgb, var(--vv-bg) 62%, transparent) 92.7%, color-mix(in srgb, var(--vv-bg) 88%, transparent) 96.9%, var(--vv-bg) 100%)',
        }}
      />

      {/* ─── Layer 2B: Desktop Circular 700px Layer-Blur Shield Over Left Side (Theme-Adaptive) ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 bottom-0 left-[-50vw] right-[-50vw] hidden md:block"
        style={{
          background:
            'radial-gradient(700px circle at calc(50vw + 175px) 200px, var(--vv-bg) 0%, var(--vv-bg) 41%, color-mix(in srgb, var(--vv-bg) 72%, transparent) 58%, color-mix(in srgb, var(--vv-bg) 38%, transparent) 74%, color-mix(in srgb, var(--vv-bg) 12%, transparent) 88%, transparent 100%)',
        }}
      />

      {/* ─── Layer 2C: Mobile Circular 430px Layer-Blur Shield ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 bottom-0 left-[-50vw] right-[-50vw] md:hidden"
        style={{
          background:
            'radial-gradient(430px circle at calc(50vw + 175px) 200px, color-mix(in srgb, var(--vv-bg) 90%, transparent) 0%, color-mix(in srgb, var(--vv-bg) 84%, transparent) 30%, color-mix(in srgb, var(--vv-bg) 56%, transparent) 56%, color-mix(in srgb, var(--vv-bg) 26%, transparent) 76%, color-mix(in srgb, var(--vv-bg) 8%, transparent) 90%, transparent 100%)',
        }}
      />

      {/* ─── Layer 3: Foreground Headline, Paragraph & Kinetic Roll Buttons (1440px Centered) ─── */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-start pt-[120px]">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <RevealGroup className="intro-copy pointer-events-auto max-w-[560px]">
            <SplitHeadingReveal triggerOnScroll={true}>
              <h2
                id="intro-heading"
                className="font-display text-[clamp(34px,4vw,52px)] leading-[1.1] font-medium tracking-tight md:whitespace-nowrap text-fg"
              >
                Architecting the Era of<br />
                Digital Reliability.
              </h2>
            </SplitHeadingReveal>
            <p data-reveal className="mt-4 max-w-[440px] text-lead text-fg-muted">
              Laxitech was founded on a simple premise: enterprise systems should be rock-solid, lightning-fast, and built to adapt. We engineer high-throughput cloud environments and resilient custom software.
            </p>
            <div data-reveal className="mt-6 flex flex-wrap gap-3">
              <Link
                prefetch={true}
                className="inline-flex items-center rounded-[12px] border border-transparent bg-fg px-[18px] py-[10px] text-[14px] leading-none font-medium text-bg transition-colors hover:bg-fg-strong shadow-md"
                href="/about-us"
              >
                <SplitRollText text="About Us" />
              </Link>
              <Link
                prefetch={true}
                className="inline-flex items-center rounded-[12px] border border-line-strong px-[18px] py-[10px] text-[14px] leading-none font-medium text-fg transition-colors hover:border-line hover:bg-fg/[0.05]"
                href="/services"
              >
                <SplitRollText text="Explore Services" />
              </Link>
            </div>
          </RevealGroup>
        </div>
      </div>

      {/* ─── Layer 4: Bottom 180px Seamless Blend Dissolve into Section 4 ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[180px]"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--vv-bg) 75%, transparent) 60%, var(--vv-bg) 100%)',
        }}
      />
    </section>
  );
}
