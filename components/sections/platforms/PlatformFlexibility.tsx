'use client';

import React from 'react';
import Link from 'next/link';
import { SplitRollText } from '@/components/ui/SplitRollText';
import { ShimmerCanvas } from '@/components/ui/ShimmerCanvas';
import { Lightning } from '@/components/ui/LightningBackground';

interface LaxitechCapabilityCell {
  name: string;
  sublabel: string;
  renderGlyph: () => React.ReactNode;
}

const LAXITECH_CAPABILITIES: LaxitechCapabilityCell[] = [
  {
    name: 'AWS & Multi-Cloud',
    sublabel: 'Resilient Architecture',
    renderGlyph: () => (
      <svg viewBox="0 0 24 24" className="size-8 fill-current" aria-hidden="true">
        <path d="M18.736 10.748c.117.065.176.155.176.273v1.396a.354.354 0 0 1-.22.338c-1.396.677-2.923 1.016-4.582 1.016-2.13 0-3.793-.578-4.989-1.735-1.196-1.157-1.794-2.735-1.794-4.733 0-2.074.63-3.692 1.89-4.856C10.478 1.282 12.19.7 14.353.7c1.47 0 2.872.298 4.207.893a.35.35 0 0 1 .213.33v1.462a.31.31 0 0 1-.169.28.324.324 0 0 1-.309-.008 10.024 10.024 0 0 0-3.92-.78c-1.63 0-2.934.464-3.912 1.391-.977.927-1.466 2.222-1.466 3.885 0 1.62.474 2.898 1.423 3.834.948.936 2.26 1.404 3.935 1.404 1.498 0 2.946-.353 4.343-1.058.074-.037.155-.062.242-.047zm4.354 7.644c-2.484 1.83-5.467 2.809-8.523 2.809-4.28 0-8.232-1.786-11.233-4.81-.22-.22-.058-.58.24-.442 3.197 1.48 6.744 2.295 10.428 2.295 2.68 0 5.385-.529 7.894-1.574.45-.187.828.337.194.722zm.677-.735c-.324-.412-2.146-.176-2.977-.073-.25.03-.287-.191-.06-.353 1.47-1.043 3.88-.742 4.167-.39.287.353-.08 2.763-1.463 3.923-.213.177-.411.082-.315-.154.316-.772.977-2.541.648-2.953z" />
      </svg>
    ),
  },
  {
    name: 'Kubernetes & Docker',
    sublabel: 'Container Scale',
    renderGlyph: () => (
      <svg viewBox="0 0 24 24" className="size-8 fill-current" aria-hidden="true">
        <path d="M11.642.232a.754.754 0 0 0-.484.184L4.04 6.223a.75.75 0 0 0-.256.446l-2.023 7.822a.75.75 0 0 0 .114.606l4.636 6.38a.75.75 0 0 0 .445.275l7.98 1.258a.75.75 0 0 0 .584-.197l6.096-5.807a.75.75 0 0 0 .229-.46l1.246-8.002a.75.75 0 0 0-.154-.572L18.15.795a.75.75 0 0 0-.47-.282L11.642.232zm.344 1.54 4.882.261 3.518 4.298-1.002 6.438-4.904 4.672-6.42-.999-3.729-5.132 1.628-6.293L11.986 1.77zm.014 3.73a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm0 1.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm-1.06 1.06a.75.75 0 0 0-.53.22l-.75.75a.75.75 0 1 0 1.06 1.06l.75-.75a.75.75 0 0 0-.53-1.28zm2.12 0a.75.75 0 0 0-.53 1.28l.75.75a.75.75 0 1 0 1.06-1.06l-.75-.75a.75.75 0 0 0-.53-.22zm-2.12 2.62a.75.75 0 0 0-.53.22l-.75.75a.75.75 0 1 0 1.06 1.06l.75-.75a.75.75 0 0 0-.53-1.28zm2.12 0a.75.75 0 0 0-.53 1.28l.75.75a.75.75 0 0 0 1.06-1.06l-.75-.75a.75.75 0 0 0-.53-.22z" />
      </svg>
    ),
  },
  {
    name: 'Terraform & GitOps',
    sublabel: 'Infra as Code',
    renderGlyph: () => (
      <svg viewBox="0 0 24 24" className="size-8 fill-current" aria-hidden="true">
        <path d="M1.44 0v7.575l6.56 3.79V3.79L1.44 0zm8.002 4.62v7.574l6.56 3.788V8.408l-6.56-3.79zm0 9.24v7.574l6.56 3.788v-7.575l-6.56-3.788zm8.002-4.62v7.575L24 13.027V5.452l-6.556 3.79z" />
      </svg>
    ),
  },
  {
    name: 'Pakistan Local VPS',
    sublabel: '<5ms Local Latency',
    renderGlyph: () => (
      <svg viewBox="0 0 24 24" className="size-8 fill-current" aria-hidden="true">
        <path d="M4 1h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zm0 2v4h16V3H4zm2 1.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm3 0a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM4 10h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2zm0 2v4h16v-4H4zm2 1.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm3 0a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM4 19h16a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2zm0 2v1h16v-1H4z" />
      </svg>
    ),
  },
  {
    name: 'GXMail Engine',
    sublabel: 'Secure Domain Email',
    renderGlyph: () => (
      <svg viewBox="0 0 24 24" className="size-8 fill-current" aria-hidden="true">
        <path d="M3 3h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v.511l9 5.625 9-5.625V5H3zm18 3.114-8.47 5.294a1 1 0 0 1-1.06 0L3 8.114V19h18V8.114z" />
      </svg>
    ),
  },
  {
    name: 'Next.js & React',
    sublabel: 'Modern Web Apps',
    renderGlyph: () => (
      <svg viewBox="0 0 24 24" className="size-8 fill-current" aria-hidden="true">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.88 18.23-7.07-9.14v7.35H9.36V7.48h1.46l7.15 9.24v-7.45h1.45v8.96h-1.54z" />
      </svg>
    ),
  },
  {
    name: 'Python & AI Core',
    sublabel: 'High Throughput',
    renderGlyph: () => (
      <svg viewBox="0 0 24 24" className="size-8 fill-current" aria-hidden="true">
        <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.006 2.752h5.81v.825H3.902S0 5.762 0 11.836c0 6.075 3.407 5.86 3.407 5.86h2.033v-2.859s-.11-3.407 3.352-3.407h5.753s3.242.054 3.242-3.132V2.656S18.355 0 11.914 0zm-3.27 1.84a1.09 1.09 0 1 1 0 2.18 1.09 1.09 0 0 1 0-2.18zm3.37 22.16c6.094 0 5.714-2.656 5.714-2.656l-.006-2.752h-5.81v-.825h8.114s3.902.471 3.902-5.603c0-6.075-3.407-5.86-3.407-5.86h-2.033v2.859s.11 3.407-3.352 3.407H8.76s-3.242-.054-3.242 3.132v5.638s-.568 2.656 5.873 2.656zm3.27-1.84a1.09 1.09 0 1 1 0-2.18 1.09 1.09 0 0 1 0-2.18z" />
      </svg>
    ),
  },
  {
    name: 'PostgreSQL & Databases',
    sublabel: 'Zero-Data Loss',
    renderGlyph: () => (
      <svg viewBox="0 0 24 24" className="size-8 fill-current" aria-hidden="true">
        <path d="M12 1C6.48 1 2 3.24 2 6v12c0 2.76 4.48 5 10 5s10-2.24 10-5V6c0-2.76-4.48-5-10-5zm0 2c4.42 0 8 1.57 8 3s-3.58 3-8 3-8-1.57-8-3 3.58-3 8-3zm0 6c4.42 0 8 1.57 8 3s-3.58 3-8 3-8-1.57-8-3 3.58-3 8-3zm0 6c4.42 0 8 1.57 8 3s-3.58 3-8 3-8-1.57-8-3 3.58-3 8-3z" />
      </svg>
    ),
  },
];

