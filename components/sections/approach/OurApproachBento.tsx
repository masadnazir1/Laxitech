'use client';

import React from 'react';
import { ShineBorder } from '@/components/ui/ShineBorder';
import {
  SplitHeadingReveal,
  RevealGroup,
} from '@/components/ui/PagePrimitives';

export interface ProcessStep {
  title: string;
  description: string;
  accent?: 'coral' | 'ocean' | 'mint';
  image: string;
  domain: string;
}

export const DEFAULT_STEPS: ProcessStep[] = [
  {
    title: 'Technical Discovery',
    description:
      'System audit, requirements definition, tech stack selection, risk analysis, and infrastructure cost estimation.',
    accent: 'ocean',
    image: '/approach/dashboard.webp',
    domain: 'laxitech.com',
  },
  {
    title: 'Architectural Blueprint',
    description:
      'Multi-cloud topologies, microservice boundaries, data flow modeling, database schema, and threat modeling.',
    accent: 'coral',
    image: '/approach/panel.webp',
    domain: 'cloud.laxitech.com',
  },
  {
    title: 'Agile Development',
    description:
      'Sprint iterations, automated testing, continuous integration, peer code reviews, and bi-weekly demo environments.',
    accent: 'mint',
    image: '/approach/site-a.webp',
    domain: 'laxitech.com',
  },
  {
    title: 'Quality & Security QA',
    description:
      'Penetration testing, load testing, failover drills, and compliance verification against ISO 27001 and SOC 2.',
    accent: 'ocean',
    image: '/approach/site-b.webp',
    domain: 'laxitech.com',
  },
  {
    title: 'Zero-Downtime Launch & 24/7 Ops',
    description:
      'Blue/green deployments, round-the-clock infrastructure monitoring, automated backups, and 99.99% SLA uptime.',
    accent: 'coral',
    image: '/approach/site-c.webp',
    domain: 'cloud.laxitech.com',
  },
];

function TechnicalDiscoverySchematic() {
  return (
    <div className="relative mx-auto flex w-full max-w-[280px] flex-col rounded-[12px] border border-line bg-bg/80 p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-line pb-2.5">
        <span className="font-mono text-[11px] font-medium tracking-tight text-fg-muted">Discovery &amp; Audit</span>
        <span className="rounded-[4px] border border-[#0066FF]/30 bg-[#0066FF]/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#0066FF]">
          Phase 01
        </span>
      </div>
      <div className="my-3 space-y-2">
        <div className="flex items-center justify-between rounded-[8px] border border-line bg-surface/60 px-3 py-2 text-[12px]">
          <span className="text-fg-muted">Infrastructure Audit</span>
          <span className="font-mono text-[#0066FF]">Verified</span>
        </div>
        <div className="flex items-center justify-between rounded-[8px] border border-line bg-surface/60 px-3 py-2 text-[12px]">
          <span className="text-fg-muted">Topology Design</span>
          <span className="font-mono text-fg">Ready</span>
        </div>
        <div className="flex items-center justify-between rounded-[8px] border border-line bg-surface/60 px-3 py-2 text-[12px]">
          <span className="text-fg-muted">SLA &amp; Cost Estimation</span>
          <span className="font-mono text-emerald-400">Target 99.99%</span>
        </div>
      </div>
    </div>
  );
}

