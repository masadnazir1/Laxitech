import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ENGINEERING_SERVICES } from '@/data/laxitechSite';
import { PageIntro, PageClose, Reveal } from '@/components/site/Primitives';
import { ServiceDiagram } from '@/components/site/ServiceDiagram';
import { DeliveryProcess } from '@/components/site/DeliveryProcess';
import { siteMetadata } from '@/lib/siteMetadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { getServicesCollectionSchema } from '@/lib/schema';

export const metadata = siteMetadata(
  'Engineering Services & Systems Architecture',
  'End-to-end engineering services: bespoke software engineering, multi-cloud architecture, DevOps automation, AI workflows, and zero-trust security.',
  '/services'
);

export default function ServicesPage() {
  const breadcrumbs = [
    { name: 'Home', item: '/' },
    { name: 'Services', item: '/services' },
  ];

  return (
    <>
      <JsonLd data={getServicesCollectionSchema()} />
      <PageIntro
        breadcrumbs={breadcrumbs}
        lines={['Built around', 'your ambition.']}
        description="A complete engineering practice, or the specialist support your team needs next."
      />
      <section className="site-container site-service-directory">
        {ENGINEERING_SERVICES.map((service, index) => (
          <Reveal
            key={service.slug}
            id={service.kind === 'devops' ? 'transformation' : service.kind}
            className={`site-service-feature ${index % 2 ? 'is-reversed' : ''}`}
          >
            <div className="site-service-feature-copy">
              {service.kind === 'devops' && <span id="devops" />}
              <h2>{service.name}</h2>
              <p>{service.summary}</p>
              <ul>
                {service.deliverables.slice(0, 3).map((item) => (
                  <li key={item.title}>{item.title}</li>
                ))}
              </ul>
              <Link className="site-inline-link" href={`/services/${service.slug}`}>
                Explore the service <ArrowUpRight />
              </Link>
            </div>
            <ServiceDiagram kind={service.kind} label={service.name} nodes={service.nodes} />
          </Reveal>
        ))}
      </section>
      <DeliveryProcess />
      <PageClose />
    </>
  );
}
