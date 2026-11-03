'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LightPillar } from '@/components/ui/LightPillar';
import {
  SplitHeadingReveal,
  RevealGroup,
} from '@/components/ui/PagePrimitives';

interface Testimonial {
  id: string;
  stars: number;
  quote: string;
  author: string;
  role: string;
  avatar?: string;
  monogram?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '01',
    stars: 5,
    quote:
      'Laxitech re-architected our core platform into a resilient multi-cloud environment on AWS and Kubernetes. Our cloud expenditure dropped 38% while achieving an uninterrupted 99.99% SLA uptime under peak enterprise traffic.',
    author: 'Fintech Core Infrastructure',
    role: 'Enterprise Cloud Deployment • Multi-Region AWS & K8s',
    monogram: 'FC',
  },
  {
    id: '02',
    stars: 5,
    quote:
      'Deploying our production workloads on Laxitech’s Pakistan Hosted VPS with NVMe gave us sub-5ms local latency, seamless PKR billing, and rock-solid automated snapshots. Their 24/7 technical responsiveness is unparalleled.',
    author: 'Apex Digital Systems',
    role: 'High-Throughput Digital Network • Pakistan Edge Cloud',
    monogram: 'AD',
  },
  {
    id: '03',
    stars: 5,
    quote:
      'Laxitech guided our organization through ISO 27001 accreditation and established zero-trust access controls across our distributed infrastructure. Their automated DevSecOps pipelines eliminated all manual deployment risk.',
    author: 'HealthSync Enterprise',
    role: 'ISO 27001 & SOC 2 Compliant Healthcare Cloud',
    monogram: 'HS',
  },
];