export function OurApproachBento(_props: { steps?: ProcessStep[] }) {
  return (
    <section
      id="approach"
      aria-labelledby="approach-heading"
      className="relative isolate z-10 overflow-hidden bg-bg py-[clamp(80px,9vw,135px)] text-fg"
    >
      <div className="mx-auto max-w-[1380px] px-6 md:px-8">
        {/* ─── Giant Centered Section Heading ─── */}
        <SplitHeadingReveal triggerOnScroll={true}>
          <h2
            id="approach-heading"
            className="text-center font-display text-[clamp(44px,8vw,118px)] leading-[1] font-medium tracking-[-0.05em]"
          >
            How We <span className="vv-accent">Deliver</span>
          </h2>
        </SplitHeadingReveal>

        {/* ─── 5-Card Architectural Bento Grid ─── */}
        <RevealGroup className="mt-8 md:mt-[clamp(-34px,-2.2vw,-12px)]">
          <div className="grid gap-5 lg:grid-cols-12">
            {/* ═════════════════════════════════════════════════════════════
                CARD 01 (4 Cols): Zero-Brief Discovery & Rapid Turnaround Dial
               ═════════════════════════════════════════════════════════════ */}
            <article
              data-reveal="true"
              className="group relative flex flex-col justify-between overflow-hidden rounded-[12px] border p-7 backdrop-blur-[12px] lg:col-span-4 lg:p-9"
              style={{
                background: 'color-mix(in srgb, var(--vv-bg) 48%, transparent)',
                borderColor: 'var(--vv-card-border)',
              }}
            >
              <ShineBorder />
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
                    'radial-gradient(62% 52% at 50% 0%, color-mix(in srgb, var(--vv-card-lift) 68%, transparent) 0%, transparent 78%)',
                }}
              />

              {/* Visual Stage: Technical Discovery Schematic */}
              <div className="relative z-10 flex min-h-[210px] items-center justify-center py-2">
                <TechnicalDiscoverySchematic />
              </div>

              <div className="relative z-10 mt-4">
                <h3 className="font-display text-[clamp(22px,2vw,26px)] leading-[1.15] font-medium tracking-[-0.03em] text-fg">
                  01. Technical Discovery
                </h3>
                <p className="mt-2 text-body-s leading-[1.6] text-fg-muted">
                  Comprehensive system audit, requirements definition, tech stack selection, risk analysis, and infrastructure cost estimation before code begins.
                </p>
              </div>
            </article>

            {/* ═════════════════════════════════════════════════════════════
                CARD 02 (4 Cols): Architectural Blueprint & Cloud Topologies
               ═════════════════════════════════════════════════════════════ */}
            <article
              data-reveal="true"
              className="group relative flex flex-col justify-between overflow-hidden rounded-[12px] border p-7 backdrop-blur-[12px] lg:col-span-4 lg:p-9"
              style={{
                background: 'color-mix(in srgb, var(--vv-bg) 48%, transparent)',
                borderColor: 'var(--vv-card-border)',
              }}
            >
              <ShineBorder />
              <span
                aria-hidden="true"
                className="vv-art-mobile pointer-events-none absolute inset-0 opacity-45 transition-transform duration-700 ease-brand group-hover:scale-105"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, color-mix(in srgb, var(--vv-bg) 20%, transparent) 0%, color-mix(in srgb, var(--vv-bg) 88%, transparent) 100%)',
                }}
              />

              {/* Single Focal Instrument: Interactive Spring Curve & Latency Metric */}
              <div className="relative z-10 flex min-h-[210px] flex-col items-center justify-center">
                <div className="w-full max-w-[260px] rounded-[10px] border border-line bg-bg/75 p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between text-[12px] font-medium text-fg">
                    <span>Blueprint → Cloud SLA</span>
                    <span className="text-[#0066FF] tabular-nums">&lt;5ms Latency</span>
                  </div>
                  <svg
                    viewBox="0 0 220 68"
                    className="mt-3 h-[56px] w-full overflow-visible"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="cynex-spring-grad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0066FF" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 4 58 C 48 58, 58 10, 108 14 C 148 17, 168 22, 216 20"
                      fill="none"
                      stroke="url(#cynex-spring-grad)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="108" cy="14" r="4.5" fill="#0066FF" />
                    <circle cx="216" cy="20" r="4.5" fill="#8B5CF6" />
                  </svg>
                </div>
              </div>

              <div className="relative z-10 mt-4">
                <h3 className="font-display text-[clamp(22px,2vw,26px)] leading-[1.15] font-medium tracking-[-0.03em] text-fg">
                  02. Architectural Blueprint
                </h3>
                <p className="mt-2 text-body-s leading-[1.6] text-fg-muted">
                  Multi-cloud topologies, container orchestrations, data flow modeling, database schemas, and threat modeling designed for peak reliability.
                </p>
              </div>
            </article>

            {/* ═════════════════════════════════════════════════════════════
                CARD 03 (4 Cols): Agile Development & Continuous Integration
               ═════════════════════════════════════════════════════════════ */}
            <article
              data-reveal="true"
              className="group relative flex flex-col justify-between overflow-hidden rounded-[12px] border p-7 backdrop-blur-[12px] lg:col-span-4 lg:p-9"
              style={{
                background: 'color-mix(in srgb, var(--vv-bg) 48%, transparent)',
                borderColor: 'var(--vv-card-border)',
              }}
            >
              <ShineBorder />
              <span
                aria-hidden="true"
                className="vv-art-conversion pointer-events-none absolute inset-0 opacity-45 transition-transform duration-700 ease-brand group-hover:scale-105"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, color-mix(in srgb, var(--vv-bg) 25%, transparent) 0%, color-mix(in srgb, var(--vv-bg) 88%, transparent) 100%)',
                }}
              />

              {/* Single Focal Instrument: 2-Bubble Dialog */}
              <div className="relative z-10 flex min-h-[210px] flex-col justify-center gap-2.5">
                <div className="self-start rounded-[10px] border border-line bg-bg/80 px-3.5 py-2.5 text-[12px] leading-snug text-fg-muted backdrop-blur-md">
                  “Deploying multi-cloud cluster + microservices?”
                </div>
                <div className="self-end rounded-[10px] border border-[#0066FF]/35 bg-[#0066FF]/15 px-3.5 py-2.5 text-[12px] leading-snug font-medium text-fg backdrop-blur-md">
                  “Architecture validated — automated CI/CD active.”
                </div>
              </div>

              <div className="relative z-10 mt-4">
                <h3 className="font-display text-[clamp(22px,2vw,26px)] leading-[1.15] font-medium tracking-[-0.03em] text-fg">
                  03. Agile Development
                </h3>
                <p className="mt-2 text-body-s leading-[1.6] text-fg-muted">
                  Bi-weekly sprint iterations, automated unit &amp; integration testing, transparent GitOps pipelines, and regular milestone demo reviews.
                </p>
              </div>
            </article>

            {/* ═════════════════════════════════════════════════════════════
                CARD 04 (6 Cols): Quality & Security QA
               ═════════════════════════════════════════════════════════════ */}
            <article
              data-reveal="true"
              className="group relative flex flex-col justify-between overflow-hidden rounded-[12px] border p-7 backdrop-blur-[12px] lg:col-span-6 lg:p-9"
              style={{
                background: 'color-mix(in srgb, var(--vv-bg) 48%, transparent)',
                borderColor: 'var(--vv-card-border)',
              }}
            >
              <ShineBorder />
              <span
                aria-hidden="true"
                className="vv-art-cms pointer-events-none absolute inset-0 opacity-40 transition-transform duration-700 ease-brand group-hover:scale-105"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, color-mix(in srgb, var(--vv-bg) 25%, transparent) 0%, color-mix(in srgb, var(--vv-bg) 90%, transparent) 100%)',
                }}
              />

              {/* Single Focal Instrument: Security Audit Bar */}
              <div className="relative z-10 flex min-h-[190px] items-center justify-center">
                <div className="grid w-full max-w-[440px] grid-cols-2 gap-3 rounded-[12px] border border-line bg-bg/80 p-4 backdrop-blur-md">
                  <div className="rounded-[8px] border border-line bg-surface/70 p-3">
                    <p className="text-[11px] text-fg-muted">Compliance &amp; Security</p>
                    <p className="mt-1 font-display text-[20px] font-medium text-fg tabular-nums">
                      ISO 27001 Passed
                    </p>
                  </div>
                  <div className="rounded-[8px] border border-line bg-surface/70 p-3">
                    <p className="text-[11px] text-fg-muted">Chaos Drills</p>
                    <p className="mt-1 font-display text-[20px] font-medium text-[#0066FF]">
                      Zero Data Loss
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-4">
                <h3 className="font-display text-[clamp(22px,2vw,26px)] leading-[1.15] font-medium tracking-[-0.03em] text-fg">
                  04. Quality &amp; Security QA
                </h3>
                <p className="mt-2 max-w-[520px] text-body-s leading-[1.6] text-fg-muted">
                  Automated chaos testing, vulnerability scanning, penetration drills, and rigorous verification against ISO 27001 and SOC 2 Type II controls.
                </p>
              </div>
            </article>

            {/* ═════════════════════════════════════════════════════════════
                CARD 05 (6 Cols): Zero-Downtime Launch & 24/7 Ops
               ═════════════════════════════════════════════════════════════ */}
            <article
              data-reveal="true"
              className="group relative flex flex-col justify-between overflow-hidden rounded-[12px] border p-7 backdrop-blur-[12px] lg:col-span-6 lg:p-9"
              style={{
                background: 'color-mix(in srgb, var(--vv-bg) 48%, transparent)',
                borderColor: 'var(--vv-card-border)',
              }}
            >
              <ShineBorder />
              <span
                aria-hidden="true"
                className="vv-art-pixel pointer-events-none absolute inset-0 opacity-45 transition-transform duration-700 ease-brand group-hover:scale-105"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, color-mix(in srgb, var(--vv-bg) 25%, transparent) 0%, color-mix(in srgb, var(--vv-bg) 90%, transparent) 100%)',
                }}
              />

              {/* Single Focal Instrument: Verified Launch Status */}
              <div className="relative z-10 flex min-h-[190px] items-center justify-center">
                <div className="flex w-full max-w-[440px] items-center justify-between gap-4 rounded-[12px] border border-line bg-bg/80 px-5 py-4 backdrop-blur-md">
                  <div>
                    <p className="text-[11px] text-fg-muted">Prometheus • Grafana • Datadog</p>
                    <p className="mt-1 font-display text-[18px] font-medium text-fg">
                      Real-Time Cloud Telemetry
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block font-display text-[28px] leading-none font-medium text-[#0066FF] tabular-nums">
                      99.99%
                    </span>
                    <span className="mt-1 block text-[11px] text-fg-muted">
                      Cloud SLA
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-4">
                <h3 className="font-display text-[clamp(22px,2vw,26px)] leading-[1.15] font-medium tracking-[-0.03em] text-fg">
                  05. Zero-Downtime Launch &amp; 24/7 Ops
                </h3>
                <p className="mt-2 max-w-[520px] text-body-s leading-[1.6] text-fg-muted">
                  Canary and blue/green rollouts, round-the-clock infrastructure telemetry, automated disaster recovery backups, and 99.99% SLA uptime guarantee.
                </p>
              </div>
            </article>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}

export default OurApproachBento;
