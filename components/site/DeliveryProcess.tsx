'use client';

import { Check, ArrowUpRight } from 'lucide-react';
import { DELIVERY_STEPS } from '@/data/laxitechSite';
import { ProcessIllustration } from '@/components/illustrations/ProcessIllustration';
import { Reveal, SectionHeading, SiteButton } from './Primitives';

export function DeliveryProcess() {
  return <section className="site-section site-container" id="process" data-atmosphere="mesh"><SectionHeading title={<>Good work.<br />Clear progress.</>} description="You should always know what we’re building, why it matters and what comes next." /><div className="site-process-grid">{DELIVERY_STEPS.map((step, index) => <Reveal className="site-process-step" key={step.title} delay={index * 0.07}><div className="site-process-mark" aria-hidden="true"><ProcessIllustration kind={step.illustration} />{index === DELIVERY_STEPS.length - 1 ? <Check /> : <ArrowUpRight />}</div><h3>{step.title}</h3><p>{step.description}</p><span className="site-process-detail">{step.detail}</span></Reveal>)}</div><div className="site-process-foot"><span>A shared plan. Direct communication. A proper handover.</span><SiteButton href="/contact" secondary>Talk about your project</SiteButton></div></section>;
}