export function PlatformFlexibility() {
  return (
    <div className="mx-auto mt-5 max-w-[1380px] px-6 pb-[clamp(80px,10vw,136px)] md:px-8">
      <div className="grid gap-5 lg:grid-cols-2">
        {/* ─── Left Card: Lightning WebGL Background & Laxitech Offer Copy ─── */}
        <div className="relative isolate min-h-[294px] overflow-hidden rounded-[12px] bg-[#05060f] p-8 md:p-[45px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 size-full overflow-hidden"
          >
            <Lightning hue={230} xOffset={0} speed={1} intensity={1} size={1} />
          </div>

          <h3 className="font-display text-[clamp(28px,2.6vw,36px)] leading-[1.1] font-medium tracking-h2 text-white">
            End-to-End Enterprise Solutions—
            <br />
            From Cloud to Custom Code.
          </h3>

          <p className="mt-3 max-w-[568px] text-lead leading-[1.6] text-white/75">
            Partner with <span className="text-white">Laxitech</span> for complete enterprise infrastructure audits, zero-downtime cloud migrations, or dedicated VPS deployment with local low-latency NVMe performance.
          </p>

          <Link
            className="mt-5 inline-flex items-center rounded-[10px] bg-white/20 px-[15px] py-[10px] text-[14px] leading-none font-medium text-white transition-colors hover:bg-white/30"
            href="/contact"
          >
            <SplitRollText text="Start Your Project" />
          </Link>
        </div>

        {/* ─── Right Card: 4×2 Monochrome Laxitech Engineering Stack Grid ─── */}
        <ul className="grid grid-cols-2 grid-rows-4 gap-px overflow-hidden rounded-[12px] border border-line bg-line sm:min-h-[294px] sm:grid-cols-4 sm:grid-rows-2">
          {LAXITECH_CAPABILITIES.map((item) => (
            <li
              key={item.name}
              title={`${item.name} — ${item.sublabel}`}
              className="group/cell relative flex flex-col items-center justify-center gap-2 bg-bg p-4 text-center"
            >
              <ShimmerCanvas />

              <div className="relative z-10 text-fg opacity-75 transition-[opacity,transform] duration-300 ease-brand group-hover/cell:scale-110 group-hover/cell:opacity-100">
                {item.renderGlyph()}
              </div>

              <div className="relative z-10">
                <p className="font-display text-[12.5px] leading-tight font-medium text-fg">
                  {item.name}
                </p>
                <p className="mt-0.5 text-[11px] leading-tight text-fg-muted">
                  {item.sublabel}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
