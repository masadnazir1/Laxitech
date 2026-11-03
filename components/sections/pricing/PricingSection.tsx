'use client';

import React from 'react';
import Link from 'next/link';
import { SplitRollText } from '@/components/ui/SplitRollText';
import { ShineBorder } from '@/components/ui/ShineBorder';
import { useStoredValue } from '@/lib/browserState';
import {
  SplitHeadingReveal,
  RevealGroup,
} from '@/components/ui/PagePrimitives';

interface PricingTier {
  label: string;
  priceUsd: string;
  pricePkr: string;
  description: string;
  features: string[];
  detailsHref: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    label: 'VPS Starter — Pakistan Local Cloud',
    priceUsd: '$3.60/mo',
    pricePkr: 'Rs 999/mo',
    description:
      '1 Core vCPU, 2 GB RAM, 30 GB Enterprise NVMe, 1 TB Bandwidth. Ultra-low latency Pakistan local hosting for websites, WordPress, small APIs, dev/testing & small bots.',
    features: [
      '1 Core vCPU & 2 GB High-Speed RAM',
      '30 GB Enterprise NVMe SSD Storage',
      '1 TB High-Speed Monthly Bandwidth',
      'Pakistan In-Country Data Center (<5ms Latency)',
    ],
    detailsHref: '/templates',
  },
  {
    label: 'VPS Business — High Throughput',
    priceUsd: '$6.50/mo',
    pricePkr: 'Rs 1,799/mo',
    description:
      '2 Cores vCPU, 4 GB RAM, 60 GB Enterprise NVMe, 2 TB Bandwidth. Ideal for multiple websites, Docker apps, Node.js/NestJS, production databases, and control panels.',
    features: [
      '2 Cores vCPU & 4 GB High-Speed RAM',
      '60 GB Enterprise NVMe SSD Storage',
      '2 TB High-Speed Monthly Bandwidth',
      'Full Root Access, Docker & Automated Backups',
    ],
    detailsHref: '/templates',
  },
  {
    label: 'VPS Pro — Enterprise Workloads',
    priceUsd: '$12.00/mo',
    pricePkr: 'Rs 3,299/mo',
    description:
      '4 Cores vCPU, 8 GB RAM, 120 GB Enterprise NVMe, 4 TB Bandwidth. Engineered for high-traffic web apps, large API clusters, multi-service Docker, and game servers.',
    features: [
      '4 Cores vCPU & 8 GB High-Speed RAM',
      '120 GB Enterprise NVMe SSD Storage',
      '4 TB High-Speed Monthly Bandwidth',
      '99.99% Cloud SLA & 24/7 Priority Support',
    ],
    detailsHref: '/contact',
  },
];

