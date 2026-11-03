'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { TransitionPanel } from '@/components/motion/TransitionPanel';
import { EngineeringIllustration } from '@/components/illustrations/EngineeringIllustration';
import { HERO_SERVICES, type HeroService } from '@/data/heroExperience';

const SCENES = {
  software: { lines: ['Built around', 'your business.'], description: 'Thoughtful software. From the first interaction to the systems behind it.', details: ['Web & mobile', 'Business applications', 'APIs & integrations'] },
  automation: { lines: ['Make room', 'for better work.'], description: 'Connect your tools and give repetitive work a more useful destination.', details: ['Connected workflows', 'Document processing', 'Human oversight'] },
  cloud: { lines: ['A foundation', 'for what’s next.'], description: 'Considered cloud architecture, from your application to its everyday operation.', details: ['Cloud architecture', 'Careful migration', 'Ongoing operations'] },
} as const;

export function HeroServiceDemo({ service }: { service: HeroService }) {
  const scene = SCENES[service];
  const selected = HERO_SERVICES.find((item) => item.id === service) ?? HERO_SERVICES[0];
  return (
    <div className="lx-service-preview">
      <div className="lx-preview-masthead"><span>Laxitech</span><span>Engineering, connected.</span></div>
      <TransitionPanel activeKey={service}>
        <div className="lx-preview-story"><div className="lx-preview-copy"><h2>{scene.lines[0]}<br />{scene.lines[1]}</h2><p>{scene.description}</p><Link href={selected.href}>Explore the service <ArrowUpRight aria-hidden="true" /></Link></div><EngineeringIllustration kind={service} compact caption={false} /></div>
        <ul className="lx-preview-capabilities">{scene.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
      </TransitionPanel>
    </div>
  );
}
