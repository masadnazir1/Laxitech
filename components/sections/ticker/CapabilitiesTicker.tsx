'use client';

import React from 'react';

const CAPABILITIES = [
  'Custom Software Development',
  'Cloud Architecture & Migration',
  'IT Infrastructure & Zero-Trust Setup',
  'Pakistan Hosted VPS Cloud',
  'GXMail Business Email Hosting',
  'Digital Transformation & DevOps',
  '99.99% Cloud SLA Uptime',
  'ISO 27001 Certified & SOC 2 Compliant',
];

export function CapabilitiesTicker() {
  return (
    <section className="relative overflow-hidden bg-surface py-5 select-none">
      <div
        className="vv-marquee-track flex w-max text-[22px] sm:text-[24px] leading-[1.2] text-fg-strong font-display"
        style={{
          // @ts-expect-error CSS custom property
          '--vv-marquee-copies': 5,
        }}
      >
        {[...Array(5)].map((_, loopIdx) => (
          <span
            key={loopIdx}
            aria-hidden={loopIdx > 0}
            className="flex shrink-0 items-center whitespace-nowrap"
          >
            {CAPABILITIES.map((cap) => (
              <span key={cap} className="flex items-center">
                {cap}
                <span aria-hidden="true" className="mx-[18px] text-fg-subtle">
                  •
                </span>
              </span>
            ))}
          </span>
        ))}
      </div>

      {/* ─── Edge Fade Gradients ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/4"
        style={{ background: 'linear-gradient(90deg, var(--vv-surface) 6%, transparent 100%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-1/4"
        style={{ background: 'linear-gradient(90deg, transparent 0%, var(--vv-surface) 94%)' }}
      />
    </section>
  );
}
