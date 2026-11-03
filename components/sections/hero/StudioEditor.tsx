'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EDITOR_PROJECT_PLACEHOLDERS } from '@/data/assetRegistry';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useBrowserMedia } from '@/lib/browserState';

export interface EditorProjectItem {
  title: string;
  slug: string;
  desktop: string;
  mobile: string;
  themes: ('dark' | 'light')[];
}

export const DEFAULT_EDITOR_PROJECTS: EditorProjectItem[] =
  EDITOR_PROJECT_PLACEHOLDERS;

export type TokenKind =
  | 'keyword'
  | 'type'
  | 'func'
  | 'prop'
  | 'string'
  | 'number'
  | 'comment'
  | 'punct'
  | 'ident';

export interface CodeToken {
  text: string;
  kind: TokenKind;
}

export interface StudioSnippet {
  file: string;
  languageLabel: string;
  dotColor: string;
  lines: CodeToken[][];
  lineNotes: string[];
}

const k = (text: string): CodeToken => ({ text, kind: 'keyword' });
const t = (text: string): CodeToken => ({ text, kind: 'type' });
const f = (text: string): CodeToken => ({ text, kind: 'func' });
const pr = (text: string): CodeToken => ({ text, kind: 'prop' });
const s = (text: string): CodeToken => ({ text, kind: 'string' });
const n = (text: string): CodeToken => ({ text, kind: 'number' });
const c = (text: string): CodeToken => ({ text, kind: 'comment' });
const p = (text: string): CodeToken => ({ text, kind: 'punct' });
const id = (text: string): CodeToken => ({ text, kind: 'ident' });

