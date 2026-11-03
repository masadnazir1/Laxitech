'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Cloud, Code2, Expand, RotateCcw, Workflow, X } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { SplitRollText } from '@/components/ui/SplitRollText';
import { HERO_SERVICES, type HeroService } from '@/data/heroExperience';
import { HeroServiceDemo } from './HeroServiceDemo';

const MacBookCanvas = dynamic(() => import('./MacBookCanvas'), { ssr: false });
const ICONS = { software: Code2, automation: Workflow, cloud: Cloud };

function subscribeCompact(callback: () => void) {
  const query = window.matchMedia('(max-width: 700px), (pointer: coarse)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}

function useCompactScreen() {
  return useSyncExternalStore(subscribeCompact, () => window.matchMedia('(max-width: 700px), (pointer: coarse)').matches, () => false);
}

function ServiceTabs({ service, onChange, scope, panelId }: {
  service: HeroService;
  onChange: (next: HeroService) => void;
  scope: string;
  panelId: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();

  const navigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % HERO_SERVICES.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + HERO_SERVICES.length) % HERO_SERVICES.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = HERO_SERVICES.length - 1;
    else return;
    event.preventDefault();
    onChange(HERO_SERVICES[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div className="lx-service-tabs" role="tablist" aria-label="Explore Laxitech services">
      {HERO_SERVICES.map((item, index) => {
        const Icon = ICONS[item.id];
        const selected = service === item.id;
        return (
          <button
            key={item.id}
            id={`${scope}-${item.id}`}
            ref={(element) => { refs.current[index] = element; }}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(event) => navigate(event, index)}
            className={`lx-service-tab ${selected ? 'is-active' : ''}`}
          >
            <Icon aria-hidden="true" /><span>{item.label}</span>
            {selected && <motion.span layoutId={`${scope}-indicator`} className="lx-service-indicator" transition={{ duration: reduced ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }} />}
          </button>
        );
      })}
    </div>
  );
}

export function MacBookStage({ showTable = true }: { showTable?: boolean }) {
  const { resolvedTheme } = useTheme();
  const compact = useCompactScreen();
  const id = useId().replace(/:/g, '');
  const screenRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [ready, setReady] = useState(false);
  const [settled, setSettled] = useState(false);
  const [failed, setFailed] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [service, setService] = useState<HeroService>('software');
  const [dialogOpen, setDialogOpen] = useState(false);
  const activeService = HERO_SERVICES.find((item) => item.id === service)!;
  const handleReady = useCallback(() => setReady(true), []);
  const handleSettled = useCallback(() => setSettled(true), []);
  const handleFailure = useCallback(() => { setFailed(true); setReady(false); setSettled(false); }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialogOpen || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [dialogOpen]);

  const replay = () => {
    setSettled(false);
    setReplayKey((value) => value + 1);
  };

  return (
    <div className="lx-device-experience" data-table={showTable}>
      <div className="lx-device-stage" data-ready={ready} data-settled={settled} data-failed={failed}>
        <span className="lx-device-shadow" aria-hidden="true" />
        <picture className="lx-scene-poster">
          <source media="(prefers-reduced-motion: reduce) and (max-width: 600px)" srcSet={`/hero/mobile-${showTable ? 'table' : 'solo'}-${resolvedTheme}.webp`} />
          <source media="(prefers-reduced-motion: reduce)" srcSet={`/hero/desktop-${showTable ? 'table' : 'solo'}-${resolvedTheme}.webp`} />
          <source media="(max-width: 600px)" srcSet={`/hero/mobile-${showTable ? 'table' : 'solo'}-${resolvedTheme}${failed ? '' : '-closed'}.webp`} />
          <Image src={`/hero/desktop-${showTable ? 'table' : 'solo'}-${resolvedTheme}${failed ? '' : '-closed'}.webp`} width={1360} height={560} alt="" unoptimized loading="eager" fetchPriority="high" />
        </picture>
        {!failed && <MacBookCanvas screenRef={screenRef} theme={resolvedTheme} showTable={showTable} replayKey={replayKey} onReady={handleReady} onSettled={handleSettled} onFailure={handleFailure} />}
        <div
          ref={screenRef}
          id={`${id}-screen`}
          className="lx-projected-screen"
          data-ui
          role="tabpanel"
          aria-labelledby={`${id}-${service}`}
          aria-hidden={!ready || !settled || compact}
          inert={!ready || compact || !settled}
        >
          <HeroServiceDemo service={service} />
        </div>
        <div className="lx-stage-actions">
          {failed ? <button type="button" onClick={() => setFailed(false)} className="lx-scene-action"><RotateCcw /> Load 3D view</button> : (
            <button type="button" onClick={replay} className="lx-scene-action lx-replay" disabled={!ready || !settled} aria-label="Replay the MacBook opening"><RotateCcw /><span>Replay</span></button>
          )}
          <button type="button" className="lx-scene-action" onClick={() => setDialogOpen(true)} aria-haspopup="dialog"><Expand /><SplitRollText text="Open preview" /></button>
        </div>
      </div>
      <div className="lx-experience-navigation">
        <ServiceTabs service={service} onChange={setService} scope={id} panelId={`${id}-screen`} />
        <div className="lx-experience-caption" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={service} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>{activeService.caption}</motion.p>
          </AnimatePresence>
          <Link href={activeService.href} aria-label={`Explore ${activeService.label.toLowerCase()}`}><ArrowUpRight /></Link>
        </div>
      </div>
      <dialog ref={dialogRef} className="lx-preview-dialog" data-lenis-prevent aria-labelledby={`${id}-dialog-title`} onCancel={() => setDialogOpen(false)} onClose={() => setDialogOpen(false)} onClick={(event) => {
        if (event.target === event.currentTarget) {
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setDialogOpen(false);
        }
      }}>
        <div className="lx-preview-dialog-header"><div><h2 id={`${id}-dialog-title`}>See the possibilities.</h2><p>Explore the engineering behind your next project.</p></div><button type="button" onClick={() => setDialogOpen(false)} aria-label="Close interactive preview"><X /></button></div>
        {dialogOpen && <><ServiceTabs service={service} onChange={setService} scope={`${id}-dialog`} panelId={`${id}-dialog-panel`} /><div id={`${id}-dialog-panel`} role="tabpanel" aria-labelledby={`${id}-dialog-${service}`}><HeroServiceDemo service={service} /></div></>}
      </dialog>
    </div>
  );
}
