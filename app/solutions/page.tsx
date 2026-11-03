import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { ENGINEERING_SERVICES, SOLUTION_TRACKS } from '@/data/laxitechSite';
import { PageIntro, PageClose, Reveal, SectionHeading } from '@/components/site/Primitives';
import { ServiceDiagram } from '@/components/site/ServiceDiagram';
import { Faq } from '@/components/site/Faq';
import { siteMetadata } from '@/lib/siteMetadata';

export const metadata = siteMetadata('Engineering solutions', 'Launch a product, modernize your systems or extend your engineering team with Laxitech.', '/solutions');

export default function SolutionsPage() {
  return <><PageIntro lines={['Built for', 'your kind of work.']} description="A new idea, an existing platform or a team that needs another pair of experienced hands. Start where you are." /><section className="site-container site-solution-tracks">{SOLUTION_TRACKS.map((track, index) => <Reveal key={track.title} className="site-solution-track"><div><h2>{track.title}</h2><p>{track.description}</p><ul>{track.deliverables.map((item) => <li key={item}><Check />{item}</li>)}</ul><Link href={`/contact?service=${encodeURIComponent(track.title)}`} className="site-inline-link">Talk through your project <ArrowUpRight /></Link></div><ServiceDiagram kind={index === 0 ? 'software' : index === 1 ? 'automation' : 'security'} label={track.title} nodes={index === 0 ? ['The idea', 'The product', 'The launch'] : index === 1 ? ['Your systems', 'The improvements', 'Your next step'] : ['Your team', 'Our specialists', 'Shared delivery']} /><div className="site-solution-services">{track.services.map((slug) => <Link href={`/services/${slug}`} key={slug}>{ENGINEERING_SERVICES.find((service) => service.slug === slug)?.name}<ArrowUpRight /></Link>)}</div></Reveal>)}</section><section className="site-section site-container"><SectionHeading title="A partnership that fits." /><div className="site-engagements">{[['A defined project', 'An agreed scope, milestones and deliverables for a specific outcome.'], ['A specialist workstream', 'Focused engineering for one part of your product or infrastructure.'], ['An ongoing partner', 'A continuing relationship for improvements, operations and technical support.']].map(([title, text]) => <Reveal key={title}><h3>{title}</h3><p>{text}</p></Reveal>)}</div></section><Faq /><PageClose /></>;
}
