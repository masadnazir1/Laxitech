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
  const services = ENGINEERING_SERVICES.slice(0, 4);
  const selected = services[active];
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
      <p className="site-services-note">Looking for AI automation or specialist security engineering? <Link href="/services">Explore the full practice.</Link></p>
    </section>
  );
}
