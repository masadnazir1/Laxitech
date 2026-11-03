'use client';

import { useState } from 'react';
import { TransitionPanel } from '@/components/motion/TransitionPanel';
import { Reveal, SiteButton } from '@/components/site/Primitives';
import { SelectionControl } from '@/components/site/SelectionControl';
import { KexsioThreads } from './KexsioThreads';

const CHAPTERS = [
  { id: 'build', label: 'Build', title: 'Start with the right foundations.', description: 'Shape the application around your customers, your team and the work it needs to do. Design and engineering belong in the same conversation.', href: '/services/software-engineering', action: 'Explore software engineering' },
  { id: 'connect', label: 'Connect', title: 'Make your systems work together.', description: 'Connect applications, information and everyday workflows. Choose automation where it helps, with clear checks and people in control.', href: '/services/ai-automation', action: 'Explore intelligent automation' },
  { id: 'operate', label: 'Operate', title: 'Think beyond launch day.', description: 'Plan the infrastructure, maintenance and handover alongside the build. Agree the support your team needs to keep moving forward.', href: '/services/infrastructure', action: 'Explore infrastructure' },
] as const;

export function ImpactScrollStage() {
  const [active, setActive] = useState<(typeof CHAPTERS)[number]['id']>('build');
  const chapter = CHAPTERS.find((item) => item.id === active) ?? CHAPTERS[0];

  return <section id="impact-showcase" className="site-capability-section" data-atmosphere="threads" aria-labelledby="capability-title">
    <KexsioThreads />
    <div className="site-container site-capability-content">
      <Reveal><h2 id="capability-title">From idea.<br />To everyday.</h2><p className="site-capability-intro">A connected engineering practice, through every chapter of your business.</p></Reveal>
      <SelectionControl label="Explore our engineering approach" value={active} onChange={setActive} options={CHAPTERS.map((item) => ({ value: item.id, label: item.label }))} />
      <div className="site-capability-chapter" aria-live="polite"><TransitionPanel activeKey={active}><h3>{chapter.title}</h3><p>{chapter.description}</p><SiteButton href={chapter.href} secondary>{chapter.action}</SiteButton></TransitionPanel></div>
    </div>
  </section>;
}