export const STUDIO_BIO_SNIPPETS: StudioSnippet[] = [
  {
    file: 'laxitech.cloud.ts',
    languageLabel: 'TS',
    dotColor: '#38BDF8',
    lines: [
      [c('// Laxitech Technologies Inc. — Enterprise Custom Software & Multi-Cloud')],
      [k('export const '), f('LaxitechCore'), p(' = {')],
      [
        p('  '),
        pr('headquarters'),
        p(': '),
        s("'Silicon Valley, CA • Pakistan Data Center'"),
        p(', '),
        pr('standards'),
        p(': '),
        s("'ISO 27001 & SOC 2'"),
        p(','),
      ],
      [
        p('  '),
        pr('services'),
        p(': ['),
        s("'Custom Software'"),
        p(', '),
        s("'Multi-Cloud Architecture'"),
        p(', '),
        s("'Zero-Trust'"),
        p('],'),
      ],
      [
        p('  '),
        pr('products'),
        p(': '),
        s("'Pakistan Hosted VPS (<5ms) + GXMail Domain Engine'"),
        p(','),
      ],
      [
        p('  '),
        pr('devOps'),
        p(': '),
        s("'Automated CI/CD, Terraform GitOps & Chaos Testing'"),
        p(','),
      ],
      [
        p('  '),
        pr('sla'),
        p(': { '),
        pr('uptime'),
        p(': '),
        s("'99.99%'"),
        p(', '),
        pr('projectsShipped'),
        p(': '),
        n('150'),
        p(', '),
        pr('support'),
        p(': '),
        s("'24/7'"),
        p(' },'),
      ],
      [p('} '), k('as const'), p(';')],
    ],
    lineNotes: [
      'Laxitech enterprise cloud and custom software engineering architecture header.',
      'Typed production platform configuration exported for mission-critical deployments.',
      'Silicon Valley headquarters paired with domestic high-speed Pakistan data center.',
      'Full-stack software engineering, AWS/Azure/GCP migration, and DevSecOps.',
      'In-country NVMe VPS hosting with low local latency and secure business email.',
      'Automated GitOps pipelines, blue/green deployments, and chaos test suites.',
      'Enterprise 99.99% SLA uptime target across over 150 delivered systems.',
      'Immutable compile-time specification guaranteeing zero infrastructure debt.',
    ],
  },
  {
    file: 'multi-cloud.mesh.ts',
    languageLabel: 'TS',
    dotColor: '#8B5CF6',
    lines: [
      [c('// Multi-Cloud Orchestration & Automated Zero-Downtime Failover')],
      [
        k('import '),
        p('{ '),
        t('KubernetesCluster'),
        p(', '),
        t('TerraformState'),
        p(' } '),
        k('from '),
        s("'@laxitech/cloud-mesh'"),
        p(';'),
      ],
      [
        k('export async function '),
        f('routeTraffic'),
        p('('),
        id('region'),
        p(': '),
        t('ClusterRegion'),
        p(') {'),
      ],
      [
        p('  '),
        k('const '),
        id('mesh '),
        p('= '),
        k('await '),
        t('TerraformState'),
        p('.'),
        f('syncTopology'),
        p('('),
        id('region'),
        p(', { '),
        pr('latencyMs'),
        p(': '),
        n('5'),
        p(' });'),
      ],
      [p('  '), k('if '), p('('), id('mesh'), p('.'), pr('healthScore'), p(' >= '), n('0.99'), p(') {')],
      [
        p('    '),
        k('return '),
        t('KubernetesCluster'),
        p('.'),
        f('dispatchHighThroughput'),
        p('('),
        id('region'),
        p(', '),
        id('mesh'),
        p('.'),
        pr('nodes'),
        p(');'),
      ],
      [p('  }')],
      [p('  '), k('return '), id('mesh'), p('.'), f('triggerZeroDowntimeFailover'), p('();')],
      [p('}')],
    ],
    lineNotes: [
      'Automated multi-cloud failover orchestration module across AWS, GCP, and Azure.',
      'Imports Laxitech Kubernetes cluster controllers and Terraform state sync.',
      'Dynamically routes enterprise traffic according to real-time regional latencies.',
      'Sub-5ms response thresholds maintained across all provisioned nodes.',
      'Validates cluster health before routing high-throughput production requests.',
      'Dispatches workloads smoothly across containerized microservices.',
      'Closes optimal routing branch.',
      'Triggers instant zero-downtime failover if any regional anomaly is detected.',
      'End of multi-cloud routing controller.',
    ],
  },
  {
    file: 'vps.pakistan.ts',
    languageLabel: 'TS',
    dotColor: '#0066FF',
    lines: [
      [c('// Pakistan Hosted VPS — NVMe SSD Storage & Domestic Data Sovereignty')],
      [k('export const '), f('configurePakistanVPS'), p(' = () => ({')],
      [
        p('  '),
        pr('datacenter'),
        p(': '),
        s("'Islamabad / Lahore In-Country Tier III Facility'"),
        p(','),
      ],
      [
        p('  '),
        pr('specs'),
        p(': { '),
        pr('vcpu'),
        p(': '),
        s("'1-4 Cores'"),
        p(', '),
        pr('ram'),
        p(': '),
        s("'2-8 GB'"),
        p(', '),
        pr('storage'),
        p(': '),
        s("'Enterprise NVMe Gen4'"),
        p(' },'),
      ],
      [
        p('  '),
        pr('latency'),
        p(': '),
        s("'<5ms Local Ping • 99.9% Network Uptime SLA'"),
        p(','),
      ],
      [
        p('  '),
        pr('billing'),
        p(': '),
        s("'Billed in PKR directly with zero foreign exchange fees'"),
        p(','),
      ],
      [p('});')],
    ],
    lineNotes: [
      'Pakistan local high-performance VPS cloud architecture on enterprise NVMe.',
      'Exports deterministic server configuration for domestic and regional workloads.',
      'Physical bare metal hosting in Pakistan ensuring complete data sovereignty.',
      'Scalable vCPU, RAM, and ultra-fast NVMe storage tiers from Rs 999/month.',
      'Guaranteed sub-5ms local roundtrip ping and 99.9% network reliability.',
      'Seamless local currency billing and 24/7 in-country technical support.',
      'End of Pakistan VPS cloud specification.',
    ],
  },
  {
    file: 'gxmail.security.ts',
    languageLabel: 'TS',
    dotColor: '#2DD4BF',
    lines: [
      [c('// GXMail Engine — SPF, DKIM, DMARC & TLS Authenticated Business Mail')],
      [
        k('export async function '),
        f('provisionDomainMail'),
        p('('),
        id('domain'),
        p(': '),
        t('string'),
        p(') {'),
      ],
      [
        p('  '),
        k('const '),
        id('keys '),
        p('= '),
        k('await '),
        t('GXMailDNS'),
        p('.'),
        f('generateAuthRecords'),
        p('('),
        id('domain'),
        p(', { '),
        pr('rsaBits'),
        p(': '),
        n('2048'),
        p(' });'),
      ],
      [
        p('  '),
        k('return '),
        f('activateMailboxCluster'),
        p('({'),
      ],
      [
        p('    '),
        pr('auth'),
        p(': ['),
        s("'SPF=Pass'"),
        p(', '),
        s("'DKIM=2048-bit'"),
        p(', '),
        s("'DMARC=Reject'"),
        p('],'),
      ],
      [
        p('    '),
        pr('storage'),
        p(': '),
        s("'Encrypted NVMe with Real-Time Spam & Phishing Filters'"),
        p(','),
      ],
      [
        p('    '),
        pr('uptime'),
        p(': '),
        s("'99.9% SLA with TLS Encrypted SMTP/IMAP Protocols'"),
        p(','),
      ],
      [p('  });')],
      [p('}')],
    ],
    lineNotes: [
      'Secure enterprise business email hosting for custom domains (@yourcompany.com).',
      'Provisions cryptographic keys and validates domain ownership automatically.',
      'Generates 2048-bit RSA authentication keys for high inbox deliverability.',
      'Activates dedicated mailboxes with full SPF, DKIM, and DMARC enforcement.',
      'Prevents spoofing and phishing while keeping inbox delivery rates at 100%.',
      'Encrypted NVMe email storage with automated anti-malware scanning.',
      'TLS 1.3 protocol encryption for all incoming and outgoing mail traffic.',
      'Closes mailbox provisioning pipeline.',
      'End of GXMail domain email setup module.',
    ],
  },
  {
    file: 'zero-trust.deploy.ts',
    languageLabel: 'TS',
    dotColor: '#34D399',
    lines: [
      [c('// Zero-Trust Security, ISO 27001 Certification & DevSecOps Pipelines')],
      [k('export const '), f('verifyEnterpriseCompliance'), p(' = () => ({')],
      [
        p('  '),
        pr('standards'),
        p(': ['),
        s("'ISO 27001 Certified'"),
        p(', '),
        s("'SOC 2 Type II Compliant'"),
        p('],'),
      ],
      [
        p('  '),
        pr('networkSecurity'),
        p(': '),
        s("'Zero-Trust Perimeter, mTLS & Automated Chaos Drills'"),
        p(','),
      ],
      [
        p('  '),
        pr('monitoring'),
        p(': '),
        s("'Prometheus Telemetry, Grafana Dashboards & Datadog'"),
        p(','),
      ],
      [
        p('  '),
        pr('slaGuarantee'),
        p(': '),
        s("'99.99% Cloud SLA with 24/7 Priority Ops Response'"),
        p(','),
      ],
      [p('});')],
    ],
    lineNotes: [
      'Enterprise compliance verification, perimeter security, and continuous operations.',
      'Runs automated pre-flight security checks against SOC 2 and ISO 27001 controls.',
      'Certified enterprise compliance standards protecting all client environments.',
      'Mutual TLS authentication, strict network isolation, and regular penetration drills.',
      'Real-time telemetry and predictive alerting integrated with 24/7 engineer support.',
      'Rock-solid 99.99% SLA uptime commitment across all enterprise production workloads.',
      'End of enterprise compliance and security manifest.',
    ],
  },
];

