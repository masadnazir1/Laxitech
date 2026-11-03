'use client';

import { useId, useRef, type CSSProperties, type ReactNode } from 'react';
import { motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react';
import type { ServiceKind } from '@/data/laxitechSite';

export type IllustrationKind = ServiceKind | 'mail' | 'vps';

const point = (x: number, y: number, z = 0): [number, number] => [360 + (x - y) * 0.82, 306 + (x + y) * 0.42 - z];
const points = (...vertices: [number, number, number][]) => vertices.map(([x, y, z]) => point(x, y, z).join(',')).join(' ');

function Block({ x, y, z = 0, width, depth, height, accent = false, children }: { x: number; y: number; z?: number; width: number; depth: number; height: number; accent?: boolean; children?: ReactNode }) {
  return <g className={accent ? 'iso-block iso-block--accent' : 'iso-block'}>
    <polygon className="iso-face-front" points={points([x, y + depth, z], [x + width, y + depth, z], [x + width, y + depth, z + height], [x, y + depth, z + height])} />
    <polygon className="iso-face-side" points={points([x + width, y, z], [x + width, y + depth, z], [x + width, y + depth, z + height], [x + width, y, z + height])} />
    <polygon className="iso-face-top" points={points([x, y, z + height], [x + width, y, z + height], [x + width, y + depth, z + height], [x, y + depth, z + height])} />
    <polyline className="iso-edge-light" points={points([x, y + depth, z + height], [x, y, z + height], [x + width, y, z + height])} />
    {children}
  </g>;
}

function Face({ x, y, z, width, height, className = '' }: { x: number; y: number; z: number; width: number; height: number; className?: string }) {
  return <polygon className={className} points={points([x, y, z], [x + width, y, z], [x + width, y, z + height], [x, y, z + height])} />;
}

function Server({ x = -95, y = -48, z = 0, width = 190, depth = 106 }: { x?: number; y?: number; z?: number; width?: number; depth?: number }) {
  const led = point(x + width - 19, y + depth + 0.4, z + 17);
  return <Block x={x} y={y} z={z} width={width} depth={depth} height={33}>
    <Face x={x + 10} y={y + depth + 0.2} z={z + 8} width={width - 42} height={17} className="iso-port-well" />
    {Array.from({ length: 11 }, (_, index) => <Face key={index} x={x + 17 + index * (width - 62) / 11} y={y + depth + 0.4} z={z + 12} width={3} height={9} className="iso-port" />)}
    <circle cx={led[0]} cy={led[1]} r={2.8} className="iso-led" />
  </Block>;
}

function ServerStack() {
  return <g>
    <Server z={0} />
    <g className="iso-separate-middle"><Server z={45} /></g>
    <g className="iso-separate-top"><Server z={90} /></g>
    <g className="iso-resource-chip"><Block x={-35} y={-2} z={151} width={65} depth={52} height={9} accent />
      <polygon className="iso-chip-mark" points={points([-20, 12, 161], [15, 12, 161], [15, 35, 161], [-20, 35, 161])} />
    </g>
  </g>;
}

function CloudShape() {
  const shape = 'M-83 34C-110 33-125 17-125-4C-125-24-111-40-91-43C-86-70-67-84-44-82C-19-113 36-105 55-70C90-76 120-49 116-16C143 12 121 48 86 47L-76 47Z';
  return <g className="iso-cloud-float" transform="translate(389 151) scale(.79)"><path d={shape} transform="translate(14 17)" className="iso-cloud-depth" /><path d={shape} className="iso-cloud-front" /><path d="M-90-39C-84-65-66-80-43-78C-17-106 30-101 50-72" className="iso-cloud-glint" /></g>;
}

function Database({ x, y, z = 0, radius = 42, height = 83 }: { x: number; y: number; z?: number; radius?: number; height?: number }) {
  const [cx, cy] = point(x, y, z);
  return <g>
    <path d={`M${cx-radius} ${cy-height}V${cy}C${cx-radius} ${cy+24} ${cx+radius} ${cy+24} ${cx+radius} ${cy}V${cy-height}Z`} className="iso-cylinder-body" />
    {[0, .33, .66].map((fraction) => <path key={fraction} d={`M${cx-radius} ${cy-height*fraction}C${cx-radius} ${cy-height*fraction+23} ${cx+radius} ${cy-height*fraction+23} ${cx+radius} ${cy-height*fraction}`} className="iso-cylinder-rim" />)}
    <ellipse cx={cx} cy={cy-height} rx={radius} ry={20} className="iso-cylinder-top" />
    <ellipse cx={cx} cy={cy-height} rx={radius-12} ry={13} className="iso-cylinder-inset" />
  </g>;
}

function SoftwareScene() {
  const dots = [0, 1, 2].map((index) => point(-107 + index * 12, 1, 202));
  return <g>
    <g className="iso-software-back"><Block x={-131} y={-39} z={86} width={211} depth={8} height={139} />
      <Face x={-121} y={-30} z={98} width={190} height={112} className="iso-screen-muted" />
    </g>
    <g className="iso-main-object">
      <Block x={-52} y={-38} z={-6} width={111} depth={72} height={10} />
      <Block x={-16} y={-21} z={4} width={34} depth={25} height={45} />
      <Block x={-122} y={-13} z={43} width={239} depth={13} height={170} />
      <Face x={-113} y={0.3} z={57} width={220} height={135} className="iso-screen" />
      {dots.map(([x, y], index) => <circle key={index} cx={x} cy={y} r={2.4} className="iso-browser-dot" />)}
      <Face x={-93} y={0.6} z={101} width={79} height={66} className="iso-ui-paper" />
      <Face x={3} y={0.6} z={150} width={75} height={9} className="iso-ui-line" />
      <Face x={3} y={0.6} z={133} width={57} height={7} className="iso-ui-line-soft" />
      <Face x={3} y={0.6} z={99} width={54} height={18} className="iso-ui-accent" />
      <Face x={-93} y={0.6} z={75} width={170} height={8} className="iso-ui-line-soft" />
    </g>
    <g className="iso-phone-float">
      <Block x={139} y={28} z={0} width={72} depth={10} height={141} />
      <Face x={146} y={38.3} z={12} width={58} height={111} className="iso-screen" />
      <Face x={154} y={38.6} z={74} width={42} height={37} className="iso-ui-paper" />
      <Face x={154} y={38.6} z={57} width={42} height={6} className="iso-ui-line" />
      <Face x={154} y={38.6} z={37} width={29} height={11} className="iso-ui-accent" />
    </g>
  </g>;
}

function CloudScene({ vps = false }: { vps?: boolean }) {
  return <g>{!vps && <CloudShape />}<g transform={vps ? 'translate(0 52)' : 'translate(-18 65)'}><ServerStack /></g>{vps && <g className="iso-memory-float"><Block x={126} y={-37} z={100} width={74} depth={49} height={8} accent /><polygon className="iso-chip-mark" points={points([139,-25,109],[185,-25,109],[185,-1,109],[139,-1,109])} /></g>}</g>;
}

function InfrastructureScene() {
  return <g>
    <polyline className="iso-network-path" points={points([-105,20,0],[-105,90,0],[83,90,0],[83,12,0])} />
    <polyline className="iso-network-path" points={points([-105,20,0],[-105,-65,0],[63,-65,0],[63,-113,0])} />
    <g className="iso-network-left"><Server x={-187} y={-14} width={135} depth={86} z={0} /><Server x={-187} y={-14} width={135} depth={86} z={42} /></g>
    <g className="iso-network-right"><Server x={46} y={64} width={138} depth={86} z={0} /><Server x={46} y={64} width={138} depth={86} z={42} /></g>
    <g className="iso-database-float"><Database x={31} y={-137} height={107} radius={43} /></g>
    <Block x={-43} y={56} z={4} width={66} depth={48} height={10} accent />
  </g>;
}

function PaperStack({ x, y, z = 0, count = 3 }: { x: number; y: number; z?: number; count?: number }) {
  return <g>{Array.from({ length: count }, (_, index) => <g key={index} className={index === count - 1 ? 'iso-paper-top' : undefined}><Block x={x + index * 4} y={y - index * 4} z={z + index * 10} width={82} depth={108} height={3} /><polyline className="iso-paper-line" points={points([x+16+index*4,y+25-index*4,z+index*10+4],[x+65+index*4,y+25-index*4,z+index*10+4])} /><polyline className="iso-paper-line" points={points([x+16+index*4,y+40-index*4,z+index*10+4],[x+53+index*4,y+40-index*4,z+index*10+4])} /></g>)}</g>;
}

function WorkflowScene() {
  return <g>
    <polyline className="iso-network-path" points={points([-118,39,5],[-118,114,5],[140,114,5],[140,39,5])} />
    <g className="iso-documents-in"><PaperStack x={-191} y={10} z={21} /></g>
    <Block x={-52} y={-37} width={133} depth={107} height={83} />
    <Face x={-40} y={70.3} z={15} width={108} height={49} className="iso-port-well" />
    <Face x={-23} y={70.6} z={32} width={73} height={13} className="iso-ui-accent" />
    <g className="iso-processor-float"><Block x={-15} y={-13} z={111} width={63} depth={52} height={8} accent /></g>
    <g className="iso-documents-out"><PaperStack x={139} y={36} z={21} count={2} /></g>
    <g transform="translate(495 309)" className="iso-check-float"><circle r={20} className="iso-check-disc" /><path d="m-8 0 6 6 11-13" className="iso-check-stroke" /></g>
  </g>;
}

function DevopsScene() {
  return <g>
    <Block x={-189} y={-24} z={-8} width={375} depth={90} height={9} />
    {[-142, -22, 99].map((x, index) => <g key={x} className={`iso-gate iso-gate-${index}`}>
      <Block x={x} y={-13} width={11} depth={12} height={120} />
      <Block x={x+76} y={-13} width={11} depth={12} height={120} />
      <Block x={x} y={-13} z={120} width={87} depth={12} height={11} accent={index === 2} />
    </g>)}
    <g className="iso-shipping-package"><Block x={-119} y={2} z={5} width={45} depth={44} height={45} accent /><polyline className="iso-package-seam" points={points([-97,2,51],[-97,46,51],[-97,46,5])} /></g>
    <g transform="translate(497 231)" className="iso-check-float"><circle r={19} className="iso-check-disc" /><path d="m-8 0 6 6 11-13" className="iso-check-stroke" /></g>
  </g>;
}

function SecurityScene() {
  const shield = 'M342 94 465 156 450 260Q429 324 343 364Q253 291 241 230L241 126Z';
  return <g>
    <g className="iso-protected-data"><Database x={139} y={7} radius={45} height={111} /><Server x={-164} y={30} width={129} depth={88} z={7} /></g>
    <g className="iso-shield-float"><path d={shield} transform="translate(14 12)" className="iso-shield-depth" /><path d={shield} className="iso-shield-face" /><path d="M342 118 442 168 429 252Q413 304 343 338Q272 277 262 225L262 143Z" className="iso-shield-inlay" /><g transform="translate(343 218) rotate(13)"><path d="M-20 0V-18a20 20 0 0 1 40 0V0" className="iso-lock-loop" /><rect x={-29} y={-1} width={58} height={46} rx={8} className="iso-lock-body" /><circle cy={19} r={5} className="iso-lock-key" /></g></g>
  </g>;
}

function MailScene() {
  return <g>
    <g className="iso-letter-float"><Block x={-132} y={-48} z={91} width={156} depth={6} height={146} /><Face x={-114} y={-41.8} z={195} width={113} height={7} className="iso-ui-line" /><Face x={-114} y={-41.8} z={177} width={82} height={6} className="iso-ui-line-soft" /></g>
    <g className="iso-envelope-float"><Block x={-148} y={-8} z={31} width={227} depth={13} height={131} /><polygon className="iso-envelope-left" points={points([-148,5.3,31],[-148,5.3,162],[-34.5,5.3,76])} /><polygon className="iso-envelope-right" points={points([79,5.3,31],[79,5.3,162],[-34.5,5.3,76])} /><polygon className="iso-envelope-flap" points={points([-148,5.5,162],[79,5.5,162],[-34.5,5.5,86])} /><polyline className="iso-envelope-seam" points={points([-148,5.8,31],[-34.5,5.8,105],[79,5.8,31])} /></g>
    <Block x={135} y={36} z={-3} width={101} depth={89} height={24} /><g className="iso-inbox-letters"><PaperStack x={144} y={32} z={26} count={2} /></g>
    <g transform="translate(530 237)" className="iso-check-float"><circle r={27} className="iso-at-disc" /><text textAnchor="middle" dominantBaseline="central" className="iso-at-symbol">@</text></g>
  </g>;
}

const CAPTIONS: Record<IllustrationKind, string> = {
  software: 'One product, across the screens people use.',
  cloud: 'Give your applications room to grow.',
  infrastructure: 'Connect the systems your business relies on.',
  devops: 'A considered path from code to release.',
  automation: 'Move the work forward, with fewer manual handoffs.',
  security: 'Build protection around your applications and data.',
  mail: 'Your business identity, in every conversation.',
  vps: 'Compute, memory and storage that fit the workload.',
};

export function EngineeringIllustration({ kind, label, compact = false, className = '', caption = true }: { kind: IllustrationKind; label?: string; compact?: boolean; className?: string; caption?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { margin: '100px' });
  const reduced = useReducedMotion();
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 100, damping: 22 });
  const rotateY = useSpring(y, { stiffness: 100, damping: 22 });
  const drift = useSpring(0, { stiffness: 70, damping: 24 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  useMotionValueEvent(scrollYProgress, 'change', (value) => { if (visible && !reduced && !compact) drift.set((0.5 - value) * 25); });

  return <figure ref={ref} className={`engineering-art ${compact ? 'engineering-art--compact' : ''} ${className}`} data-kind={kind} data-visible={visible} onPointerMove={(event) => {
    if (reduced || event.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(-((event.clientY - rect.top) / rect.height - .5) * 5);
    y.set(((event.clientX - rect.left) / rect.width - .5) * 7);
  }} onPointerLeave={() => { x.set(0); y.set(0); }}>
    <motion.div className="engineering-art-perspective" style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY, y: reduced ? 0 : drift }}>
      <svg viewBox="70 20 580 480" role="img" aria-label={label || CAPTIONS[kind]} className="engineering-art-svg">
        <defs>
          <filter id={`${id}-shadow`} x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation="11" /></filter>
          <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--art-top)" /><stop offset="1" stopColor="var(--art-front)" /></linearGradient>
          <linearGradient id={`${id}-top`} x1="0" y1="0" x2=".7" y2="1"><stop stopColor="var(--art-highlight)" /><stop offset="1" stopColor="var(--art-top)" /></linearGradient>
          <linearGradient id={`${id}-front`} x1="0" y1="0" x2="1" y2=".8"><stop stopColor="var(--art-front)" /><stop offset="1" stopColor="var(--art-front-shade)" /></linearGradient>
          <linearGradient id={`${id}-side`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="var(--art-side)" /><stop offset="1" stopColor="var(--art-side-shade)" /></linearGradient>
        </defs>
        <ellipse cx="360" cy="434" rx="184" ry="23" className="iso-ground-shadow" filter={`url(#${id}-shadow)`} />
        <g className="engineering-art-object" style={{ '--art-sheen': `url(#${id}-sheen)`, '--art-top-fill': `url(#${id}-top)`, '--art-front-fill': `url(#${id}-front)`, '--art-side-fill': `url(#${id}-side)` } as CSSProperties}>
          {kind === 'software' ? <SoftwareScene /> : kind === 'cloud' ? <CloudScene /> : kind === 'vps' ? <CloudScene vps /> : kind === 'infrastructure' ? <InfrastructureScene /> : kind === 'automation' ? <WorkflowScene /> : kind === 'devops' ? <DevopsScene /> : kind === 'security' ? <SecurityScene /> : <MailScene />}
        </g>
      </svg>
    </motion.div>
    {caption && <figcaption>{CAPTIONS[kind]}</figcaption>}
  </figure>;
}
