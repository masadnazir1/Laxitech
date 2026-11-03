import { notFound, permanentRedirect } from 'next/navigation';
import { ENGINEERING_SERVICES, SERVICE_ALIASES } from '@/data/laxitechSite';
import { PageIntro, PageClose, Reveal, SectionHeading, SiteButton } from '@/components/site/Primitives';
import { ServiceDiagram } from '@/components/site/ServiceDiagram';
import { DeliveryProcess } from '@/components/site/DeliveryProcess';
import { Faq } from '@/components/site/Faq';
import { siteMetadata } from '@/lib/siteMetadata';

export function generateStaticParams() {
  return [...ENGINEERING_SERVICES.map(({ slug }) => ({ slug })), ...Object.keys(SERVICE_ALIASES).map((slug) => ({ slug }))];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = ENGINEERING_SERVICES.find((item) => item.slug === slug);
  return service ? siteMetadata(service.name, service.summary, `/services/${slug}`) : { title: 'Engineering services' };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (SERVICE_ALIASES[slug]) permanentRedirect(SERVICE_ALIASES[slug]);
  const service = ENGINEERING_SERVICES.find((item) => item.slug === slug);
  if (!service) notFound();
  return <><PageIntro lines={service.headline} description={service.summary} action="Scope this service" href={`/contact?service=${slug}`} /><section className="site-container site-service-overview"><Reveal><p className="site-large-statement">{service.introduction}</p><div className="site-stack-tags" aria-label="Relevant technologies">{service.stack.map((item) => <span key={item}>{item}</span>)}</div></Reveal><ServiceDiagram kind={service.kind} label={service.name} nodes={service.nodes} /></section><section className="site-section site-container"><SectionHeading title="What we can build together." /><div className="site-deliverables">{service.deliverables.map((item) => <Reveal key={item.title}><h3>{item.title}</h3><p>{item.description}</p></Reveal>)}</div></section><section className="site-outcome-section"><div className="site-container"><Reveal><p>{service.outcome}</p><SiteButton href={`/contact?service=${slug}`}>Discuss your requirements</SiteButton></Reveal></div></section><DeliveryProcess /><Faq /><PageClose service={slug} title="A clear next step." /></>;
}