export function getTotalCharCount(lines: CodeToken[][]): number {
  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    for (const tok of lines[i]) {
      count += tok.text.length;
    }
    if (i < lines.length - 1) {
      count += 1;
    }
  }
  return count;
}

export function slicePreTokenizedLines(
  lines: CodeToken[][],
  charLimit: number
): CodeToken[][] {
  if (charLimit <= 0) return [[]];
  const result: CodeToken[][] = [];
  let remaining = charLimit;

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const currentLine: CodeToken[] = [];
    const sourceLine = lines[lineIdx];

    for (let tokIdx = 0; tokIdx < sourceLine.length; tokIdx++) {
      if (remaining <= 0) break;
      const tok = sourceLine[tokIdx];
      if (remaining >= tok.text.length) {
        currentLine.push(tok);
        remaining -= tok.text.length;
      } else {
        currentLine.push({
          text: tok.text.slice(0, remaining),
          kind: tok.kind,
        });
        remaining = 0;
      }
    }

    result.push(currentLine);

    if (remaining <= 0) {
      break;
    }
    remaining -= 1;
    if (remaining <= 0 && lineIdx < lines.length - 1) {
      result.push([]);
      break;
    }
  }

  return result.length ? result : [[]];
}

const DARK_TOKEN_CLASSES: Record<TokenKind, string> = {
  keyword: 'text-[#38BDF8] font-medium',
  type: 'text-[#2DD4BF]',
  func: 'text-[#60A5FA] font-medium',
  prop: 'text-[#93C5FD]',
  string: 'text-[#5EEAD4]',
  number: 'text-[#38BDF8] font-medium',
  comment: 'text-white/45 italic',
  punct: 'text-white/65',
  ident: 'text-white',
};

