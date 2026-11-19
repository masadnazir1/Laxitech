import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { ENGINEERING_SERVICES, SERVICE_ALIASES } from '@/data/laxitechSite';
import { PageIntro, PageClose, Reveal, SectionHeading, SiteButton } from '@/components/site/Primitives';
import { ServiceDiagram } from '@/components/site/ServiceDiagram';
import { DeliveryProcess } from '@/components/site/DeliveryProcess';
import { Faq } from '@/components/site/Faq';
import { siteMetadata } from '@/lib/siteMetadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { getServiceSchema } from '@/lib/schema';

export function generateStaticParams() {
  return [...ENGINEERING_SERVICES.map(({ slug }) => ({ slug })), ...Object.keys(SERVICE_ALIASES).map((slug) => ({ slug }))];
}

const SERVICE_SEO: Record<string, { title: string; description: string }> = {
  'software-engineering': {
    title: 'Custom Software Engineering & Web Development',
    description: 'High-performance web applications, mobile platforms, and desktop systems engineered around your exact operational workflows and business objectives.',
  },
  'cloud-architecture': {
    title: 'Cloud Architecture & Zero-Downtime Migration',
    description: 'Strategic cloud design, workload assessment, and resilient multi-cloud migrations across AWS, Azure, and Google Cloud with verified disaster recovery.',
  },
  'infrastructure': {
    title: 'IT Infrastructure Design & Systems Operations',
    description: 'Dependable enterprise IT infrastructure, virtualization, network design, and server administration built to maintain continuity across your operations.',
  },
  'devops-automation': {
    title: 'DevOps CI/CD Automation & Delivery Pipelines',
    description: 'Streamline software delivery with automated CI/CD pipelines, repeatable infrastructure as code, container orchestration, and continuous testing checks.',
  },
  'ai-automation': {
    title: 'AI & Intelligent Workflow Automation Systems',
    description: 'Transform manual operational overhead into automated intelligent workflows, custom AI integrations, and reliable data pipelines built for efficiency.',
  },
  'security-engineering': {
    title: 'Security Engineering & Application Hardening',
    description: 'Protect business-critical data with defense-in-depth security engineering, rigorous access control architectures, vulnerability auditing, and encryption.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = ENGINEERING_SERVICES.find((item) => item.slug === slug);
  const seo = SERVICE_SEO[slug];
  if (!service) return { title: 'Engineering services' };
  return siteMetadata(
    seo?.title || service.name,
    seo?.description || service.summary,
    `/services/${slug}`
  );
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (SERVICE_ALIASES[slug]) permanentRedirect(SERVICE_ALIASES[slug]);
  const service = ENGINEERING_SERVICES.find((item) => item.slug === slug);
  if (!service) notFound();

  const breadcrumbs = [
    { name: 'Home', item: '/' },
    { name: 'Services', item: '/services' },
    { name: service.name, item: `/services/${slug}` },
  ];

  const relatedServices = ENGINEERING_SERVICES.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <>
      <JsonLd data={getServiceSchema(slug, service.name, service.summary)} />
      <PageIntro
        breadcrumbs={breadcrumbs}
        lines={service.headline}
        description={service.summary}
        action="Scope this service"
        href={`/contact?service=${slug}`}
      />
      <section className="site-container site-service-overview">
        <Reveal>
          <p className="site-large-statement">{service.introduction}</p>
          <div className="site-stack-tags" aria-label="Relevant technologies">
            {service.stack.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>
        <ServiceDiagram kind={service.kind} label={service.name} nodes={service.nodes} />
      </section>
      <section className="site-section site-container">
        <SectionHeading title="What we can build together." />
        <div className="site-deliverables">
          {service.deliverables.map((item) => (
            <Reveal key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="site-outcome-section">
        <div className="site-container">
          <Reveal>
            <p>{service.outcome}</p>
            <SiteButton href={`/contact?service=${slug}`}>Discuss your requirements</SiteButton>
          </Reveal>
        </div>
      </section>
      <section className="site-section site-container">
        <SectionHeading
          title="Related engineering disciplines."
          description="Explore complementary capabilities across our practice."
          action="All services"
          href="/services"
        />
        <div className="site-deliverables">
          {relatedServices.map((rel) => (
            <Reveal key={rel.slug}>
              <h3>{rel.name}</h3>
              <p>{rel.summary}</p>
              <Link className="site-inline-link" href={`/services/${rel.slug}`}>
                Explore service <ArrowUpRight />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <DeliveryProcess />
      <Faq />
      <PageClose service={slug} title="A clear next step." />
    </>
  );
}
