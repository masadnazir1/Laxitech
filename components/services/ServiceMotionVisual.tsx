import React from 'react';

interface ServiceMotionVisualProps {
  slug: string;
  className?: string;
}

/**
 * Shared 16:10 Stage Container
 * ----------------------------
 * - Fully adaptive to both Dark and Light mode via CSS variables (`--vv-bg`, `--vv-surface`, `--vv-card-border`).
 * - Soft radial spotlight + subtle dot-matrix grid with radial edge fade (`mask-image`).
 * - Strictly ONE macro focal instrument per card, zero `<11px` micro-text, zero fake macOS browser dots.
 */
function StageFrame({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[6px] border border-line bg-surface/65 lg:rounded-[8px] ${className}`}
    >
      <div
        aria-hidden="true"
        className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden p-5 select-none"
      >
        {/* Top-left Electric Blue ambient glow */}
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(75% 70% at 20% 0%, rgba(0, 102, 255, 0.18) 0%, transparent 65%)',
          }}
        />
        {/* Bottom-right Electric Purple ambient glow */}
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(75% 70% at 85% 100%, rgba(139, 92, 246, 0.16) 0%, transparent 65%)',
          }}
        />
        {/* Subtle 16px architectural dot grid with soft radial mask */}
        <span
          className="pointer-events-none absolute inset-0 opacity-45"
          style={{
            backgroundImage:
              'radial-gradient(color-mix(in srgb, var(--vv-text-primary) 24%, transparent) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            maskImage:
              'radial-gradient(78% 78% at 50% 50%, #000 30%, transparent 82%)',
            WebkitMaskImage:
              'radial-gradient(78% 78% at 50% 50%, #000 30%, transparent 82%)',
          }}
        />
        {children}
      </div>
    </div>
  );
}

/**
 * 1. Custom Web Engineering (`crafted-websites`)
 * Single Macro Focal Instrument: Next.js 15 / React Architecture Node + 99+ Speed Readout
 */
function CraftedWebsitesVisual() {
  return (
    <StageFrame>
      <div className="relative z-10 flex w-full max-w-[310px] items-center justify-between gap-4 rounded-[12px] border border-line bg-bg/85 p-4 backdrop-blur-md transition-transform duration-500 ease-brand group-hover:-translate-y-1">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-fg-muted">
            Next.js 15 • TypeScript
          </span>
          <span className="font-display text-[22px] leading-tight font-medium tracking-tight text-fg">
            Sub-Second Web
          </span>
          <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-[6px] bg-[#0066FF]/12 px-2.5 py-1 text-[11px] font-medium text-[#0066FF]">
            <span className="size-1.5 rounded-full bg-[#0066FF]" />
            0.4s First Paint
          </span>
        </div>

        <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-full border-2 border-[#0066FF] bg-[#0066FF]/[0.08]">
          <span className="font-display text-[20px] leading-none font-semibold text-fg tabular-nums">
            99+
          </span>
          <span className="mt-0.5 text-[11px] leading-none text-fg-muted">
            Speed
          </span>
        </div>
      </div>
    </StageFrame>
  );
}

/**
 * 2. Website Redesign (`website-redesign`)
 * Single Macro Focal Instrument: Before -> After Conversion & Speed Upgrade Comparison
 */
function WebsiteRedesignVisual() {
  return (
    <StageFrame>
      <div className="relative z-10 grid w-full max-w-[320px] grid-cols-2 gap-3 transition-transform duration-500 ease-brand group-hover:-translate-y-1">
        <div className="flex flex-col justify-between rounded-[10px] border border-line bg-bg/65 p-3.5 opacity-70">
          <span className="text-[11px] text-fg-muted">Legacy Site</span>
          <span className="mt-3 font-display text-[22px] leading-none font-medium text-fg-muted tabular-nums">
            4.2s
          </span>
          <span className="mt-1.5 text-[11px] text-fg-subtle">
            Slow • Template UI
          </span>
        </div>

        <div className="flex flex-col justify-between rounded-[10px] border border-[#0066FF]/45 bg-bg/90 p-3.5 shadow-sm">
          <span className="text-[11px] font-medium text-[#0066FF]">
            CYNEX Rebuild
          </span>
          <span className="mt-3 font-display text-[22px] leading-none font-semibold text-fg tabular-nums">
            0.4s
          </span>
          <span className="mt-1.5 text-[11px] font-medium text-fg">
            3.2× Lead Lift
          </span>
        </div>
      </div>
    </StageFrame>
  );
}

/**
 * 3. eCommerce & WhatsApp Stores (`ecommerce-website-design`)
 * Single Macro Focal Instrument: Itemized Order Card + 1-Click WhatsApp Checkout Dispatch
 */
function EcommerceStoresVisual() {
  return (
    <StageFrame>
      <div className="relative z-10 flex w-full max-w-[310px] flex-col gap-3 rounded-[12px] border border-line bg-bg/85 p-4 backdrop-blur-md transition-transform duration-500 ease-brand group-hover:-translate-y-1">
        <div className="flex items-center justify-between border-b border-line pb-2.5">
          <div>
            <p className="font-display text-[15px] font-medium text-fg">
              Atelier Order #408
            </p>
            <p className="text-[11px] text-fg-muted">2 Items • Multi-Currency</p>
          </div>
          <span className="font-display text-[18px] font-semibold text-fg tabular-nums">
            $420
          </span>
        </div>

        <div className="flex items-center justify-between rounded-[8px] bg-[#0066FF] px-3.5 py-2 text-[12px] font-medium text-white">
          <span>1-Click WhatsApp Checkout</span>
          <span aria-hidden="true">→</span>
        </div>
      </div>
    </StageFrame>
  );
}

/**
 * 4. Custom Admin CMS & Portals (`cms-and-dynamic-websites`)
 * Single Macro Focal Instrument: 1-Click Bulk Price Sync & Role-Locked Owner Toggle
 */
function AdminCmsVisual() {
  return (
    <StageFrame>
      <div className="relative z-10 flex w-full max-w-[310px] flex-col gap-3 rounded-[12px] border border-line bg-bg/85 p-4 backdrop-blur-md transition-transform duration-500 ease-brand group-hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-[15px] font-medium text-fg">
              Owner Admin Portal
            </p>
            <p className="text-[11px] text-fg-muted">UID-Locked Google Auth</p>
          </div>
          <span className="rounded-[6px] bg-[#8B5CF6]/15 px-2.5 py-1 text-[11px] font-medium text-[#8B5CF6]">
            Live Sync
          </span>
        </div>

        <div className="flex items-center justify-between rounded-[8px] border border-line bg-surface/75 px-3.5 py-2.5">
          <span className="text-[12px] font-medium text-fg">
            Bulk Catalog Markup
          </span>
          <span className="font-display text-[15px] font-semibold text-[#0066FF] tabular-nums">
            +10% Applied
          </span>
        </div>
      </div>
    </StageFrame>
  );
}

/**
 * 5. Conversion Landing Pages (`landing-pages-and-microsites`)
 * Single Macro Focal Instrument: High-Contrast Package Selector & Direct Lead Action
 */
function LandingPagesVisual() {
  return (
    <StageFrame>
      <div className="relative z-10 flex w-full max-w-[310px] flex-col gap-3 rounded-[12px] border border-line bg-bg/85 p-4 backdrop-blur-md transition-transform duration-500 ease-brand group-hover:-translate-y-1">
        <div className="flex items-baseline justify-between">
          <span className="font-display text-[16px] font-medium text-fg">
            Launch Campaign
          </span>
          <span className="font-display text-[20px] font-semibold text-[#0066FF] tabular-nums">
            98.4%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-fg/10">
          <div
            className="h-full w-[88%] rounded-full"
            style={{
              background: 'linear-gradient(90deg, #0066FF 0%, #8B5CF6 100%)',
            }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-fg-muted">
          <span>Zero-Friction Lead Flow</span>
          <span className="font-medium text-fg">Instant Booking</span>
        </div>
      </div>
    </StageFrame>
  );
}

/**
 * 6. Brand Identity & Figma UI/UX (`consistent-identity`)
 * Single Macro Focal Instrument: Typography & Dual-Theme Token Swatch Card
 */
function BrandIdentityVisual() {
  return (
    <StageFrame>
      <div className="relative z-10 flex w-full max-w-[310px] items-center justify-between gap-4 rounded-[12px] border border-line bg-bg/85 p-4 backdrop-blur-md transition-transform duration-500 ease-brand group-hover:-translate-y-1">
        <div>
          <span className="font-display text-[28px] leading-none font-medium tracking-tight text-fg">
            Aa{' '}
            <span className="vv-accent font-normal text-[#0066FF]">Serif</span>
          </span>
          <p className="mt-1.5 text-[11.5px] text-fg-muted">
            Figma Design System
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            title="Electric Blue #0066FF"
            className="size-8 rounded-[8px] bg-[#0066FF] shadow-sm"
          />
          <span
            title="Electric Purple #8B5CF6"
            className="size-8 rounded-[8px] bg-[#8B5CF6] shadow-sm"
          />
          <span
            title="Obsidian / Ivory Surface"
            className="size-8 rounded-[8px] border border-line bg-fg"
          />
        </div>
      </div>
    </StageFrame>
  );
}

/**
 * 7. Motion & Interactive UI (`motion-and-interaction-design`)
 * Single Macro Focal Instrument: 60fps Spring Physics Bezier Curve
 */
function MotionDesignVisual() {
  return (
    <StageFrame>
      <div className="relative z-10 flex w-full max-w-[310px] flex-col gap-2 rounded-[12px] border border-line bg-bg/85 p-4 backdrop-blur-md transition-transform duration-500 ease-brand group-hover:-translate-y-1">
        <div className="flex items-center justify-between text-[12px] font-medium">
          <span className="text-fg">Spring Choreography</span>
          <span className="text-[#0066FF] tabular-nums">60 FPS • 16.6ms</span>
        </div>
        <svg
          viewBox="0 0 240 64"
          className="mt-1 h-[54px] w-full overflow-visible"
          aria-hidden="true"
        >
          <path
            d="M 6 54 C 54 54, 66 8, 120 14 C 164 18, 188 22, 234 20"
            fill="none"
            stroke="#0066FF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="120" cy="14" r="4.5" fill="#0066FF" />
          <circle cx="234" cy="20" r="4.5" fill="#8B5CF6" />
        </svg>
      </div>
    </StageFrame>
  );
}

/**
 * 8. AI Concierges & Chatbots (`ux-centric-strategy`)
 * Single Macro Focal Instrument: 2-Bubble 24/7 Trained AI Sales Assistant
 */
function AiConciergeVisual() {
  return (
    <StageFrame>
      <div className="relative z-10 flex w-full max-w-[310px] flex-col gap-2.5 transition-transform duration-500 ease-brand group-hover:-translate-y-1">
        <div className="self-start rounded-[10px] border border-line bg-bg/85 px-3.5 py-2 text-[12px] text-fg-muted backdrop-blur-md">
          “Can we add an AI concierge to our store?”
        </div>
        <div className="self-end rounded-[10px] border border-[#0066FF]/40 bg-[#0066FF]/15 px-3.5 py-2 text-[12px] font-medium text-fg backdrop-blur-md">
          “Trained on your catalog • 24/7 WhatsApp routing.”
        </div>
      </div>
    </StageFrame>
  );
}

/**
 * 9. Speed, SEO & Google Indexing (`performance-optimization`)
 * Single Macro Focal Instrument: 100/100 Core Web Vitals & 20-Min Google Indexing
 */
function PerformanceSeoVisual() {
  return (
    <StageFrame>
      <div className="relative z-10 flex w-full max-w-[310px] items-center justify-between gap-4 rounded-[12px] border border-line bg-bg/85 p-4 backdrop-blur-md transition-transform duration-500 ease-brand group-hover:-translate-y-1">
        <div className="vv-anim-ring relative flex size-16 shrink-0 items-center justify-center">
          <svg viewBox="0 0 80 80" className="size-full -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              className="text-fg/10"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#0066FF"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="213.6"
              strokeDashoffset="0"
            />
          </svg>
          <span className="absolute font-display text-[18px] font-semibold text-fg tabular-nums">
            100
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <span className="font-display text-[16px] font-medium text-fg">
            Google SEO &amp; Vitals
          </span>
          <span className="text-[11.5px] text-fg-muted">
            JSON-LD Schema • llms.txt
          </span>
          <span className="mt-1 text-[11px] font-medium text-[#0066FF]">
            Indexed in ~20 Minutes
          </span>
        </div>
      </div>
    </StageFrame>
  );
}

/**
 * 10. Security, Cloud & Custom Emails (`maintenance-and-ongoing-support`)
 * Single Macro Focal Instrument: NullShield Security + Verified @yourdomain.com Mail
 */
function SecurityCloudVisual() {
  return (
    <StageFrame>
      <div className="relative z-10 flex w-full max-w-[310px] flex-col gap-2.5 rounded-[12px] border border-line bg-bg/85 p-4 backdrop-blur-md transition-transform duration-500 ease-brand group-hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <span className="font-display text-[15px] font-medium text-fg">
            @yourdomain.com
          </span>
          <span className="rounded-[6px] bg-[#0066FF]/15 px-2.5 py-1 text-[11px] font-medium text-[#0066FF]">
            SSL + DMARC
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-line pt-2.5 text-[11.5px] text-fg-muted">
          <span>NullShield Zero-Trust Guard</span>
          <span className="font-medium text-fg">99.98% Uptime</span>
        </div>
      </div>
    </StageFrame>
  );
}

export function ServiceMotionVisual({
  slug,
}: ServiceMotionVisualProps) {
  switch (slug) {
    case 'crafted-websites':
      return <CraftedWebsitesVisual />;
    case 'website-redesign':
      return <WebsiteRedesignVisual />;
    case 'ecommerce-website-design':
      return <EcommerceStoresVisual />;
    case 'cms-and-dynamic-websites':
      return <AdminCmsVisual />;
    case 'landing-pages-and-microsites':
      return <LandingPagesVisual />;
    case 'consistent-identity':
      return <BrandIdentityVisual />;
    case 'motion-and-interaction-design':
      return <MotionDesignVisual />;
    case 'ux-centric-strategy':
      return <AiConciergeVisual />;
    case 'performance-optimization':
      return <PerformanceSeoVisual />;
    case 'maintenance-and-ongoing-support':
      return <SecurityCloudVisual />;
    default:
      return <CraftedWebsitesVisual />;
  }
}