export function TestimonialsSection() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isIntersectingRef = useRef(false);

  // ─── Stat Counter State ───
  const [uptimeCount, setUptimeCount] = useState('99.99%');
  const [projectsCount, setProjectsCount] = useState(150);
  const [supportLabel, setSupportLabel] = useState('24/7');

  // ─── 7-Second Auto-Advance with Hover Pause ───
  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      if (isIntersectingRef.current) {
        setCurrentIdx((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
      }
    }, 7000);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  // ─── Intersection Observer for Animated Number Counters ───
  useEffect(() => {
    let triggered = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !triggered) {
          triggered = true;

          // Stat 1: 99.99% Cloud SLA Uptime
          setUptimeCount('99.99%');

          // Stat 2: 0 -> 150 (Projects Shipped)
          let p = 0;
          setProjectsCount(0);
          const pTimer = setInterval(() => {
            p += 5;
            setProjectsCount(p);
            if (p >= 150) {
              setProjectsCount(150);
              clearInterval(pTimer);
            }
          }, 40);

          // Stat 3: 24/7 Support
          setSupportLabel('24/7');
        }
      },
      { rootMargin: '100px 0px', threshold: 0.15 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      ref={containerRef}
      className="relative isolate z-10 overflow-hidden bg-bg py-[clamp(80px,9vw,120px)]"
    >
      {/* ─── Section 04 LightPillar Animated Background (Electric Blue + Electric Purple) ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
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
      </div>

      {/* Radial Soft Dissolve Mask */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(62% 62% at 50% 42%, transparent 32%, color-mix(in srgb, var(--vv-bg) 55%, transparent) 68%, var(--vv-bg) 96%)',
        }}
      />

      <div className="mx-auto max-w-[1380px] px-6 md:px-8">
        
        {/* Giant Centered Headline */}
        <SplitHeadingReveal triggerOnScroll={true}>
          <h2
            id="testimonials-heading"
            className="text-center font-display text-[clamp(46px,9vw,132px)] leading-[1] font-medium tracking-[-0.05em] text-fg"
          >
            Client <span className="vv-accent">Results</span>
          </h2>
        </SplitHeadingReveal>

        {/* Testimonials Stage */}
        <RevealGroup className="vv-quote-stage relative mt-7 md:mt-[clamp(-44px,-3vw,-18px)]">
          <div className="mx-auto grid max-w-[1120px] gap-4 lg:grid-cols-12">

            {/* ══════════════════════════════════════════════
                LEFT STATS CARD (4 Cols): 5 / 10 / 4
               ══════════════════════════════════════════════ */}
            <div
              data-reveal="true"
              className="relative overflow-hidden rounded-[12px] border backdrop-blur-[12px] order-2 flex flex-col justify-between gap-8 p-8 lg:order-1 lg:col-span-4 lg:gap-10 lg:p-10"
              style={{
                background: 'color-mix(in srgb, var(--vv-bg) 42%, transparent)',
                borderColor: 'var(--vv-card-border)',
              }}
            >
              {/* Horizon Line Highlight */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-1/2 h-px w-[420px] max-w-[80%] -translate-x-1/2"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, var(--vv-card-line) 50%, transparent 100%)',
                }}
              />
              {/* Radial Ambient Lift */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[12px]"
                style={{
                  background:
                    'radial-gradient(58% 46% at 50% 0%, color-mix(in srgb, var(--vv-card-lift) 62%, transparent) 0%, color-mix(in srgb, var(--vv-card-lift-mid) 62%, transparent) 45%, transparent 78%)',
                }}
              />

              {/* Stat 1: 99.99% */}
              <div className="relative">
                <div className="flex items-start font-display text-[clamp(40px,4.4vw,60px)] leading-[0.9] font-medium tracking-[-0.045em] text-fg">
                  <span className="vv-stat-value tabular-nums">{uptimeCount}</span>
                </div>
                <div className="mt-2 text-body-s text-fg-muted">Cloud SLA Uptime Guarantee</div>
              </div>

              {/* Stat 2: 150+ */}
              <div className="relative">
                <div className="flex items-start font-display text-[clamp(40px,4.4vw,60px)] leading-[0.9] font-medium tracking-[-0.045em] text-fg">
                  <span className="vv-stat-value tabular-nums">{projectsCount}+</span>
                </div>
                <div className="mt-2 text-body-s text-fg-muted">Enterprise Projects Shipped</div>
              </div>

              {/* Stat 3: 24/7 */}
              <div className="relative">
                <div className="flex items-start font-display text-[clamp(40px,4.4vw,60px)] leading-[0.9] font-medium tracking-[-0.045em] text-fg">
                  <span className="vv-stat-value tabular-nums">{supportLabel}</span>
                </div>
                <div className="mt-2 text-body-s text-fg-muted">Active Operations &amp; Support</div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════
                RIGHT TESTIMONIALS CAROUSEL CARD (8 Cols)
               ══════════════════════════════════════════════ */}
            <div
              data-reveal="true"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="relative overflow-hidden rounded-[12px] border backdrop-blur-[12px] order-1 flex flex-col justify-between p-8 sm:p-10 lg:order-2 lg:col-span-8 lg:p-12 min-h-[380px]"
              style={{
                background: 'color-mix(in srgb, var(--vv-bg) 42%, transparent)',
                borderColor: 'var(--vv-card-border)',
              }}
            >
              {/* Horizon Line Highlight */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-1/2 h-px w-[420px] max-w-[80%] -translate-x-1/2"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, var(--vv-card-line) 50%, transparent 100%)',
                }}
              />
              {/* Radial Ambient Lift */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[12px]"
                style={{
                  background:
                    'radial-gradient(58% 46% at 50% 0%, color-mix(in srgb, var(--vv-card-lift) 62%, transparent) 0%, color-mix(in srgb, var(--vv-card-lift-mid) 62%, transparent) 45%, transparent 78%)',
                }}
              />

              {/* Card Header: 01 / 03 and Double Quote SVG */}
              <div className="relative flex items-center justify-between gap-6">
                <div>
                  <p className="text-body-s tracking-[0.06em] text-fg-muted tabular-nums">
                    <span className="text-fg" aria-live="polite">
                      {currentIdx + 1 < 10 ? `0${currentIdx + 1}` : currentIdx + 1}
                    </span>{' '}
                    <span aria-hidden="true">/ 03</span>
                  </p>
                  <span
                    aria-hidden="true"
                    className="mt-2.5 block h-px w-14"
                    style={{ background: 'var(--vv-card-rule)' }}
                  />
                </div>

                {/* Double Quote SVG */}
                <svg
                  viewBox="0 0 44 32"
                  className="h-[clamp(20px,2.2vw,28px)] w-auto shrink-0 text-fg opacity-30"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18 4v10c0 7.7-4.6 12.9-11.4 14.9L5 25.6c3.6-1.3 5.8-3.7 6.4-6.6H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h12Z" />
                  <path
                    d="M18 4v10c0 7.7-4.6 12.9-11.4 14.9L5 25.6c3.6-1.3 5.8-3.7 6.4-6.6H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h12Z"
                    transform="translate(24 0)"
                  />
                </svg>
              </div>

              {/* Quote Body with Cross-Fade */}
              <div className="relative mt-8 grid min-h-[clamp(210px,20vw,268px)] grid-cols-1">
                {TESTIMONIALS.map((t, idx) => {
                  const isActive = idx === currentIdx;
                  return (
                    <figure
                      key={t.id}
                      style={{ gridArea: '1 / 1' }}
                      aria-hidden={!isActive}
                      className={`flex h-full flex-col transition-opacity duration-500 ease-brand ${
                        isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
                      }`}
                    >
                      {/* 5 Filled Amber Stars */}
                      <div className="flex items-center gap-2.5">
                        <div aria-hidden="true" className="flex gap-1">
                          {[...Array(5)].map((_, starIdx) => (
                            <svg
                              key={starIdx}
                              viewBox="0 0 24 24"
                              className="size-[17px] text-amber"
                              fill="currentColor"
                            >
                              <path d="M12 2.6l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3-5.6-3.3-5.6 3.3 1.4-6.3L3 9.1l6.4-.6L12 2.6Z" />
                            </svg>
                          ))}
                        </div>
                        <span className="sr-only">5 out of 5</span>
                      </div>

                      {/* Quote Text */}
                      <blockquote className="mt-auto font-display text-[clamp(18px,1.7vw,25px)] leading-[1.4] font-medium tracking-[-0.02em] text-fg pt-6">
                        “{t.quote}”
                      </blockquote>

                      {/* Author Figcaption */}
                      <figcaption className="mt-7 flex items-center gap-3.5 sm:pr-24">
                        {t.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={t.avatar}
                            alt={t.author}
                            width={48}
                            height={48}
                            className="size-12 shrink-0 rounded-full bg-surface object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="grid size-12 shrink-0 place-items-center rounded-full border border-line bg-surface font-display text-[17px] font-medium text-fg-muted"
                          >
                            {t.monogram}
                          </span>
                        )}
                        <span className="min-w-0">
                          <span className="block truncate text-[15px] font-medium tracking-[0.02em] text-fg uppercase">
                            {t.author}
                          </span>
                          <span className="block text-body-s text-fg-muted sm:truncate">
                            {t.role}
                          </span>
                        </span>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>

              {/* Prev / Next Navigation Arrows */}
              <div className="mt-6 flex items-center justify-end gap-2 sm:absolute sm:right-8 sm:bottom-8 sm:mt-0 lg:right-11 lg:bottom-11">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous testimonial"
                  className="grid size-10 place-items-center rounded-[10px] border border-line text-fg-muted transition-colors hover:bg-surface hover:text-fg active:scale-95 cursor-pointer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-[18px]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M15 6l-6 6 6 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next testimonial"
                  className="grid size-10 place-items-center rounded-[10px] border border-line text-fg-muted transition-colors hover:bg-surface hover:text-fg active:scale-95 cursor-pointer"
                >
                  <span className="rotate-180">
                    <svg
                      viewBox="0 0 24 24"
                      className="size-[18px]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M15 6l-6 6 6 6" />
                    </svg>
                  </span>
                </button>
              </div>

            </div>

          </div>
        </RevealGroup>

      </div>
    </section>
  );
}
