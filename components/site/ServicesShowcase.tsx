'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { ENGINEERING_SERVICES } from '@/data/laxitechSite';
import { Reveal, SectionHeading } from './Primitives';
import { ServiceDiagram } from './ServiceDiagram';
import { TransitionPanel } from '@/components/motion/TransitionPanel';
import { EngineeringIllustration } from '@/components/illustrations/EngineeringIllustration';

export function ServicesShowcase() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const services = ENGINEERING_SERVICES;
  const selected = services[active] || services[0];
  return (
    <section id="services" className="site-section site-container" data-atmosphere="beams">
      <SectionHeading title={<>One team.<br />Every layer.</>} description="From the interface people use to the infrastructure behind it." action="All engineering services" href="/services" />
      <div className="site-services-showcase">
        <div className="site-services-list">
          {services.map((service, index) => <div className={`site-service-row ${active === index ? 'is-active' : ''}`} key={service.slug}>
            <h3><button type="button" onClick={() => setActive(index)} aria-expanded={active === index} aria-controls={`service-panel-${service.slug}`}>{service.name}<span className="site-disclosure-icon" aria-hidden="true"><span /><span /></span></button></h3>
            <AnimatePresence initial={false}>{active === index && <motion.div id={`service-panel-${service.slug}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }} className="site-service-row-body"><p>{service.summary}</p><Link href={`/services/${service.slug}`}>Explore this service <ArrowUpRight aria-hidden="true" /></Link><div className="site-service-mobile-art"><EngineeringIllustration kind={service.kind} compact caption={false} /></div></motion.div>}</AnimatePresence>
          </div>)}
        </div>
        <Reveal className="site-services-art" delay={0.1}><TransitionPanel activeKey={selected.slug}><ServiceDiagram key={selected.slug} kind={selected.kind} label={selected.name} nodes={selected.nodes} /></TransitionPanel></Reveal>
      </div>
      <div className="site-services-directory-links mt-8 pt-6 border-t border-line-strong">
        <p className="site-services-note mb-3">Explore all engineering disciplines: <Link href="/services" className="font-medium underline underline-offset-4 hover:text-accent">View all services</Link></p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-muted list-none p-0 m-0">
          {ENGINEERING_SERVICES.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="hover:text-fg transition-colors">
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