const LIGHT_TOKEN_CLASSES: Record<TokenKind, string> = {
  keyword: 'text-[#0052CC] font-medium',
  type: 'text-[#0F766E] font-medium',
  func: 'text-[#1D4ED8] font-medium',
  prop: 'text-[#1E40AF]',
  string: 'text-[#0D9488]',
  number: 'text-[#0066FF] font-medium',
  comment: 'text-slate-500/80 italic',
  punct: 'text-slate-500',
  ident: 'text-[#0F172A]',
};

const SPEEDS = [1, 1.5, 0.5];

export function StudioEditor(_props: { projects?: EditorProjectItem[] }) {
  const { resolvedTheme } = useTheme();
  const [canvasOverride, setCanvasTheme] = useState<'dark' | 'light' | null>(null);
  const canvasTheme = canvasOverride ?? resolvedTheme;
  const reducedMotion = useBrowserMedia('(prefers-reduced-motion: reduce)');
  const [fileIdx, setFileIdx] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [fileCharCount, setFileCharCount] = useState<number>(
    STUDIO_BIO_SNIPPETS[0].file.length
  );
  const [phase, setPhase] = useState<
    | 'typing'
    | 'holding'
    | 'backspacing'
    | 'backspacing-file'
    | 'typing-file'
  >('typing');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedIdx, setSpeedIdx] = useState<number>(0);
  const [selectedLineIdx, setSelectedLineIdx] = useState<number | null>(null);

  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const speed = SPEEDS[speedIdx];
  const currentSnippet = STUDIO_BIO_SNIPPETS[fileIdx];
  const totalChars = useMemo(
    () => getTotalCharCount(currentSnippet.lines),
    [currentSnippet]
  );

  const stateRef = useRef({
    charCount: 0,
    fileCharCount: STUDIO_BIO_SNIPPETS[0].file.length,
    phase: 'typing' as
      | 'typing'
      | 'holding'
      | 'backspacing'
      | 'backspacing-file'
      | 'typing-file',
    fileIdx: 0,
    lastTick: 0,
    holdElapsed: 0,
    carryMs: 0,
  });

  useEffect(() => {
    stateRef.current.charCount = charCount;
    stateRef.current.fileCharCount = fileCharCount;
    stateRef.current.phase = phase;
    stateRef.current.fileIdx = fileIdx;
  }, [charCount, fileCharCount, phase, fileIdx]);

  useEffect(() => {
    if (!isPlaying || reducedMotion) return;

    let rafId = 0;
    stateRef.current.lastTick = performance.now();

    const stepFrame = (now: number) => {
      const s = stateRef.current;
      const dt = Math.min(120, Math.max(0, now - s.lastTick)) * speed;
      s.lastTick = now;

      const activeSnippet = STUDIO_BIO_SNIPPETS[s.fileIdx];
      const maxChars = getTotalCharCount(activeSnippet.lines);

      if (s.phase === 'typing') {
        s.carryMs += dt;
        const charStep = Math.floor(s.carryMs / 22);
        if (charStep > 0) {
          s.carryMs -= charStep * 22;
          const nextCount = Math.min(maxChars, s.charCount + charStep);
          s.charCount = nextCount;
          setCharCount(nextCount);
          if (nextCount >= maxChars) {
            s.phase = 'holding';
            s.holdElapsed = 0;
            s.carryMs = 0;
            setPhase('holding');
          }
        }
      } else if (s.phase === 'holding') {
        s.holdElapsed += dt;
        if (s.holdElapsed >= 2200) {
          s.phase = 'backspacing';
          s.holdElapsed = 0;
          s.carryMs = 0;
          setPhase('backspacing');
        }
      } else if (s.phase === 'backspacing') {
        s.carryMs += dt;
        const backStep = Math.floor(s.carryMs / 5);
        if (backStep > 0) {
          s.carryMs -= backStep * 5;
          const nextCount = Math.max(0, s.charCount - backStep);
          s.charCount = nextCount;
          setCharCount(nextCount);
          if (nextCount <= 0) {
            s.phase = 'backspacing-file';
            s.carryMs = 0;
            setPhase('backspacing-file');
          }
        }
      } else if (s.phase === 'backspacing-file') {
        s.carryMs += dt;
        const fileBackStep = Math.floor(s.carryMs / 28);
        if (fileBackStep > 0) {
          s.carryMs -= fileBackStep * 28;
          const nextFileChars = Math.max(0, s.fileCharCount - fileBackStep);
          s.fileCharCount = nextFileChars;
          setFileCharCount(nextFileChars);
          if (nextFileChars <= 0) {
            const nextFile = (s.fileIdx + 1) % STUDIO_BIO_SNIPPETS.length;
            s.fileIdx = nextFile;
            s.phase = 'typing-file';
            s.carryMs = 0;
            setFileIdx(nextFile);
            setSelectedLineIdx(null);
            setPhase('typing-file');
          }
        }
      } else if (s.phase === 'typing-file') {
        const targetFileLen = STUDIO_BIO_SNIPPETS[s.fileIdx].file.length;
        s.carryMs += dt;
        const fileTypeStep = Math.floor(s.carryMs / 36);
        if (fileTypeStep > 0) {
          s.carryMs -= fileTypeStep * 36;
          const nextFileChars = Math.min(
            targetFileLen,
            s.fileCharCount + fileTypeStep
          );
          s.fileCharCount = nextFileChars;
          setFileCharCount(nextFileChars);
          if (nextFileChars >= targetFileLen) {
            s.phase = 'typing';
            s.carryMs = 0;
            setPhase('typing');
          }
        }
      }

      rafId = window.requestAnimationFrame(stepFrame);
    };

    rafId = window.requestAnimationFrame(stepFrame);
    return () => window.cancelAnimationFrame(rafId);
  }, [isPlaying, speed, totalChars, currentSnippet.file.length, reducedMotion]);

  const handleNextFile = () => {
    const nextIdx = (fileIdx + 1) % STUDIO_BIO_SNIPPETS.length;
    const nextLen = STUDIO_BIO_SNIPPETS[nextIdx].file.length;
    stateRef.current.charCount = 0;
    stateRef.current.fileCharCount = nextLen;
    stateRef.current.phase = 'typing';
    stateRef.current.fileIdx = nextIdx;
    stateRef.current.carryMs = 0;
    stateRef.current.holdElapsed = 0;
    setCharCount(0);
    setFileCharCount(nextLen);
    setPhase('typing');
    setFileIdx(nextIdx);
    setSelectedLineIdx(null);
  };

  const visibleLines = useMemo(
    () => slicePreTokenizedLines(currentSnippet.lines, reducedMotion ? totalChars : charCount),
    [currentSnippet.lines, charCount, reducedMotion, totalChars]
  );

  // Automatically scroll the code viewport up when wrapped lines reach the bottom (especially on mobile)
  useEffect(() => {
    const el = scrollViewportRef.current;
    if (!el) return;
    if (charCount === 0) {
      el.scrollTop = 0;
      return;
    }
    el.scrollTop = el.scrollHeight;
  }, [charCount, fileIdx]);

  const isLight = canvasTheme === 'light';
  const tokenClasses = isLight ? LIGHT_TOKEN_CLASSES : DARK_TOKEN_CLASSES;
  const isEditingFilename =
    phase === 'backspacing-file' || phase === 'typing-file';
  const displayedFilename = currentSnippet.file.slice(0, reducedMotion ? currentSnippet.file.length : fileCharCount);

  return (
    <div className="relative">
      {/* ─── Layer 1: Pure Translucent Glass Outer Rim (No Outer Line Stroke + Open Bottom) ─── */}
      <div
        data-theme={canvasTheme}
        style={{
          background: isLight
            ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, rgba(241, 245, 249, 0.48) 48%, rgba(226, 232, 240, 0.16) 82%, transparent 100%)'
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.11) 0%, rgba(147, 197, 253, 0.05) 42%, rgba(0, 102, 255, 0.02) 78%, transparent 100%)',
          backdropFilter: 'blur(28px) saturate(185%)',
          WebkitBackdropFilter: 'blur(28px) saturate(185%)',
          boxShadow: isLight
            ? '0 20px 50px -16px rgba(15, 23, 42, 0.12)'
            : '0 -10px 40px -12px rgba(0, 102, 255, 0.18), 0 24px 64px -16px rgba(0, 0, 0, 0.65)',
        }}
        className="hh-editor relative mx-auto w-full max-w-[1320px] rounded-t-[24px] rounded-b-none p-[7px] pb-0 text-left sm:rounded-t-[30px] sm:rounded-b-none sm:px-[10px] sm:pt-[10px] sm:pb-0"
      >
        {/* ─── Layer 2: Inner Glossy Translucent Screen + Sleek 4px Bezel (Open Bottom Under Blur Layer) ─── */}
        <div
          style={{
            background: isLight
              ? 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.90) 0%, rgba(241, 245, 249, 0.84) 100%)'
              : 'radial-gradient(50% 50% at 50% 50%, rgba(10, 8, 36, 0.72) 0%, rgba(5, 4, 24, 0.78) 100%)',
            backdropFilter: 'blur(36px) saturate(170%)',
            WebkitBackdropFilter: 'blur(36px) saturate(170%)',
          }}
          className={`relative flex h-[430px] w-full flex-col overflow-hidden rounded-t-[17px] rounded-b-none border-[3px] border-b-0 sm:h-[560px] sm:rounded-t-[20px] sm:rounded-b-none sm:border-[4px] sm:border-b-0 lg:h-[640px] ${
            isLight ? 'border-[#0F172A]/85' : 'border-[#03050C]/90'
          }`}
        >

          {/* ─── Top IDE Tab Bar (Authentic Left-Aligned Flush VS Code / Cursor Active Tab — Zero Pill/Ring) ─── */}
          <div
            data-testid="studio-editor-tabbar"
            style={{
              fontFamily: "'Google Sans Code', var(--font-mono), monospace",
              backgroundColor: isLight
                ? 'rgba(226, 232, 240, 0.85)'
                : 'rgba(2, 4, 15, 0.82)',
              borderBottomColor: isLight
                ? 'rgba(15, 23, 42, 0.12)'
                : 'rgba(255, 255, 255, 0.10)',
            }}
            className="relative z-20 flex h-9 w-full shrink-0 items-stretch border-b sm:h-10"
          >
            {/* Left Gutter Column Spacer matching the 1px vertical hairline at left-4 (16px) / sm:left-12 (48px) */}
            <div
              aria-hidden="true"
              style={{
                borderRightColor: isLight
                  ? 'rgba(15, 23, 42, 0.16)'
                  : 'rgba(217, 217, 217, 0.28)',
              }}
              className="w-8 shrink-0 border-r sm:w-12"
            />

            {/* Single Active File Tab — Flush Rectangular IDE Tab, Zero Rounded Corners, Connects into Code Stage */}
            <div
              data-testid="studio-editor-active-tab"
              style={{
                backgroundColor: isLight
                  ? 'rgba(248, 250, 252, 0.96)'
                  : 'rgba(9, 11, 32, 0.94)',
                borderRightColor: isLight
                  ? 'rgba(15, 23, 42, 0.12)'
                  : 'rgba(255, 255, 255, 0.10)',
              }}
              className={`relative -mb-px flex h-[calc(100%+1px)] min-w-[168px] items-center gap-2.5 rounded-none border-t-2 border-r border-t-[#0066FF] px-3.5 text-[11.5px] leading-none font-medium select-none sm:min-w-[196px] sm:px-4 sm:text-[12.5px] ${
                isLight ? 'text-[#0F172A]' : 'text-white'
              }`}
            >
              {/* Language File Type Badge */}
              <span
                aria-hidden="true"
                style={{ color: currentSnippet.dotColor }}
                className="text-[10px] font-semibold tracking-tight uppercase"
              >
                {currentSnippet.languageLabel}
              </span>

              {/* Single Active Filename (Types & Backspaces when switching files) */}
              <span className="inline-flex min-h-[1em] items-center whitespace-pre">
                {displayedFilename}
                {isEditingFilename && (
                  <span
                    aria-hidden="true"
                    className={`ml-[1px] inline-block h-[1em] w-[1.5px] ${
                      isLight ? 'bg-[#0066FF]' : 'bg-[#38BDF8]'
                    }`}
                  />
                )}
              </span>
            </div>

            {/* Right Recessed Tab Strip Area — Subtle Tap Hint on Mobile/Desktop */}
            <div className="ml-auto hidden items-center pr-4 text-[11px] opacity-45 select-none sm:flex">
              <span className={isLight ? 'text-slate-700' : 'text-white/75'}>
                Click any line to inspect
              </span>
            </div>
          </div>

          {/* ─── Code Stage: 1px Vertical Architectural Hairline + Word-Wrapped Auto-Scrolling Code Area ─── */}
          <div className="relative min-h-0 flex-1 overflow-hidden">
            {/* The 1px Vertical Architectural Hairline aligned with the tab bar gutter */}
            <div
              aria-hidden="true"
              style={{
                backgroundColor: isLight
                  ? 'rgba(15, 23, 42, 0.18)'
                  : 'rgba(217, 217, 217, 0.38)',
              }}
              className="pointer-events-none absolute top-0 bottom-14 left-8 z-10 w-px sm:left-12"
            />

            {/* Scrollable Word-Wrapped Code Viewport (Auto-scrolls up as lines fill the canvas) */}
            <div
              ref={scrollViewportRef}
              style={{
                fontFamily: "'Google Sans Code', var(--font-mono), monospace",
              }}
              className="relative z-10 h-full overflow-x-hidden overflow-y-auto pt-3 pr-3 pb-24 pl-0 sm:pt-5 sm:pr-10 sm:pb-28 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="flex flex-col gap-0.5">
                {visibleLines.map((lineTokens, lineIdx) => {
                  const isLastVisibleLine =
                    lineIdx === visibleLines.length - 1;
                  const isSelected = selectedLineIdx === lineIdx;
                  const note =
                    currentSnippet.lineNotes[lineIdx] ??
                    'Engineered by CYNEX Studio for sub-second speed and conversion.';

                  return (
                    <div key={lineIdx} className="flex flex-col">
                      <div
                        role="button"
                        tabIndex={0}
                        aria-expanded={isSelected}
                        onClick={() =>
                          setSelectedLineIdx((prev) =>
                            prev === lineIdx ? null : lineIdx
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedLineIdx((prev) =>
                              prev === lineIdx ? null : lineIdx
                            );
                          }
                        }}
                        className={`group/line flex cursor-pointer items-baseline transition-colors ${
                          isSelected
                            ? isLight
                              ? 'bg-[#0066FF]/10'
                              : 'bg-[#0066FF]/18'
                            : isLight
                            ? 'hover:bg-slate-900/[0.04]'
                            : 'hover:bg-white/[0.04]'
                        }`}
                      >
                        {/* Line Number Gutter (Left of the 1px Hairline: w-8 on mobile, w-12 on desktop) */}
                        <span
                          aria-hidden="true"
                          className={`w-8 shrink-0 pr-2 text-right text-[11px] leading-[1.75] select-none tabular-nums sm:w-12 sm:pr-3.5 sm:text-[12px] ${
                            isSelected
                              ? isLight
                                ? 'font-semibold text-[#0066FF]'
                                : 'font-semibold text-[#38BDF8]'
                              : isLight
                              ? 'text-[#0F172A]/45'
                              : 'text-white/45'
                          }`}
                        >
                          {lineIdx + 1}
                        </span>

                        {/* Word-Wrapped Code Line (Never cut horizontally on mobile or desktop) */}
                        <div className="min-w-0 flex-1 py-0.5 pl-2.5 text-[12.5px] leading-[1.7] whitespace-pre-wrap break-words sm:pl-4 sm:text-[14.5px] md:text-[15.5px]">
                          {lineTokens.map((tok, tokIdx) => (
                            <span
                              key={tokIdx}
                              className={tokenClasses[tok.kind]}
                            >
                              {tok.text}
                            </span>
                          ))}
                          {isLastVisibleLine && !isEditingFilename && (
                            <span
                              aria-hidden="true"
                              className={`ml-[1px] inline-block h-[1.12em] w-[2px] translate-y-[0.18em] ${
                                isLight ? 'bg-[#0066FF]' : 'bg-[#38BDF8]'
                              } ${
                                phase === 'holding'
                                  ? 'animate-pulse'
                                  : 'opacity-95'
                              }`}
                            />
                          )}
                        </div>
                      </div>

                      {/* Tap-to-Inspect Line Explanation Tray (Stays cleanly indented to the code column) */}
                      {isSelected && (
                        <div
                          className={`ml-8 border-l-2 border-[#0066FF] py-1.5 pr-3 pl-2.5 font-sans text-[11.5px] leading-relaxed sm:ml-12 sm:pl-4 sm:text-[12.5px] ${
                            isLight
                              ? 'bg-[#0066FF]/[0.06] text-slate-700'
                              : 'bg-[#0066FF]/[0.10] text-slate-200'
                          }`}
                        >
                          <span className="font-medium text-[#0066FF] dark:text-[#38BDF8]">
                            Line {lineIdx + 1}:
                          </span>{' '}
                          {note}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Layer 4: Floating Bottom Dock Controls (z-30 on top of the bottom fade) ─── */}
      <div className="hh-editor pointer-events-none absolute inset-x-0 bottom-4 z-30 flex justify-center">
        <div
          role="toolbar"
          aria-label="Canvas controls"
          className="pointer-events-auto flex gap-1 rounded-[10px] bg-bg p-[5px] shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
        >
          {/* Play / Pause Typing */}
          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            aria-pressed={isPlaying}
            aria-label={isPlaying ? 'Pause typing' : 'Resume typing'}
            className={`grid size-10 cursor-pointer place-items-center rounded-[6px] transition-colors ${
              isPlaying ? 'bg-blue-500 text-white' : 'text-fg hover:bg-tint'
            }`}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Cycle / Next Language File */}
          <button
            type="button"
            onClick={handleNextFile}
            aria-label={`Switch language file (current: ${currentSnippet.file})`}
            className="grid size-10 cursor-pointer place-items-center rounded-[6px] text-fg transition-colors hover:bg-tint"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </button>

          {/* Speed Toggle (1X / 1.5X / 0.5X) */}
          <button
            type="button"
            onClick={() => setSpeedIdx((i) => (i + 1) % SPEEDS.length)}
            aria-label={`Typing speed, ${speed}x`}
            className="grid size-10 cursor-pointer place-items-center rounded-[6px] text-[13px] leading-none font-semibold text-fg transition-colors hover:bg-tint"
          >
            {speed}X
          </button>

          {/* Canvas Theme Toggle (Dark / Light) */}
          <button
            type="button"
            onClick={() =>
              setCanvasTheme(canvasTheme === 'dark' ? 'light' : 'dark')
            }
            aria-label={`Canvas theme, ${canvasTheme}`}
            className="grid size-10 cursor-pointer place-items-center rounded-[6px] text-fg transition-colors hover:bg-tint"
          >
            {canvasTheme === 'light' ? (
              <svg
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
              >
                <path d="M12 4V3m5.657 3.343l.707-.707M20 12h1m-3.343 5.657l.707.707M12 20v1m-5.657-3.343l-.707.707M4 12H3m3.343-5.657l-.707-.707M17 12a5 5 0 1 1-10 0a5 5 0 0 1 10 0Z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="size-5"
                fill="currentColor"
              >
                <path d="m13.38 4.121l-.91.412a1 1 0 0 1 1.082-1.397zM14 7h1zm-9.879 6.38l-.985.171a1 1 0 0 1 1.397-1.082zM20 12h1zm-6.62-7.879l.912-.412A8 8 0 0 1 15 7h-2c0-.88-.19-1.715-.53-2.467zM14 7h1a8 8 0 0 1-8 8v-2a6 6 0 0 0 6-6zm-7 7v1a8 8 0 0 1-3.29-.709l.411-.911l.412-.911A6 6 0 0 0 7 13zm-2.879-.62l.985-.171A7 7 0 0 0 12 19v2c-4.443 0-8.128-3.218-8.864-7.449zM12 20v-1a7 7 0 0 0 7-7h2a9 9 0 0 1-9 9zm8-8h-1a7 7 0 0 0-5.79-6.894l.17-.985l.172-.985C17.782 3.872 21 7.558 21 12z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