export function PricingSection() {
  const [storedCurrency, setCurrency] = useStoredValue('vv-currency', 'usd');
  const currency = storedCurrency === 'pkr' ? 'pkr' : 'usd';

  React.useEffect(() => {
    document.documentElement.dataset.currency = currency;
  }, [currency]);

  const handleCurrencyChange = (next: 'usd' | 'pkr') => {
    setCurrency(next);
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.currency = next;
    }
    try {
      localStorage.setItem('vv-currency', next);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative isolate z-10 bg-bg py-[clamp(80px,9vw,120px)]"
    >
      <div className="mx-auto max-w-[1380px] px-6 md:px-8">
        {/* ─── Giant Split-Character Reveal Heading ─── */}
        <SplitHeadingReveal triggerOnScroll={true}>
          <h2
            id="pricing-heading"
            className="text-center font-display text-[clamp(44px,8vw,118px)] leading-[1] font-medium tracking-[-0.05em]"
          >
            Cloud &amp; <span className="vv-accent">VPS Pricing</span>
          </h2>
        </SplitHeadingReveal>

        {/* ─── Interactive USD ($) / PKR (Rs) Currency Toggle ─── */}
        <div className="relative z-20 mt-4 mb-8 flex justify-center">
          <div
            role="group"
            aria-label="Pricing currency"
            className="inline-flex items-center gap-1 rounded-[10px] border border-line bg-surface/80 p-1 backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => handleCurrencyChange('usd')}
              aria-pressed={currency === 'usd'}
              className={`cursor-pointer rounded-[8px] px-3.5 py-1.5 text-[12px] leading-none font-medium transition-colors ${
                currency === 'usd'
                  ? 'bg-fg text-bg shadow-sm'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              USD ($) • International
            </button>
            <button
              type="button"
              onClick={() => handleCurrencyChange('pkr')}
              aria-pressed={currency === 'pkr'}
              className={`cursor-pointer rounded-[8px] px-3.5 py-1.5 text-[12px] leading-none font-medium transition-colors ${
                currency === 'pkr'
                  ? 'bg-fg text-bg shadow-sm'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              PKR (Rs) • Regional
            </button>
          </div>
        </div>

        {/* ─── 3-Column Pricing Cards Grid ─── */}
        <div className="relative">
          <RevealGroup>
            <div className="grid gap-5 md:grid-cols-3">
              {PRICING_TIERS.map((tier) => (
                <div
                  key={tier.label}
                  data-reveal="true"
                  className="group relative flex flex-col overflow-hidden rounded-[12px] border backdrop-blur-[12px]"
                  style={{
                    background: 'color-mix(in srgb, var(--vv-bg) 42%, transparent)',
                    borderColor: 'var(--vv-card-border)',
                  }}
                >
                  {/* Top Specular Highlight Line */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 left-1/2 h-px w-[240px] max-w-[80%] -translate-x-1/2"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent 0%, var(--vv-card-line) 50%, transparent 100%)',
                    }}
                  />

                  {/* Top Radial Ambient Lift */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(58% 46% at 50% 0%, color-mix(in srgb, var(--vv-card-lift) 62%, transparent) 0%, color-mix(in srgb, var(--vv-card-lift-mid) 62%, transparent) 45%, transparent 78%)',
                    }}
                  />

                  {/* Traveling Conic Shine Border */}
                  <ShineBorder />

                  <div className="relative flex flex-1 flex-col p-8 md:p-10">
                    <p className="text-[12px] leading-none font-medium tracking-[0.14em] text-fg-subtle uppercase">
                      {tier.label}
                    </p>

                    <div className="mt-7 flex items-baseline gap-2.5">
                      <span className="text-body-s text-fg-muted">from</span>
                      <span className="font-display text-[clamp(38px,4vw,56px)] leading-[0.95] font-medium tracking-[-0.045em]">
                        {currency === 'usd' ? tier.priceUsd : tier.pricePkr}
                      </span>
                    </div>

                    <p className="mt-5 text-body-s leading-[1.65] text-fg-muted">
                      {tier.description}
                    </p>

                    <ul
                      className="mt-8 divide-y border-t"
                      style={{ borderColor: 'var(--vv-card-rule)' }}
                    >
                      {tier.features.map((feat) => (
                        <li
                          key={feat}
                          className="py-3 text-[13.5px] leading-[1.5] text-fg-strong"
                          style={{ borderColor: 'var(--vv-card-rule)' }}
                        >
                          {feat}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3 pt-9">
                      <Link
                        className="inline-flex items-center rounded-[10px] border border-transparent bg-fg px-[15px] py-[9px] text-[14px] leading-none font-medium text-bg transition-colors hover:bg-fg-strong"
                        href="/contact"
                      >
                        <SplitRollText text="Start a project" />
                      </Link>

                      <Link
                        className="group/link flex items-center gap-2 py-1 text-[13px] leading-none font-medium text-fg-subtle transition-colors hover:text-fg"
                        href={tier.detailsHref}
                      >
                        Details
                        <svg
                          viewBox="0 0 24 24"
                          className="size-3.5 shrink-0 transition-transform duration-300 ease-brand group-hover/link:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ─── Concise Inline Note for Single Modules & Managed Care ─── */}
            <p
              data-reveal="true"
              className="mt-7 text-center text-[13.5px] leading-[1.6] text-fg-muted"
            >
              Need GXMail business email (from{' '}
              <span className="font-medium text-fg">
                {currency === 'usd' ? '$1.00/mo' : 'Rs 250/mo'}
              </span>
              ) or custom enterprise cloud architecture &amp; full-stack software development?{' '}
              <Link
                href="/contact"
                className="font-medium text-fg underline decoration-fg/35 underline-offset-4 transition-colors hover:text-[#0066FF]"
              >
                Request a custom consultation →
              </Link>
            </p>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
